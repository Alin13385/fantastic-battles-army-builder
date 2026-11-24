// Fantastic Battles — Battle Companion Mode, Pre-Game Roller & Printable Unit Cards

import {
  TRAIT_MAP,
  RELIC_MAP,
  SPELL_MAP
} from './data.js?v=5';

import {
  computeArmy,
  formatShooting,
  formatDefence
} from './engine.js?v=5';

import { renderUnitIconHtml } from './icons.js?v=5';

const BATTLE_STORAGE_KEY = 'fb_battle_state_v1';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function loadAllBattleStates() {
  try {
    return JSON.parse(localStorage.getItem(BATTLE_STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function saveAllBattleStates(all) {
  try {
    localStorage.setItem(BATTLE_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore quota errors
  }
}

export function getBattleState(army) {
  const all = loadAllBattleStates();
  const summary = computeArmy(army);
  let bs = all[army.id];

  if (!bs || typeof bs !== 'object') {
    bs = {
      turn: 1,
      instances: {},
      prophesyDice: [],
      pregame: { attackerRoll: null, mishaps: {}, stimulants: {} }
    };
  }
  if (!bs.instances) bs.instances = {};
  if (!bs.pregame) bs.pregame = { attackerRoll: null, mishaps: {}, stimulants: {} };
  if (!Array.isArray(bs.prophesyDice)) bs.prophesyDice = [];

  // Sync instances with active units (# bases > 0)
  const validKeys = new Set();
  for (const { unit, calc } of summary.computedUnits) {
    if (calc.bases <= 0) continue;
    for (let i = 1; i <= calc.bases; i++) {
      const key = `${unit.id}__${i}`;
      validKeys.add(key);
      if (!bs.instances[key]) {
        bs.instances[key] = {
          res: calc.res,
          activated: false,
          needsReload: false,
          warbeastsUsed: false,
          stimulants: null,
          summonPoints: 0
        };
      } else if (bs.instances[key].res > calc.res) {
        bs.instances[key].res = calc.res;
      }
    }
  }

  for (const k of Object.keys(bs.instances)) {
    if (!validKeys.has(k)) delete bs.instances[k];
  }

  all[army.id] = bs;
  saveAllBattleStates(all);
  return bs;
}

export function saveBattleState(armyId, bs) {
  const all = loadAllBattleStates();
  all[armyId] = bs;
  saveAllBattleStates(all);
}

export function resetBattleState(army) {
  const all = loadAllBattleStates();
  delete all[army.id];
  saveAllBattleStates(all);
  return getBattleState(army);
}

function getStimulantsLabel(roll) {
  if (!roll) return 'Not rolled';
  if (roll === 1) return `Rolled 1: Impetuous all battle`;
  if (roll <= 4) return `Rolled ${roll}: +1 Move, +1 Melee`;
  return `Rolled ${roll}: Gains Berserk & Proud`;
}

function getMishapOutcome(raw, mod, isImpulsive) {
  const total = raw + mod;
  if (total <= 1) {
    return isImpulsive
      ? { label: 'Enthusiastic (Impulsive)', cls: 'warn', detail: 'Late converted to Enthusiastic by Impulsive' }
      : { label: 'Late / Delayed', cls: 'danger', detail: `Total ${total} (roll ${raw}${mod >= 0 ? `+${mod}` : mod})` };
  }
  if (total >= 6) {
    return { label: 'Enthusiastic / Early', cls: 'ok', detail: `Total ${total} (roll ${raw}${mod >= 0 ? `+${mod}` : mod})` };
  }
  return { label: 'Ready / On Time', cls: 'ok', detail: `Total ${total} (roll ${raw}${mod >= 0 ? `+${mod}` : mod})` };
}

// ============================================================================
// Battle Mode Renderer
// ============================================================================

export function renderBattleModeHtml(army) {
  const summary = computeArmy(army);
  const bs = getBattleState(army);
  const active = summary.computedUnits.filter(x => x.calc.bases > 0);
  const unitById = Object.fromEntries((army.units || []).map(u => [u.id, u]));

  if (active.length === 0) {
    return `
      <div class="empty-state">
        <h3>No Active Units for Battle Mode</h3>
        <p>Switch back to <strong>Build Roster</strong> and add at least 1 base (<code>+</code>) to your units to launch the live tabletop Battle Tracker.</p>
        <div class="empty-actions">
          <button class="btn btn-primary" data-action="exit-battle-mode">Back to Build Roster</button>
        </div>
      </div>
    `;
  }

  // Count scattered companies toward Break Point
  let scatteredBP = 0;
  let scatteredTotal = 0;
  let totalProphesyLevels = 0;

  for (const { unit, calc } of active) {
    for (let i = 1; i <= calc.bases; i++) {
      const inst = bs.instances[`${unit.id}__${i}`];
      if (inst && inst.res <= 0) {
        scatteredTotal++;
        if (calc.countsTowardBP) scatteredBP++;
      }
    }
    const propSpell = calc.spells.find(s => s.id === 'Prophesy');
    if (propSpell) totalProphesyLevels += propSpell.level * calc.bases;
  }

  const isBroken = summary.breakPoint > 0 && scatteredBP >= summary.breakPoint;
  const bpPct = summary.breakPoint > 0 ? Math.min(100, Math.round((scatteredBP / summary.breakPoint) * 100)) : 0;

  // Prophesy Dice Tray HTML
  let prophesyHtml = '';
  if (totalProphesyLevels > 0) {
    const diceHtml = bs.prophesyDice.length > 0
      ? bs.prophesyDice.map((d, idx) => `
          <button type="button" class="prophesy-die ${d.used ? 'used' : ''}" data-battle-action="toggle-prophesy-die" data-die-idx="${idx}" title="${d.used ? 'Used (click to restore)' : 'Click to mark Prophecy die as used'}">
            <span class="die-val">${d.value}</span>
            <span class="die-tag">${d.used ? 'Used' : 'Ready'}</span>
          </button>
        `).join('')
      : `<span style="font-size:12px; color:var(--text-muted);">Roll your ${totalProphesyLevels}d6 Prophesy dice after Mishaps</span>`;

    prophesyHtml = `
      <div class="battle-prophesy-bar">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <strong style="font-size:12.5px; text-transform:uppercase; letter-spacing:0.05em;">Prophesy Dice (${totalProphesyLevels}d6)</strong>
          <div class="prophesy-dice-list">${diceHtml}</div>
        </div>
        <button type="button" class="btn btn-sm" data-battle-action="roll-prophesy">Roll ${totalProphesyLevels}d6</button>
      </div>
    `;
  }

  const renderTrackerCard = ({ unit, calc }, baseIndex) => {
    const key = `${unit.id}__${baseIndex}`;
    const inst = bs.instances[key];
    const isScattered = inst.res <= 0;
    const isChar = calc.charInfo.isCharacter;
    const label = calc.bases > 1 ? `${unit.name || calc.profile.name} #${baseIndex}` : (unit.name || calc.profile.name);

    const hasReload = calc.traits.includes('Heavy missile weapons') || calc.traits.includes('Powerful missile weapons');
    const hasWarbeasts = calc.traits.includes('Warbeasts');
    const hasStimulants = calc.traits.includes('Stimulants');
    const summonSpell = calc.spells.find(s => s.id === 'Summon');
    const summonValue = summonSpell ? summonSpell.level * 10 : 0;

    // Resolve pips (clickable!)
    const pips = [];
    for (let r = 1; r <= calc.res; r++) {
      pips.push(`
        <button type="button" class="res-pip ${r <= inst.res ? 'filled' : ''}" data-battle-action="set-res" data-inst="${escapeHtml(key)}" data-val="${r}" title="Set Resolve to ${r}"></button>
      `);
    }

    const attachedHost = unit.attachedTo && unitById[unit.attachedTo] ? unitById[unit.attachedTo].name : '';

    return `
      <article class="battle-card ${isScattered ? 'is-scattered' : ''} ${inst.activated && !isScattered ? 'is-activated' : ''} ${isChar ? 'is-char' : ''}">
        <div class="battle-card-top">
          <div>
            <div class="unit-header-row" style="align-items:center;">
              ${renderUnitIconHtml(unit, calc)}
              <h4 class="unit-name">${escapeHtml(label)}</h4>
              <span class="unit-profile-badge ${isChar ? 'is-char' : ''}">${escapeHtml(calc.profile.name)}</span>
              ${isScattered ? '<span class="battle-badge scattered">SCATTERED</span>' : ''}
              ${attachedHost ? `<span class="rule-pill">Attached → ${escapeHtml(attachedHost)}</span>` : ''}
            </div>
            <div class="battle-mini-stats">
              <span>Mov <strong>${calc.mov}</strong></span>
              <span>Mel <strong>${calc.mel}</strong></span>
              <span>Sht <strong>${formatShooting(calc.shtShort, calc.shtLong)}</strong></span>
              <span>Def <strong>${formatDefence(calc.def)}</strong></span>
              ${calc.com ? `<span>Com <strong>${calc.com}</strong></span>` : ''}
            </div>
          </div>

          <div class="battle-res-box">
            <div class="battle-res-label">Resolve</div>
            <div class="stepper">
              <button type="button" data-battle-action="dec-res" data-inst="${escapeHtml(key)}" ${inst.res <= 0 ? 'disabled' : ''}>&minus;</button>
              <span class="stepper-val" style="min-width:48px;">${inst.res}/${calc.res}</span>
              <button type="button" data-battle-action="inc-res" data-inst="${escapeHtml(key)}" ${inst.res >= calc.res ? 'disabled' : ''}>+</button>
            </div>
          </div>
        </div>

        <div class="res-pips-row">${pips.join('')}</div>

        <div class="battle-toggles">
          <button type="button" class="battle-toggle ${inst.activated ? 'on' : ''}" data-battle-action="toggle-flag" data-flag="activated" data-inst="${escapeHtml(key)}">
            ${inst.activated ? '✓ Activated' : '○ Ready'}
          </button>
          ${hasReload ? `
            <button type="button" class="battle-toggle warn-toggle ${inst.needsReload ? 'on' : ''}" data-battle-action="toggle-flag" data-flag="needsReload" data-inst="${escapeHtml(key)}">
              ${inst.needsReload ? '⚠ Needs Reload' : 'Loaded'}
            </button>
          ` : ''}
          ${hasWarbeasts ? `
            <button type="button" class="battle-toggle warn-toggle ${inst.warbeastsUsed ? 'on' : ''}" data-battle-action="toggle-flag" data-flag="warbeastsUsed" data-inst="${escapeHtml(key)}">
              ${inst.warbeastsUsed ? 'Warbeasts Used' : 'Warbeasts Ready'}
            </button>
          ` : ''}
          ${hasStimulants ? `
            <button type="button" class="battle-toggle ${inst.stimulants ? 'on' : ''}" data-battle-action="roll-stimulants" data-inst="${escapeHtml(key)}" title="Click to roll 1d6 Stimulants">
              🎲 ${escapeHtml(getStimulantsLabel(inst.stimulants))}
            </button>
          ` : ''}
          ${summonSpell ? `
            <div class="battle-summon-pill">
              <span>Summon Pool: <strong>${inst.summonPoints}</strong> (${inst.summonPoints * summonValue} pts)</span>
              <button type="button" class="btn btn-sm btn-ghost" style="padding:1px 6px;" data-battle-action="dec-summon" data-inst="${escapeHtml(key)}">&minus;</button>
              <button type="button" class="btn btn-sm btn-ghost" style="padding:1px 6px;" data-battle-action="inc-summon" data-inst="${escapeHtml(key)}">+</button>
            </div>
          ` : ''}
        </div>

        ${(calc.traits.length || calc.isHorde || calc.relic || calc.spells.length) ? `
          <div class="pill-row" style="margin-top:4px;">
            ${calc.traits.map(tid => `<button type="button" class="rule-pill" data-rule-type="trait" data-rule-id="${escapeHtml(tid)}">${escapeHtml(tid)}</button>`).join('')}
            ${calc.isHorde ? `<button type="button" class="rule-pill pill-horde" data-rule-type="horde" data-rule-id="Horde"><span class="pill-tag">Horde</span><span>${escapeHtml(calc.hordeFormation)}</span></button>` : ''}
            ${calc.relic ? `<button type="button" class="rule-pill pill-relic" data-rule-type="relic" data-rule-id="${escapeHtml(calc.relic.id)}">Relic: ${escapeHtml(calc.relic.name)}</button>` : ''}
            ${calc.spells.map(sp => `<button type="button" class="rule-pill pill-spell" data-rule-type="spell" data-rule-id="${escapeHtml(sp.id)}">${escapeHtml(sp.id)} L${sp.level}</button>`).join('')}
          </div>
        ` : ''}
      </article>
    `;
  };

  const charCards = [];
  const compCards = [];
  for (const item of active) {
    for (let i = 1; i <= item.calc.bases; i++) {
      const html = renderTrackerCard(item, i);
      if (item.calc.charInfo.isStandaloneCharacter) charCards.push(html);
      else compCards.push(html);
    }
  }

  return `
    <div class="battle-header-panel ${isBroken ? 'army-broken' : ''}">
      <div class="battle-header-top">
        <div class="battle-turn-controls">
          <span class="battle-turn-label">Turn</span>
          <div class="stepper">
            <button type="button" data-battle-action="dec-turn" ${bs.turn <= 1 ? 'disabled' : ''}>&minus;</button>
            <span class="stepper-val">${bs.turn}</span>
            <button type="button" data-battle-action="inc-turn">+</button>
          </div>
          <button type="button" class="btn btn-sm btn-primary" data-battle-action="next-turn">Next Turn &rarr;</button>
        </div>

        <div class="battle-bp-tracker">
          <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px;">
            <span class="kpi-label">Scattered vs. Break Point</span>
            <strong style="font-family:var(--font-mono); color:${isBroken ? 'var(--danger)' : 'var(--text-primary)'};">
              ${scatteredBP} / ${summary.breakPoint} ${isBroken ? '— ARMY BROKEN!' : ''}
            </strong>
          </div>
          <div class="points-bar-track" style="height:7px;">
            <div class="points-bar-fill ${isBroken ? 'over' : ''}" style="width:${bpPct}%;"></div>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">
            ${scatteredTotal} total bases scattered (Expendable, Swarm &amp; Characters excluded from Break Point)
          </div>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-sm" data-battle-action="open-pregame">🎲 Pre-Game Rolls</button>
          <button type="button" class="btn btn-sm btn-danger-ghost" data-battle-action="reset-battle">Reset Battle</button>
        </div>
      </div>
      ${prophesyHtml}
    </div>

    ${charCards.length ? `
      <div class="unit-section">
        <div class="section-header"><div class="section-title"><span>Characters</span><span class="section-count">${charCards.length}</span></div></div>
        <div class="battle-grid">${charCards.join('')}</div>
      </div>
    ` : ''}

    ${compCards.length ? `
      <div class="unit-section">
        <div class="section-header"><div class="section-title"><span>Companies</span><span class="section-count">${compCards.length}</span></div></div>
        <div class="battle-grid">${compCards.join('')}</div>
      </div>
    ` : ''}
  `;
}

export function handleBattleAction(army, btn) {
  const action = btn.dataset.battleAction;
  const bs = getBattleState(army);
  const summary = computeArmy(army);

  if (action === 'inc-turn') {
    bs.turn++;
  } else if (action === 'dec-turn') {
    bs.turn = Math.max(1, bs.turn - 1);
  } else if (action === 'next-turn') {
    bs.turn++;
    for (const inst of Object.values(bs.instances)) {
      inst.activated = false;
    }
  } else if (action === 'reset-battle') {
    if (!confirm('Reset all Resolve, turn count, and battle tokens for this army?')) return false;
    resetBattleState(army);
    return true;
  } else if (action === 'roll-prophesy') {
    const dice = [];
    for (const { calc } of summary.computedUnits) {
      if (calc.bases <= 0) continue;
      const p = calc.spells.find(s => s.id === 'Prophesy');
      if (p) {
        for (let n = 0; n < p.level * calc.bases; n++) {
          dice.push({ value: rollD6(), used: false });
        }
      }
    }
    bs.prophesyDice = dice;
  } else if (action === 'toggle-prophesy-die') {
    const idx = parseInt(btn.dataset.dieIdx, 10);
    if (bs.prophesyDice[idx]) {
      bs.prophesyDice[idx].used = !bs.prophesyDice[idx].used;
    }
  } else {
    const key = btn.dataset.inst;
    const inst = bs.instances[key];
    if (!inst) return false;
    const unitId = key.split('__')[0];
    const item = summary.computedUnits.find(x => x.unit.id === unitId);
    const maxRes = item ? item.calc.res : 10;

    if (action === 'dec-res') inst.res = Math.max(0, inst.res - 1);
    else if (action === 'inc-res') inst.res = Math.min(maxRes, inst.res + 1);
    else if (action === 'set-res') {
      const v = parseInt(btn.dataset.val, 10);
      inst.res = inst.res === v ? v - 1 : v;
    } else if (action === 'toggle-flag') {
      const flag = btn.dataset.flag;
      inst[flag] = !inst[flag];
    } else if (action === 'roll-stimulants') {
      inst.stimulants = rollD6();
    } else if (action === 'inc-summon') {
      inst.summonPoints = (inst.summonPoints || 0) + 1;
    } else if (action === 'dec-summon') {
      inst.summonPoints = Math.max(0, (inst.summonPoints || 0) - 1);
    }
  }

  saveBattleState(army.id, bs);
  return true;
}

// ============================================================================
// Pre-Game Roll Helper Modal
// ============================================================================

export function renderPregameModalHtml(army) {
  const summary = computeArmy(army);
  const bs = getBattleState(army);
  const activeCompanies = summary.computedUnits.filter(x => x.calc.bases > 0 && x.calc.isCompany);
  const hasScouts = summary.strategies.some(s => s.id === 'Scouts');
  const hasQuartermaster = summary.strategies.some(s => s.id === 'Quartermaster');

  const att = bs.pregame.attackerRoll;
  const attBonus = hasScouts ? 2 : 0;

  // Mishaps rows
  const mishapRows = activeCompanies.map(({ unit, calc }) => {
    let mod = hasQuartermaster ? 1 : 0;
    const modNotes = [];
    if (hasQuartermaster) modNotes.push('+1 Quartermaster');
    if (calc.traits.includes('Reliable')) { mod += 1; modNotes.push('+1 Reliable'); }
    if (calc.traits.includes('Unreliable')) { mod -= 1; modNotes.push('-1 Unreliable'); }
    const isImpulsive = calc.traits.includes('Impulsive');
    if (isImpulsive) modNotes.push('Impulsive');

    const rolled = bs.pregame.mishaps[unit.id];
    const outcome = rolled ? getMishapOutcome(rolled, mod, isImpulsive) : null;

    return `
      <div class="pregame-row">
        <div>
          <strong>${escapeHtml(unit.name || calc.profile.name)}</strong>
          ${calc.bases > 1 ? `<span class="unit-profile-badge">×${calc.bases}</span>` : ''}
          <div style="font-size:11.5px; color:var(--text-muted);">${modNotes.length ? escapeHtml(modNotes.join(' · ')) : 'No modifiers'}</div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          ${outcome ? `<span class="status-badge ${outcome.cls}" title="${escapeHtml(outcome.detail)}">${escapeHtml(outcome.label)} (${rolled}${mod ? (mod > 0 ? `+${mod}` : mod) : ''})</span>` : '<span style="font-size:12px; color:var(--text-muted);">—</span>'}
          <button type="button" class="btn btn-sm" data-pregame-action="roll-mishap" data-unit-id="${escapeHtml(unit.id)}">Roll 1d6</button>
        </div>
      </div>
    `;
  }).join('');

  // Stimulants rows
  const stimUnits = activeCompanies.filter(x => x.calc.traits.includes('Stimulants'));
  const stimHtml = stimUnits.length > 0 ? `
    <div class="pregame-section">
      <div class="pregame-section-head">
        <strong>Stimulants (1d6 after Mishaps)</strong>
        <button type="button" class="btn btn-sm" data-pregame-action="roll-all-stimulants">Roll All</button>
      </div>
      ${stimUnits.map(({ unit, calc }) => {
        const val = bs.pregame.stimulants[unit.id];
        return `
          <div class="pregame-row">
            <strong>${escapeHtml(unit.name || calc.profile.name)}</strong>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:12.5px; color:${val === 1 ? 'var(--danger)' : (val ? 'var(--ok)' : 'var(--text-muted)')}; font-weight:600;">
                ${escapeHtml(getStimulantsLabel(val))}
              </span>
              <button type="button" class="btn btn-sm" data-pregame-action="roll-stim" data-unit-id="${escapeHtml(unit.id)}">Roll</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : '';

  // Prophesy section
  let totalProphesy = 0;
  for (const { calc } of summary.computedUnits) {
    if (calc.bases <= 0) continue;
    const p = calc.spells.find(s => s.id === 'Prophesy');
    if (p) totalProphesy += p.level * calc.bases;
  }
  const propHtml = totalProphesy > 0 ? `
    <div class="pregame-section">
      <div class="pregame-section-head">
        <strong>Prophesy Dice (${totalProphesy}d6)</strong>
        <button type="button" class="btn btn-sm btn-primary" data-pregame-action="roll-prophesy">Roll ${totalProphesy}d6</button>
      </div>
      <div class="prophesy-dice-list" style="padding:4px 0;">
        ${bs.prophesyDice.length
          ? bs.prophesyDice.map(d => `<span class="prophesy-die static"><span class="die-val">${d.value}</span></span>`).join('')
          : '<span style="font-size:12.5px; color:var(--text-muted);">Click Roll to generate your Prophecy pool (automatically synced to Battle Mode)</span>'}
      </div>
    </div>
  ` : '';

  return `
    <div class="pregame-section">
      <div class="pregame-section-head">
        <div>
          <strong>Attacker / Defender Roll</strong>
          <span style="font-size:12px; color:var(--text-muted); margin-left:6px;">${hasScouts ? 'Scouts strategy active (+2 bonus)' : '1d6 (no Scouts bonus)'}</span>
        </div>
        <button type="button" class="btn btn-sm btn-primary" data-pregame-action="roll-attacker">Roll 1d6${hasScouts ? '+2' : ''}</button>
      </div>
      ${att !== null ? `
        <div class="pregame-result-banner">
          Rolled <strong>${att}</strong>${attBonus ? ` + ${attBonus} (Scouts)` : ''} = <strong style="font-size:18px; color:var(--accent);">${att + attBonus}</strong>
        </div>
      ` : ''}
    </div>

    <div class="pregame-section">
      <div class="pregame-section-head">
        <div>
          <strong>Pre-Game Mishaps</strong>
          <span style="font-size:12px; color:var(--text-muted); margin-left:6px;">${hasQuartermaster ? 'Quartermaster active (+1 all units)' : '1d6 per company'}</span>
        </div>
        <button type="button" class="btn btn-sm btn-primary" data-pregame-action="roll-all-mishaps" ${activeCompanies.length === 0 ? 'disabled' : ''}>Roll All Companies</button>
      </div>
      ${activeCompanies.length > 0 ? mishapRows : '<div style="font-size:12.5px; color:var(--text-muted);">No active companies (# Bases &gt; 0) in roster.</div>'}
    </div>

    ${stimHtml}
    ${propHtml}
  `;
}

export function handlePregameAction(army, btn) {
  const action = btn.dataset.pregameAction;
  const bs = getBattleState(army);
  const summary = computeArmy(army);
  const activeCompanies = summary.computedUnits.filter(x => x.calc.bases > 0 && x.calc.isCompany);

  if (action === 'roll-attacker') {
    bs.pregame.attackerRoll = rollD6();
  } else if (action === 'roll-mishap') {
    bs.pregame.mishaps[btn.dataset.unitId] = rollD6();
  } else if (action === 'roll-all-mishaps') {
    for (const { unit } of activeCompanies) {
      bs.pregame.mishaps[unit.id] = rollD6();
    }
  } else if (action === 'roll-stim') {
    const uid = btn.dataset.unitId;
    const r = rollD6();
    bs.pregame.stimulants[uid] = r;
    for (const [k, inst] of Object.entries(bs.instances)) {
      if (k.startsWith(uid + '__')) inst.stimulants = r;
    }
  } else if (action === 'roll-all-stimulants') {
    for (const { unit, calc } of activeCompanies) {
      if (calc.traits.includes('Stimulants')) {
        const r = rollD6();
        bs.pregame.stimulants[unit.id] = r;
        for (const [k, inst] of Object.entries(bs.instances)) {
          if (k.startsWith(unit.id + '__')) inst.stimulants = r;
        }
      }
    }
  } else if (action === 'roll-prophesy') {
    const dice = [];
    for (const { calc } of summary.computedUnits) {
      if (calc.bases <= 0) continue;
      const p = calc.spells.find(s => s.id === 'Prophesy');
      if (p) {
        for (let n = 0; n < p.level * calc.bases; n++) {
          dice.push({ value: rollD6(), used: false });
        }
      }
    }
    bs.prophesyDice = dice;
  }

  saveBattleState(army.id, bs);
}

// ============================================================================
// Printable Cut-Out Unit Stat Cards (with Resolve Checkboxes)
// ============================================================================

export function buildPrintCardsHtml(army, includeZeroBases = false) {
  const summary = computeArmy(army);
  const rows = summary.computedUnits.filter(x => includeZeroBases || x.calc.bases > 0);
  const unitById = Object.fromEntries((army.units || []).map(u => [u.id, u]));

  if (rows.length === 0) {
    return `<div style="padding:20px; text-align:center; color:#555;">No active units with # Bases &gt; 0. Check "Include 0-base catalog units" or add bases to print unit cards.</div>`;
  }

  const cardsHtml = rows.map(({ unit, calc }) => {
    const boxesCount = Math.max(1, calc.bases);
    const resCheckboxes = Array.from({ length: boxesCount }, (_, bi) => {
      const pips = '☐ '.repeat(calc.res).trim();
      const label = boxesCount > 1 ? `Base #${bi + 1}: ` : 'Resolve: ';
      return `<div class="pc-res-line"><span>${label}</span><span class="pc-boxes">${pips}</span></div>`;
    }).join('');

    const ruleSnippets = [];
    for (const tid of calc.traits) {
      const t = TRAIT_MAP[tid];
      if (t) ruleSnippets.push(`<strong>${escapeHtml(t.name)}</strong>`);
    }
    if (calc.isHorde) {
      ruleSnippets.push(`<strong>Horde (${escapeHtml(calc.hordeFormation)}):</strong> +1 front Mel &amp; charge, +1 Sht (applied)`);
    }
    if (calc.relic) {
      ruleSnippets.push(`<strong>Relic — ${escapeHtml(calc.relic.name)}:</strong> ${escapeHtml(calc.relic.description)}`);
    }
    for (const sp of calc.spells) {
      ruleSnippets.push(`<strong>Spell — ${escapeHtml(sp.id)} (L${sp.level}, ${escapeHtml(sp.spell.difficulty)}, ${escapeHtml(sp.spell.range)})</strong>`);
    }
    if (unit.attachedTo && unitById[unit.attachedTo]) {
      ruleSnippets.push(`<strong>Attached → ${escapeHtml(unitById[unit.attachedTo].name)}</strong>`);
    }

    return `
      <div class="pc-card">
        <div class="pc-head">
          <div style="display:flex; align-items:center; gap:7px;">
            ${renderUnitIconHtml(unit, calc, 'icon-print')}
            <div>
              <div class="pc-name">${escapeHtml(unit.name || calc.profile.name)}</div>
              <div class="pc-profile">${escapeHtml(calc.profile.name)}${calc.bases > 1 ? ` · ×${calc.bases} bases` : ''}</div>
            </div>
          </div>
          <div class="pc-pts">${calc.cost} pts${calc.bases > 1 ? `<br/><span>(${calc.totalCost} tot)</span>` : ''}</div>
        </div>

        <table class="pc-stat-table">
          <thead><tr><th>Res</th><th>Mov</th><th>Mel</th><th>Sht</th><th>Def</th><th>Com</th></tr></thead>
          <tbody>
            <tr>
              <td>${calc.res}</td>
              <td>${calc.mov}</td>
              <td>${calc.mel}</td>
              <td>${formatShooting(calc.shtShort, calc.shtLong)}</td>
              <td>${formatDefence(calc.def)}</td>
              <td>${calc.com || '—'}</td>
            </tr>
          </tbody>
        </table>

        <div class="pc-resolve-block">${resCheckboxes}</div>

        ${ruleSnippets.length ? `<div class="pc-traits">${ruleSnippets.join(' &middot; ')}</div>` : ''}
        ${unit.notes ? `<div class="pc-notes">${escapeHtml(unit.notes)}</div>` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="ps-header" style="margin-bottom:12px;">
      <div>
        <div class="ps-subtitle">Fantastic Battles — Tabletop Unit Stat Cards</div>
        <h3 class="ps-title">${escapeHtml(army.name || 'Untitled Army')}</h3>
      </div>
      <div class="ps-stats">
        <div><strong>${summary.totalPoints} pts</strong> · Break Point: <strong>${summary.breakPoint}</strong></div>
      </div>
    </div>
    <div class="pc-grid">${cardsHtml}</div>
  `;
}
