// Fantastic Battles — Pure Rules, Calculation, Validation & Export Engine

import {
  PROFILE_MAP,
  TRAIT_MAP,
  RELIC_MAP,
  STRATEGY_MAP,
  SPELL_MAP,
  INCOMPATIBILITY_MAP
} from './data.js?v=7';

export function getUnitSpells(unit) {
  if (!unit || !unit.spells || typeof unit.spells !== 'object') return [];
  const entries = [];
  for (const [sid, lvl] of Object.entries(unit.spells)) {
    const n = parseInt(lvl, 10) || 0;
    if (n > 0 && SPELL_MAP[sid]) {
      entries.push({ id: sid, level: Math.min(3, n), spell: SPELL_MAP[sid] });
    }
  }
  return entries;
}

export function generateId() {
  return 'u_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function getUnitTraits(unit) {
  const list = [];
  if (unit.racial && TRAIT_MAP[unit.racial]) list.push(unit.racial);
  if (Array.isArray(unit.traits)) {
    for (const tid of unit.traits) {
      if (tid && TRAIT_MAP[tid]) list.push(tid);
    }
  }
  return list;
}

export function getUnitCharacterInfo(unit) {
  const profile = PROFILE_MAP[unit.company];
  if (!profile) {
    return { isStandaloneCharacter: false, isCharacterCompany: false, isCharacter: false, role: null, isMage: false };
  }
  if (profile.category === 'character') {
    return {
      isStandaloneCharacter: true,
      isCharacterCompany: false,
      isCharacter: true,
      role: profile.characterRole,
      isMage: !!profile.isMage
    };
  }
  const traits = getUnitTraits(unit);
  for (const tid of traits) {
    const t = TRAIT_MAP[tid];
    if (t && t.characterRole) {
      return {
        isStandaloneCharacter: false,
        isCharacterCompany: true,
        isCharacter: true,
        role: t.characterRole,
        isMage: !!t.isMage
      };
    }
  }
  return { isStandaloneCharacter: false, isCharacterCompany: false, isCharacter: false, role: null, isMage: false };
}

export function checkTraitConflict(candidateId, existingTraitIds) {
  if (!candidateId || !TRAIT_MAP[candidateId]) return null;
  for (const other of existingTraitIds) {
    if (!other) continue;
    if (other === candidateId) return { type: 'duplicate', withTrait: other, reason: 'Already selected on this unit' };
    if (INCOMPATIBILITY_MAP[candidateId]?.has(other)) {
      return { type: 'incompatible', withTrait: other, reason: `Incompatible with ${other}` };
    }
  }
  return null;
}

