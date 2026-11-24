// Fantastic Battles — Side-by-Side Army Comparison (Matchup Balance View)

import { BANNER_COLORS } from './data.js?v=6';
import { computeArmy, formatShooting, formatDefence } from './engine.js?v=6';
import { renderUnitIconHtml } from './icons.js?v=6';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getBannerHex(army) {
  const found = BANNER_COLORS.find(c => c.id === army?.bannerColor);
  return found ? found.hex : '#decb01';
}

function analyzeForMatchup(army) {
  const summary = computeArmy(army);
  const active = summary.computedUnits.filter(x => x.calc.bases > 0);

  let totalCommand = 0;
  let totalSpellLevels = 0;
  let terrifyingBases = 0;
  let monsterBases = 0;
  let skirmisherBases = 0;
  let armorPiercingBases = 0;

  for (const { calc } of active) {
    totalCommand += calc.com * calc.bases;
    totalSpellLevels += (calc.totalSpellLevels || 0) * calc.bases;
    if (calc.traits.includes('Terrifying')) terrifyingBases += calc.bases;
    if (
      calc.traits.includes('Giant') ||
      calc.traits.includes('Monstrous') ||
      calc.profile.id === 'Dragon' ||
      calc.profile.id === 'Fantastic beast'
    ) {
      monsterBases += calc.bases;
    }
    if (calc.traits.includes('Skirmishers') || calc.traits.includes('Emerge')) {
      skirmisherBases += calc.bases;
    }
    if (
      calc.traits.includes('Heavy melee weapons') ||
      calc.traits.includes('Heavy missile weapons') ||
      calc.traits.includes('Powerful missile weapons')
    ) {
      armorPiercingBases += calc.bases;
    }
  }

  return {
    army,
    summary,
    active,
    bannerHex: getBannerHex(army),
    totalCommand,
    totalSpellLevels,
    terrifyingBases,
    monsterBases,
    skirmisherBases,
    armorPiercingBases,
    avgResolveNum: summary.analytics.avgResolve === '—' ? 0 : parseFloat(summary.analytics.avgResolve),
    avgMoveNum: summary.analytics.avgMove === '—' ? 0 : parseFloat(summary.analytics.avgMove)
  };
}

function renderTugRow(label, valA, valB, displayA, displayB, tooltip = '') {
  const a = Number(valA) || 0;
  const b = Number(valB) || 0;
  const max = Math.max(a, b, 1);
  const pctA = Math.round((a / max) * 100);
  const pctB = Math.round((b / max) * 100);
  const winA = a > b;
  const winB = b > a;

  return `
    <div class="cmp-tug-row" title="${escapeHtml(tooltip)}">
      <div class="cmp-tug-side side-a">
        <span class="cmp-tug-val ${winA ? 'leader' : ''}">${escapeHtml(displayA)}</span>
        <div class="cmp-bar-track left">
          <div class="cmp-bar-fill fill-a ${winA ? 'leader' : ''}" style="width:${pctA}%;"></div>
        </div>
      </div>
      <div class="cmp-tug-label">${escapeHtml(label)}</div>
      <div class="cmp-tug-side side-b">
        <div class="cmp-bar-track right">
          <div class="cmp-bar-fill fill-b ${winB ? 'leader' : ''}" style="width:${pctB}%;"></div>
        </div>
        <span class="cmp-tug-val ${winB ? 'leader' : ''}">${escapeHtml(displayB)}</span>
      </div>
    </div>
  `;
}

function renderThreatCell(label, displayA, displayB, numA = displayA, numB = displayB) {
  const a = Number(numA) || 0;
  const b = Number(numB) || 0;
  return `
    <div class="cmp-threat-row">
      <span class="cmp-threat-num ${a > b ? 'leader-a' : ''}">${escapeHtml(displayA)}</span>
      <span class="cmp-threat-label">${escapeHtml(label)}</span>
      <span class="cmp-threat-num ${b > a ? 'leader-b' : ''}">${escapeHtml(displayB)}</span>
    </div>
  `;
}