export function computeUnit(unit) {
  const profile = PROFILE_MAP[unit.company];
  if (!profile) {
    return {
      valid: false,
      res: 0, mov: 0, mel: 0, shtShort: 0, shtLong: 0, def: 0, com: 0,
      cost: 0, totalCost: 0, bases: 0,
      traits: [], relic: null, charInfo: getUnitCharacterInfo(unit),
      baseStats: null, deltas: {}, unitErrors: ['Invalid base company profile']
    };
  }

  const charInfo = getUnitCharacterInfo(unit);
  const allowTraits = profile.allowTraits;
  const activeTraitIds = allowTraits ? getUnitTraits(unit) : [];
  const relicObj = unit.relic && RELIC_MAP[unit.relic] ? RELIC_MAP[unit.relic] : null;
  const bases = Math.max(0, parseInt(unit.bases, 10) || 0);

  let res = profile.res;
  let mov = profile.mov;
  let mel = profile.mel;
  let shtShort = profile.shtShort;
  let shtLong = profile.shtLong;
  let def = profile.def;
  let com = profile.com;
  let cost = profile.cost;

  const costBreakdown = [{ label: profile.name, cost: profile.cost }];

  for (const tid of activeTraitIds) {
    const t = TRAIT_MAP[tid];
    if (!t) continue;
    if (t.mods.res) res += t.mods.res;
    if (t.mods.mov) mov += t.mods.mov;
    if (t.mods.mel) mel += t.mods.mel;
    if (t.mods.def) def += t.mods.def;
    if (t.mods.com) com += t.mods.com;
    if (t.mods.shtMode === 'setBoth') {
      shtShort = t.mods.shtShort;
      shtLong = t.mods.shtLong;
    } else if (t.mods.shtMode === 'setShort') {
      shtShort = t.mods.shtShort;
    } else if (t.mods.shtMode === 'addShort') {
      shtShort += t.mods.shtShort;
    }
    cost += t.cost;
    costBreakdown.push({ label: t.name, cost: t.cost });
  }

  if (relicObj) {
    if (relicObj.mods.res) res += relicObj.mods.res;
    if (relicObj.mods.mov) mov += relicObj.mods.mov;
    if (relicObj.mods.mel) mel += relicObj.mods.mel;
    if (relicObj.mods.def) def += relicObj.mods.def;
    if (relicObj.mods.com) com += relicObj.mods.com;
    cost += relicObj.cost;
    costBreakdown.push({ label: relicObj.name, cost: relicObj.cost });
  }

  // Horde formation (v1.2): Irregular company with 6 (3×2) or 8 (4×2) bases
  const canFormHorde = profile.id === 'Irregular company' && (bases === 6 || bases === 8);
  const isHorde = canFormHorde && Boolean(unit.horde);
  const hordeFormation = isHorde ? (bases === 8 ? '4×2' : '3×2') : (canFormHorde ? (bases === 8 ? '4×2' : '3×2') : '');

  if (isHorde) {
    if (shtShort > 0) shtShort += 1;
    if (shtLong > 0) shtLong += 1;
  }

  // Clamp non-negative stats
  res = Math.max(0, res);
  mov = Math.max(0, mov);
  mel = Math.max(0, mel);
  shtShort = Math.max(0, shtShort);
  shtLong = Math.max(0, shtLong);

  const unitErrors = [];

  // Validate trait conflicts
  for (let i = 0; i < activeTraitIds.length; i++) {
    for (let j = i + 1; j < activeTraitIds.length; j++) {
      const a = activeTraitIds[i];
      const b = activeTraitIds[j];
      if (a === b) {
        unitErrors.push(`Duplicate trait: ${a}`);
      } else if (INCOMPATIBILITY_MAP[a]?.has(b)) {
        unitErrors.push(`Incompatible traits: ${a} & ${b}`);
      }
    }
  }

  // Validate relic eligibility
  if (relicObj) {
    if (!charInfo.isCharacter) {
      unitErrors.push(`Relic "${relicObj.name}" requires a Character or Character-company`);
    } else if (relicObj.mageOnly && !charInfo.isMage) {
      unitErrors.push(`"${relicObj.name}" can only be carried by a Mage-lord or Magic-user`);
    }
  }

  // Validate spells
  const spells = getUnitSpells(unit);
  const totalSpellLevels = spells.reduce((s, x) => s + x.level, 0);
  const maxSpellLevels = charInfo.isMage
    ? (relicObj?.id === 'Mystical Tome of Revelation' ? 4 : 3)
    : 0;

  if (totalSpellLevels > 0 && !charInfo.isMage) {
    unitErrors.push('Only a Mage-lord or Magic-user can take spells');
  } else if (charInfo.isMage && totalSpellLevels > maxSpellLevels) {
    unitErrors.push(`Spell levels (${totalSpellLevels}) exceed limit of ${maxSpellLevels}`);
  }

  const isCompany = profile.category === 'company';
  const isExcludedFromBP = activeTraitIds.includes('Expendable') || activeTraitIds.includes('Swarm');
  const countsTowardBP = isCompany && !isExcludedFromBP;

  return {
    valid: unitErrors.length === 0,
    profile,
    res,
    mov,
    mel,
    shtShort,
    shtLong,
    def,
    com,
    cost,
    totalCost: cost * bases,
    bases,
    traits: activeTraitIds,
    relic: relicObj,
    spells,
    totalSpellLevels,
    maxSpellLevels,
    charInfo,
    isCompany,
    countsTowardBP,
    canFormHorde,
    isHorde,
    hordeFormation,
    costBreakdown,
    deltas: {
      res: res - profile.res,
      mov: mov - profile.mov,
      mel: mel - profile.mel,
      shtChanged: shtShort !== profile.shtShort || shtLong !== profile.shtLong,
      def: def - profile.def,
      com: com - profile.com
    },
    unitErrors
  };
}

export function computeArmy(army) {
  const units = Array.isArray(army.units) ? army.units : [];
  const strategies = (Array.isArray(army.strategies) ? army.strategies : [])
    .filter(id => STRATEGY_MAP[id])
    .slice(0, 3);

  const computedUnits = units.map(u => ({
    unit: u,
    calc: computeUnit(u)
  }));

  const strategyObjs = strategies.map(id => STRATEGY_MAP[id]);
  const strategyPoints = strategyObjs.reduce((sum, s) => sum + s.cost, 0);

  let characterPoints = 0;
  let companyPoints = 0;
  let relicPoints = 0;
  let totalBases = 0;
  let startingCompanies = 0;
  let excludedCompanies = 0;
  let activeUnitCount = 0;

  const counts = {
    Lord: 0,
    Captain: 0,
    'Magic-user': 0,
    Rogue: 0
  };

  const relicUsage = new Map();
  const warnings = [];
  const errors = [];

  // Tactical analytics
  let totalMeleeDice = 0;
  let totalShortShootDice = 0;
  let totalLongShootDice = 0;
  let companyResolveSum = 0;
  let companyMoveSum = 0;
  let totalCompanyBases = 0;
  const tagCounts = { mounted: 0, flying: 0, artillery: 0, shooting: 0, magic: 0 };

  for (const { unit, calc } of computedUnits) {
    if (calc.bases <= 0) continue;
    activeUnitCount++;
    totalBases += calc.bases;

    totalMeleeDice += calc.mel * calc.bases;
    totalShortShootDice += calc.shtShort * calc.bases;
    totalLongShootDice += calc.shtLong * calc.bases;

    if (calc.isCompany) {
      companyResolveSum += calc.res * calc.bases;
      companyMoveSum += calc.mov * calc.bases;
      totalCompanyBases += calc.bases;
    }

    if (calc.traits.includes('Mounted')) tagCounts.mounted += calc.bases;
    if (calc.traits.includes('Flying')) tagCounts.flying += calc.bases;
    if (calc.traits.includes('Artillery') || calc.traits.includes('Artillery (indirect)')) tagCounts.artillery += calc.bases;
    if (calc.shtShort > 0 || calc.shtLong > 0) tagCounts.shooting += calc.bases;
    if (calc.charInfo.isMage) tagCounts.magic += calc.bases;

    if (calc.charInfo.isStandaloneCharacter) {
      characterPoints += calc.totalCost;
    } else {
      companyPoints += calc.totalCost;
    }

    if (calc.relic) {
      relicPoints += calc.relic.cost * calc.bases;
      relicUsage.set(calc.relic.id, (relicUsage.get(calc.relic.id) || 0) + calc.bases);
    }

    if (calc.isCompany) {
      if (calc.countsTowardBP) {
        startingCompanies += calc.bases;
      } else {
        excludedCompanies += calc.bases;
      }
    }

    if (calc.charInfo.role) {
      counts[calc.charInfo.role] = (counts[calc.charInfo.role] || 0) + calc.bases;
    }

    for (const err of calc.unitErrors) {
      errors.push(`${unit.name || calc.profile?.name || 'Unit'}: ${err}`);
    }
  }

  const unitPoints = characterPoints + companyPoints;
  const totalPoints = unitPoints + strategyPoints;
  const pointsLimit = Math.max(0, parseInt(army.pointsLimit, 10) || 0);

  // Determine 500pt brackets for Captain & Magic-user limits
  const bracketBasis = pointsLimit > 0 ? pointsLimit : Math.max(500, totalPoints);
  const brackets = Math.max(1, Math.ceil(bracketBasis / 500));

  const extraRogues = strategyObjs.reduce((sum, s) => sum + (s.extraRogues || 0), 0);

  const limits = {
    Lord: { count: counts.Lord, max: 1, ok: counts.Lord <= 1, label: 'Warlord / Mage-lord' },
    Captain: { count: counts.Captain, max: 3 * brackets, ok: counts.Captain <= 3 * brackets, label: 'Captains' },
    'Magic-user': { count: counts['Magic-user'], max: 1 * brackets, ok: counts['Magic-user'] <= 1 * brackets, label: 'Magic-users' },
    Rogue: { count: counts.Rogue, max: 1 + extraRogues, ok: counts.Rogue <= 1 + extraRogues, label: 'Rogues' }
  };

  if (!limits.Lord.ok) errors.push(`Too many Warlords / Mage-lords (${limits.Lord.count} / ${limits.Lord.max})`);
  if (!limits.Captain.ok) errors.push(`Too many Captains (${limits.Captain.count} / ${limits.Captain.max} for ${brackets * 500} pts)`);
  if (!limits['Magic-user'].ok) errors.push(`Too many Magic-users (${limits['Magic-user'].count} / ${limits['Magic-user'].max} for ${brackets * 500} pts)`);
  if (!limits.Rogue.ok) errors.push(`Too many Rogues (${limits.Rogue.count} / ${limits.Rogue.max})`);

  if (pointsLimit > 0 && totalPoints > pointsLimit) {
    errors.push(`Army exceeds ${pointsLimit} pts limit by ${totalPoints - pointsLimit} pts`);
  }

  for (const [relicId, qty] of relicUsage.entries()) {
    if (qty > 1) {
      warnings.push(`Relic "${relicId}" is equipped ${qty} times (relics are usually unique)`);
    }
  }

  if (totalPoints > 0 && counts.Lord === 0) {
    warnings.push('No Warlord or Mage-lord selected yet');
  }

  const breakPoint = startingCompanies > 0 ? Math.floor(startingCompanies / 2) + 1 : 0;

  const analytics = {
    totalMeleeDice,
    totalShortShootDice,
    totalLongShootDice,
    avgResolve: totalCompanyBases > 0 ? (companyResolveSum / totalCompanyBases).toFixed(1) : '—',
    avgMove: totalCompanyBases > 0 ? (companyMoveSum / totalCompanyBases).toFixed(1) : '—',
    tagCounts
  };

  return {
    computedUnits,
    strategies: strategyObjs,
    totalPoints,
    pointsLimit,
    unitPoints,
    characterPoints,
    companyPoints,
    relicPoints,
    strategyPoints,
    totalBases,
    activeUnitCount,
    startingCompanies,
    excludedCompanies,
    breakPoint,
    brackets,
    limits,
    analytics,
    errors,
    warnings,
    isValid: errors.length === 0
  };
}