function renderRosterColumn(m, sideLabel) {
  if (m.active.length === 0) {
    return `
      <div class="cmp-roster-col">
        <div class="cmp-roster-head" style="border-top:3px solid ${m.bannerHex};">
          <strong>${escapeHtml(m.army.name || 'Untitled Army')}</strong>
          <span class="panel-badge">0 active units</span>
        </div>
        <div class="cmp-empty-note">
          No active units (<code># Bases &gt; 0</code>) in ${sideLabel}. Open this army and add bases to compare its battle force.
        </div>
      </div>
    `;
  }

  const rowsHtml = m.active.map(({ unit, calc }) => `
    <div class="cmp-unit-line">
      <div class="cmp-unit-left">
        ${renderUnitIconHtml(unit, calc)}
        <div style="min-width:0;">
          <div class="cmp-unit-name">${escapeHtml(unit.name || calc.profile.name)}${calc.bases > 1 ? ` <span class="cmp-qty">×${calc.bases}</span>` : ''}${calc.isHorde ? ` <span class="cmp-horde-tag">Horde ${escapeHtml(calc.hordeFormation)}</span>` : ''}</div>
          <div class="cmp-unit-meta">R:${calc.res} M:${calc.mov} Ml:${calc.mel} S:${formatShooting(calc.shtShort, calc.shtLong)} D:${formatDefence(calc.def)}${calc.com ? ` C:${calc.com}` : ''}</div>
        </div>
      </div>
      <span class="cmp-unit-pts">${calc.totalCost} pts</span>
    </div>
  `).join('');

  const stratHtml = m.summary.strategies.length > 0
    ? `<div class="cmp-strat-line"><strong>Strategies:</strong> ${m.summary.strategies.map(s => `${escapeHtml(s.name)} (${s.cost})`).join(', ')}</div>`
    : `<div class="cmp-strat-line" style="color:var(--text-muted);">No strategies selected</div>`;

  return `
    <div class="cmp-roster-col">
      <div class="cmp-roster-head" style="border-top:3px solid ${m.bannerHex};">
        <strong>${escapeHtml(m.army.name || 'Untitled Army')}</strong>
        <span class="panel-badge">${m.summary.totalPoints} pts · ${m.summary.totalBases} bases</span>
      </div>
      ${stratHtml}
      <div class="cmp-unit-list">${rowsHtml}</div>
    </div>
  `;
}