export function formatShooting(shortVal, longVal) {
  if (!shortVal && !longVal) return '—';
  return `${shortVal}/${longVal}`;
}

export function formatDefence(defVal) {
  return defVal ? `${defVal}+` : '—';
}

export function formatCommand(comVal) {
  return comVal ? `${comVal}bw` : '—';
}

export function formatCostDelta(val) {
  if (val > 0) return `+${val}`;
  return `${val}`;
}

export function exportArmyText(army) {
  const summary = computeArmy(army);
  const lines = [];
  const limitStr = summary.pointsLimit > 0 ? ` / ${summary.pointsLimit} pts` : ' pts';

  lines.push(`==================================================`);
  lines.push(`FANTASTIC BATTLES ARMY ROSTER: ${army.name || 'Untitled Army'}`);
  lines.push(`Points: ${summary.totalPoints}${limitStr} | Companies: ${summary.startingCompanies} | Break Point: ${summary.breakPoint}`);
  lines.push(`==================================================`);

  if (summary.strategies.length > 0) {
    lines.push('');
    lines.push('STRATEGIES:');
    for (const s of summary.strategies) {
      lines.push(`  • ${s.name} (${s.cost} pts)`);
    }
  }

  const active = summary.computedUnits.filter(x => x.calc.bases > 0);
  const chars = active.filter(x => x.calc.charInfo.isStandaloneCharacter);
  const comps = active.filter(x => !x.calc.charInfo.isStandaloneCharacter);

  const unitById = Object.fromEntries((army.units || []).map(u => [u.id, u]));

  const fmtRow = ({ unit, calc }) => {
    const extras = [];
    const traitList = [...calc.traits];
    if (calc.isHorde) traitList.push(`Horde (${calc.hordeFormation})`);
    if (traitList.length) extras.push(traitList.join(', '));
    if (calc.relic) extras.push(`Relic: ${calc.relic.name}`);
    if (calc.spells.length) extras.push(`Spells: ${calc.spells.map(s => `${s.id} L${s.level}`).join(', ')}`);
    if (unit.attachedTo && unitById[unit.attachedTo]) extras.push(`Attached → ${unitById[unit.attachedTo].name}`);
    const extraStr = extras.length ? ` | ${extras.join(' | ')}` : '';
    const noteStr = unit.notes ? `\n    Note: ${unit.notes}` : '';
    const qtyStr = calc.bases > 1 ? ` x${calc.bases}` : '';
    return `  • ${unit.name || calc.profile.name}${qtyStr} (${calc.profile.name}) — ${calc.totalCost} pts (${calc.cost}/base)` +
      `\n    Res:${calc.res}  Mov:${calc.mov}  Mel:${calc.mel}  Sht:${formatShooting(calc.shtShort, calc.shtLong)}  Def:${formatDefence(calc.def)}  Com:${calc.com || '—'}${extraStr}${noteStr}`;
  };

  if (chars.length > 0) {
    lines.push('');
    lines.push('CHARACTERS:');
    for (const item of chars) lines.push(fmtRow(item));
  }

  if (comps.length > 0) {
    lines.push('');
    lines.push('COMPANIES:');
    for (const item of comps) lines.push(fmtRow(item));
  }

  if (active.length === 0) {
    lines.push('');
    lines.push('(No active units with # Bases > 0)');
  }

  lines.push('');
  lines.push(`Total: ${summary.totalPoints} pts | Break Point: ${summary.breakPoint} ${summary.breakPoint === 1 ? 'company' : 'companies'}`);
  return lines.join('\n');
}

// Compact URL hash share encoding (UTF-8 safe Base64URL)
export function encodeArmyToShareHash(army) {
  const compact = {
    n: army.name || 'Untitled Army',
    l: army.pointsLimit || 500,
    r: army.defaultRacial || '',
    b: army.bannerColor || '',
    s: army.strategies || [],
    u: (army.units || []).map(u => {
      const row = [
        u.name || '',
        u.company || '',
        u.racial || '',
        u.traits || [],
        u.relic || '',
        u.bases || 0
      ];
      if ((u.spells && Object.keys(u.spells).length) || u.notes || u.horde) {
        row.push(u.spells || {});
        row.push(u.notes || '');
        if (u.horde) row.push(1);
      }
      return row;
    })
  };
  const json = JSON.stringify(compact);
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `#army=${b64}`;
}

export function decodeArmyFromShareHash(hash) {
  if (!hash || !hash.startsWith('#army=')) return null;
  try {
    let b64 = hash.slice(6).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    const compact = JSON.parse(json);
    if (!compact || !Array.isArray(compact.u)) return null;
    return {
      id: generateId(),
      name: String(compact.n || 'Shared Army'),
      pointsLimit: Number(compact.l) >= 0 ? Number(compact.l) : 500,
      defaultRacial: String(compact.r || ''),
      bannerColor: String(compact.b || ''),
      strategies: Array.isArray(compact.s) ? compact.s.filter(id => STRATEGY_MAP[id]).slice(0, 3) : [],
      units: compact.u.map(row => {
        const cleanSpells = {};
        if (row[6] && typeof row[6] === 'object') {
          for (const [k, v] of Object.entries(row[6])) {
            const lvl = parseInt(v, 10) || 0;
            if (lvl > 0 && SPELL_MAP[k]) cleanSpells[k] = Math.min(3, lvl);
          }
        }
        return {
          id: generateId(),
          name: String(row[0] || ''),
          company: PROFILE_MAP[row[1]] ? row[1] : 'Formed company',
          racial: TRAIT_MAP[row[2]] ? row[2] : '',
          traits: Array.isArray(row[3]) ? row[3].filter(t => TRAIT_MAP[t]).slice(0, 3) : [],
          relic: RELIC_MAP[row[4]] ? row[4] : '',
          bases: Math.max(0, parseInt(row[5], 10) || 0),
          spells: cleanSpells,
          notes: String(row[7] || ''),
          horde: Boolean(row[8])
        };
      })
    };
  } catch {
    return null;
  }
}