export function renderComparisonHtml(armyA, armyB) {
  if (!armyA || !armyB) {
    return `<div style="padding:28px; text-align:center; color:var(--text-muted);">Select two armies above to compare their matchup balance.</div>`;
  }

  const a = analyzeForMatchup(armyA);
  const b = analyzeForMatchup(armyB);

  const ptsDiff = a.summary.totalPoints - b.summary.totalPoints;
  const absDiff = Math.abs(ptsDiff);
  let verdictCls = 'ok';
  let verdictText = 'Evenly Matched Points';
  if (a.summary.totalPoints === 0 || b.summary.totalPoints === 0) {
    verdictCls = 'warn';
    verdictText = 'Add bases (# > 0) to both armies to evaluate balance';
  } else if (absDiff === 0) {
    verdictCls = 'ok';
    verdictText = 'Exact Points Match (0 pts diff)';
  } else if (absDiff <= 20) {
    verdictCls = 'ok';
    verdictText = `Well Balanced (${ptsDiff > 0 ? armyA.name : armyB.name} +${absDiff} pts)`;
  } else if (absDiff <= 60) {
    verdictCls = 'warn';
    verdictText = `Slight Edge: ${ptsDiff > 0 ? armyA.name : armyB.name} (+${absDiff} pts)`;
  } else {
    verdictCls = 'error';
    verdictText = `Uneven Points: ${ptsDiff > 0 ? armyA.name : armyB.name} (+${absDiff} pts)`;
  }

  // Generate short tactical matchup insights
  const notes = [];
  if (a.active.length > 0 && b.active.length > 0) {
    const melDiff = a.summary.analytics.totalMeleeDice - b.summary.analytics.totalMeleeDice;
    if (Math.abs(melDiff) >= 6) {
      notes.push(`<strong>Melee Edge:</strong> ${escapeHtml(melDiff > 0 ? armyA.name : armyB.name)} brings +${Math.abs(melDiff)} more total Melee dice.`);
    }
    const shtA = a.summary.analytics.totalShortShootDice + a.summary.analytics.totalLongShootDice;
    const shtB = b.summary.analytics.totalShortShootDice + b.summary.analytics.totalLongShootDice;
    if (Math.abs(shtA - shtB) >= 5) {
      notes.push(`<strong>Firepower Edge:</strong> ${escapeHtml(shtA > shtB ? armyA.name : armyB.name)} has stronger ranged output (${shtA} vs ${shtB} combined S+L dice).`);
    }
    const bpDiff = a.summary.breakPoint - b.summary.breakPoint;
    if (Math.abs(bpDiff) >= 2) {
      notes.push(`<strong>Staying Power:</strong> ${escapeHtml(bpDiff > 0 ? armyA.name : armyB.name)} has a higher Break Point (${a.summary.breakPoint} vs ${b.summary.breakPoint}).`);
    }
    if (a.summary.analytics.tagCounts.flying > 0 && b.summary.analytics.tagCounts.flying === 0) {
      notes.push(`<strong>Air Superiority:</strong> ${escapeHtml(armyA.name)} fields ${a.summary.analytics.tagCounts.flying} Flying base(s) against none.`);
    } else if (b.summary.analytics.tagCounts.flying > 0 && a.summary.analytics.tagCounts.flying === 0) {
      notes.push(`<strong>Air Superiority:</strong> ${escapeHtml(armyB.name)} fields ${b.summary.analytics.tagCounts.flying} Flying base(s) against none.`);
    }
    if (a.summary.analytics.tagCounts.magic !== b.summary.analytics.tagCounts.magic) {
      const mLeader = a.summary.analytics.tagCounts.magic > b.summary.analytics.tagCounts.magic ? armyA.name : armyB.name;
      notes.push(`<strong>Magic Presence:</strong> ${escapeHtml(mLeader)} has more Magic-users (${a.summary.analytics.tagCounts.magic} vs ${b.summary.analytics.tagCounts.magic}).`);
    }
    if (a.terrifyingBases > 0 || b.terrifyingBases > 0) {
      notes.push(`<strong>Terror Threats:</strong> ${a.terrifyingBases} vs ${b.terrifyingBases} Terrifying base(s).`);
    }
  }

  return `
    <div class="cmp-banner">
      <div class="cmp-army-pill" style="border-left:4px solid ${a.bannerHex};">
        <div class="cmp-army-pill-name">${escapeHtml(armyA.name || 'Army A')}</div>
        <div class="cmp-army-pill-sub">
          <strong>${a.summary.totalPoints} pts</strong> · ${a.summary.startingCompanies} cos · BP ${a.summary.breakPoint}
          <span class="status-badge ${a.summary.isValid ? 'valid' : 'invalid'}" style="padding:1px 7px; font-size:10.5px;">${a.summary.isValid ? 'Legal' : 'Issues'}</span>
        </div>
      </div>

      <div class="cmp-vs-center">
        <span class="cmp-vs-badge">VS</span>
        <div class="alert-item ${verdictCls}" style="margin:0; padding:4px 10px; font-size:11.5px; text-align:center;">
          <span>${escapeHtml(verdictText)}</span>
        </div>
      </div>

      <div class="cmp-army-pill right" style="border-right:4px solid ${b.bannerHex};">
        <div class="cmp-army-pill-name">${escapeHtml(armyB.name || 'Army B')}</div>
        <div class="cmp-army-pill-sub">
          <span class="status-badge ${b.summary.isValid ? 'valid' : 'invalid'}" style="padding:1px 7px; font-size:10.5px;">${b.summary.isValid ? 'Legal' : 'Issues'}</span>
          <strong>${b.summary.totalPoints} pts</strong> · ${b.summary.startingCompanies} cos · BP ${b.summary.breakPoint}
        </div>
      </div>
    </div>

    <div class="cmp-section">
      <h4 class="cmp-section-title">Head-to-Head Metrics</h4>
      <div class="cmp-tug-list">
        ${renderTugRow('Total Points', a.summary.totalPoints, b.summary.totalPoints, `${a.summary.totalPoints}`, `${b.summary.totalPoints}`, 'Total army points including strategies & relics')}
        ${renderTugRow('Break Point', a.summary.breakPoint, b.summary.breakPoint, `${a.summary.breakPoint} (${a.summary.startingCompanies})`, `${b.summary.breakPoint} (${b.summary.startingCompanies})`, 'Break Point (Starting Companies)')}
        ${renderTugRow('Melee Dice', a.summary.analytics.totalMeleeDice, b.summary.analytics.totalMeleeDice, `${a.summary.analytics.totalMeleeDice}`, `${b.summary.analytics.totalMeleeDice}`, 'Combined base Melee dice of all active bases')}
        ${renderTugRow('Shooting (Short)', a.summary.analytics.totalShortShootDice, b.summary.analytics.totalShortShootDice, `${a.summary.analytics.totalShortShootDice}`, `${b.summary.analytics.totalShortShootDice}`, 'Combined short-range shooting dice')}
        ${renderTugRow('Shooting (Long)', a.summary.analytics.totalLongShootDice, b.summary.analytics.totalLongShootDice, `${a.summary.analytics.totalLongShootDice}`, `${b.summary.analytics.totalLongShootDice}`, 'Combined long-range shooting dice')}
        ${renderTugRow('Avg Resolve', a.avgResolveNum, b.avgResolveNum, `${a.summary.analytics.avgResolve}`, `${b.summary.analytics.avgResolve}`, 'Average Resolve across active company bases')}
        ${renderTugRow('Avg Move', a.avgMoveNum, b.avgMoveNum, `${a.summary.analytics.avgMove}`, `${b.summary.analytics.avgMove}`, 'Average Movement across active company bases')}
        ${renderTugRow('Command Radius', a.totalCommand, b.totalCommand, `${a.totalCommand} bw`, `${b.totalCommand} bw`, 'Total combined Command value across active characters')}
      </div>
    </div>

    <div class="cmp-two-col">
      <div class="cmp-section">
        <h4 class="cmp-section-title">Special Capabilities &amp; Threats</h4>
        <div class="cmp-threat-list">
          ${renderThreatCell('Mounted Bases', a.summary.analytics.tagCounts.mounted, b.summary.analytics.tagCounts.mounted)}
          ${renderThreatCell('Flying Bases', a.summary.analytics.tagCounts.flying, b.summary.analytics.tagCounts.flying)}
          ${renderThreatCell('Artillery Batteries', a.summary.analytics.tagCounts.artillery, b.summary.analytics.tagCounts.artillery)}
          ${renderThreatCell('Mages (Spell Lvls)', `${a.summary.analytics.tagCounts.magic} (${a.totalSpellLevels})`, `${b.summary.analytics.tagCounts.magic} (${b.totalSpellLevels})`, a.summary.analytics.tagCounts.magic * 10 + a.totalSpellLevels, b.summary.analytics.tagCounts.magic * 10 + b.totalSpellLevels)}
          ${renderThreatCell('Monsters / Giants / Dragons', a.monsterBases, b.monsterBases)}
          ${renderThreatCell('Terrifying Units', a.terrifyingBases, b.terrifyingBases)}
          ${renderThreatCell('Armor-Piercing (Heavy/Powerful)', a.armorPiercingBases, b.armorPiercingBases)}
          ${renderThreatCell('Skirmishers / Emerge', a.skirmisherBases, b.skirmisherBases)}
        </div>
      </div>

      <div class="cmp-section">
        <h4 class="cmp-section-title">Matchup Notes</h4>
        ${notes.length > 0
          ? `<ul class="cmp-notes-list">${notes.map(n => `<li>${n}</li>`).join('')}</ul>`
          : `<div style="font-size:12.5px; color:var(--text-muted); padding:6px 0;">Both armies have closely balanced battlefield profiles (or need active units added to compare).</div>`}
      </div>
    </div>

    <div class="cmp-section">
      <h4 class="cmp-section-title">Active Forces Side-by-Side</h4>
      <div class="cmp-rosters-grid">
        ${renderRosterColumn(a, 'Army A')}
        ${renderRosterColumn(b, 'Army B')}
      </div>
    </div>
  `;
}
