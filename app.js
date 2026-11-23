// Fantastic Battles — Online Army Builder UI Application

import {
  BASE_PROFILES,
  TRAITS,
  RELICS,
  STRATEGIES,
  SPELLS,
  HORDE_RULE,
  BANNER_COLORS,
  PROFILE_MAP,
  TRAIT_MAP,
  RELIC_MAP,
  STRATEGY_MAP,
  SPELL_MAP,
  INCOMPATIBILITY_MAP,
  PRESET_ARMIES
} from './data.js?v=4';

import {
  generateId,
  computeUnit,
  computeArmy,
  checkTraitConflict,
  formatShooting,
  formatDefence,
  formatCostDelta,
  exportArmyText,
  encodeArmyToShareHash,
  decodeArmyFromShareHash
} from './engine.js?v=4';

import {
  renderBattleModeHtml,
  handleBattleAction,
  renderPregameModalHtml,
  handlePregameAction,
  buildPrintCardsHtml
} from './battle.js?v=4';

import {
  UNIT_ICONS,
  UNIT_ICON_MAP,
  detectUnitIconId,
  renderUnitIconHtml
} from './icons.js?v=4';

import { renderComparisonHtml } from './compare.js?v=4';

const STORAGE_KEY = 'fb_army_builder_v1';
const CUSTOM_PRESETS_KEY = 'fb_custom_presets_v1';
const THEME_KEY = 'fb_army_builder_theme_v2';

// ============================================================================
// Application State
// ============================================================================

const state = {
  armies: [],
  customPresets: [],
  currentArmyId: null,
  viewMode: 'build', // 'build' | 'battle'
  mobileTab: 'roster', // 'roster' | 'battle' | 'tactics'
  mobileOptionsOpen: false,
  printMode: 'table', // 'table' | 'cards'
  filterMode: 'all', // 'all' | 'active'
  searchQuery: '',
  templateTab: 'all', // 'all' | 'custom' | 'fantasy' | 'historical'
  templateSearch: '',
  compendiumTab: 'traits',
  compendiumSearch: '',
  compare: { idA: null, idB: null },
  dragUnitId: null,
  history: {
    past: [],
    future: []
  },
  // Unit editor draft
  editor: {
    open: false,
    editingUnitId: null, // null when creating new
    focusedSlot: 0, // 0 = racial, 1 = trait1, 2 = trait2, 3 = trait3
    traitSearch: '',
    draft: null
  }
};

function pushUndoSnapshot() {
  const cur = getCurrentArmy();
  if (!cur) return;
  state.history.past.push({
    armyId: cur.id,
    snapshot: JSON.stringify(cur)
  });
  if (state.history.past.length > 40) state.history.past.shift();
  state.history.future = [];
  updateUndoButtons();
}

function updateUndoButtons() {
  const uBtn = document.getElementById('btnUndo');
  const rBtn = document.getElementById('btnRedo');
  if (uBtn) uBtn.disabled = state.history.past.length === 0;
  if (rBtn) rBtn.disabled = state.history.future.length === 0;
}

function performUndo() {
  if (state.history.past.length === 0) return;
  const entry = state.history.past.pop();
  const idx = state.armies.findIndex(a => a.id === entry.armyId);
  if (idx < 0) { updateUndoButtons(); return; }
  state.history.future.push({
    armyId: entry.armyId,
    snapshot: JSON.stringify(state.armies[idx])
  });
  state.armies[idx] = JSON.parse(entry.snapshot);
  state.currentArmyId = entry.armyId;
  saveState();
  renderAll();
  updateUndoButtons();
  showToast('Undid last change');
}

function performRedo() {
  if (state.history.future.length === 0) return;
  const entry = state.history.future.pop();
  const idx = state.armies.findIndex(a => a.id === entry.armyId);
  if (idx < 0) { updateUndoButtons(); return; }
  state.history.past.push({
    armyId: entry.armyId,
    snapshot: JSON.stringify(state.armies[idx])
  });
  state.armies[idx] = JSON.parse(entry.snapshot);
  state.currentArmyId = entry.armyId;
  saveState();
  renderAll();
  updateUndoButtons();
  showToast('Redid change');
}

// ============================================================================
// Helpers
// ============================================================================

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCurrentArmy() {
  return state.armies.find(a => a.id === state.currentArmyId) || state.armies[0] || null;
}

function formatTraitModsShort(trait) {
  const parts = [];
  const m = trait.mods || {};
  if (m.res) parts.push(`Res ${formatCostDelta(m.res)}`);
  if (m.mov) parts.push(`Mov ${formatCostDelta(m.mov)}`);
  if (m.mel) parts.push(`Mel ${formatCostDelta(m.mel)}`);
  if (m.shtMode === 'setBoth') parts.push(`Sht ${m.shtShort}/${m.shtLong}`);
  else if (m.shtMode === 'setShort') parts.push(`Sht ${m.shtShort}/—`);
  else if (m.shtMode === 'addShort') parts.push(`Sht +${m.shtShort}/+0`);
  if (m.def) parts.push(`Def ${formatCostDelta(m.def)}`);
  if (m.com) parts.push(`Com +${m.com}`);
  return parts.join(', ');
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function createArmyFromPreset(preset, withStarterSelection = false) {
  const starterBases = withStarterSelection ? {
    'Prince': { bases: 1, relic: 'Blade of Unsurpassable Power' },
    'Mage': { bases: 1, relic: 'Mystical Tome of Revelation' },
    'Spearmen': { bases: 3 },
    'Archers': { bases: 2 },
    'Noble Lancers': { bases: 2 },
    'Bolt Thrower': { bases: 1 }
  } : {};

  return {
    id: generateId(),
    name: withStarterSelection ? `${preset.name} (500pt Starter)` : preset.name,
    tagline: preset.tagline || '',
    bannerColor: preset.bannerColor || 'gold',
    pointsLimit: typeof preset.pointsLimit === 'number' ? preset.pointsLimit : 500,
    defaultRacial: preset.defaultRacial || '',
    strategies: withStarterSelection
      ? ['Scouts']
      : (Array.isArray(preset.strategies) ? [...preset.strategies] : []),
    updatedAt: Date.now(),
    units: preset.units.map(u => {
      const start = starterBases[u.name] || {};
      return {
        id: generateId(),
        name: u.name,
        company: u.company,
        racial: u.racial || '',
        traits: Array.isArray(u.traits) ? [...u.traits] : [],
        relic: start.relic || u.relic || '',
        icon: u.icon || '',
        spells: u.spells ? { ...u.spells } : (withStarterSelection && u.name === 'Mage' ? { Bless: 2, Empower: 1, 'Magic Missiles': 1 } : {}),
        notes: u.notes || '',
        attachedTo: '',
        horde: Boolean(u.horde),
        bases: start.bases ?? (typeof u.bases === 'number' ? u.bases : 0)
      };
    })
  };
}

function createBlankArmy(name = 'New Army') {
  return {
    id: generateId(),
    name,
    tagline: '',
    bannerColor: 'gold',
    pointsLimit: 500,
    defaultRacial: '',
    strategies: [],
    updatedAt: Date.now(),
    units: []
  };
}

function cloneArmy(src, customName = null) {
  return {
    id: generateId(),
    name: customName ?? src.name,
    tagline: src.tagline || '',
    bannerColor: src.bannerColor || 'gold',
    pointsLimit: typeof src.pointsLimit === 'number' ? src.pointsLimit : 500,
    defaultRacial: src.defaultRacial || '',
    strategies: Array.isArray(src.strategies) ? [...src.strategies] : [],
    updatedAt: Date.now(),
    units: (src.units || []).map(u => ({
      ...u,
      id: generateId(),
      traits: Array.isArray(u.traits) ? [...u.traits] : [],
      spells: u.spells ? { ...u.spells } : {},
      notes: u.notes || '',
      attachedTo: ''
    }))
  };
}

function formatSavedTime(ts) {
  if (!ts) return 'Saved';
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Saved';
  }
}

function getAllPresets() {
  return [...state.customPresets, ...PRESET_ARMIES];
}

function saveCustomPresets() {
  try {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(state.customPresets));
  } catch {
    // ignore quota errors
  }
}

function saveState() {
  const cur = getCurrentArmy();
  if (cur) cur.updatedAt = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      armies: state.armies,
      currentArmyId: state.currentArmyId
    }));
  } catch {
    // ignore quota errors
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.armies) && parsed.armies.length > 0) {
        state.armies = parsed.armies;
        state.currentArmyId = parsed.currentArmyId || parsed.armies[0].id;
      }
    }
  } catch {
    // ignore corrupt storage
  }

  try {
    const rawPresets = localStorage.getItem(CUSTOM_PRESETS_KEY);
    if (rawPresets) {
      const parsedPresets = JSON.parse(rawPresets);
      if (Array.isArray(parsedPresets)) {
        state.customPresets = parsedPresets;
      }
    }
  } catch {
    // ignore corrupt storage
  }

  if (state.armies.length === 0) {
    const starter = createArmyFromPreset(PRESET_ARMIES[0], true);
    state.armies.push(starter);
    state.currentArmyId = starter.id;
  }

  // Check URL share hash
  if (window.location.hash && window.location.hash.startsWith('#army=')) {
    const shared = decodeArmyFromShareHash(window.location.hash);
    if (shared) {
      state.armies.unshift(shared);
      state.currentArmyId = shared.id;
      history.replaceState(null, '', window.location.pathname + window.location.search);
      setTimeout(() => showToast(`Loaded shared army: "${shared.name}"`), 250);
    }
  }

  saveState();
}

// ============================================================================
// Theme Management
// ============================================================================

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(saved || 'dark');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  document.getElementById('themeIconSun').style.display = theme === 'dark' ? 'block' : 'none';
  document.getElementById('themeIconMoon').style.display = theme === 'dark' ? 'none' : 'block';
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#252524' : '#fefefe');
}

// ============================================================================
// Rendering: Main App
// ============================================================================

function renderAll() {
  const army = getCurrentArmy();
  if (!army) return;
  const summary = computeArmy(army);

  renderTopBar(army);
  renderCommandBar(army, summary);
  renderRoster(army, summary);
  renderSidebar(army, summary);
  renderMobileChrome(army, summary);
}

function renderMobileChrome(army, summary) {
  const workspace = document.querySelector('.workspace');
  if (workspace) {
    workspace.setAttribute('data-mobile-tab', state.mobileTab);
  }

  const cmdBar = document.querySelector('.command-bar');
  const optBtn = document.getElementById('btnMobileCommandToggle');
  if (cmdBar && optBtn) {
    cmdBar.classList.toggle('mobile-options-open', state.mobileOptionsOpen);
    optBtn.setAttribute('aria-expanded', String(state.mobileOptionsOpen));
    optBtn.textContent = state.mobileOptionsOpen ? 'Options ▴' : 'Options ▾';
  }

  const nav = document.getElementById('mobileBottomNav');
  if (nav) {
    nav.querySelectorAll('.mobile-nav-btn[data-mobile-tab]').forEach(btn => {
      const tab = btn.dataset.mobileTab;
      btn.classList.toggle('active', tab === state.mobileTab);
    });
  }

  const badge = document.getElementById('mobileTacticsBadge');
  if (badge) {
    const errCount = summary.errors.length;
    const stratCount = (army.strategies || []).length;
    if (errCount > 0) {
      badge.textContent = '!';
      badge.className = 'mobile-nav-badge danger';
      badge.style.display = 'inline-flex';
    } else if (stratCount > 0) {
      badge.textContent = String(stratCount);
      badge.className = 'mobile-nav-badge';
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }

  const mobDel = document.getElementById('btnMobileDeleteArmy');
  if (mobDel) mobDel.disabled = state.armies.length <= 1;
}

function renderTopBar(army) {
  const sel = document.getElementById('armySelect');
  sel.innerHTML = state.armies.map(a =>
    `<option value="${escapeHtml(a.id)}" ${a.id === army.id ? 'selected' : ''}>${escapeHtml(a.name || 'Untitled Army')}</option>`
  ).join('');
  document.getElementById('btnDeleteArmy').disabled = state.armies.length <= 1;
}

function renderCommandBar(army, summary) {
  const nameInput = document.getElementById('armyNameInput');
  if (document.activeElement !== nameInput) {
    nameInput.value = army.name || '';
  }

  // Points Limit selector
  const limitSel = document.getElementById('pointsLimitSelect');
  const customInput = document.getElementById('customPointsInput');
  const standardLimits = [0, 250, 500, 750, 1000, 1500];
  if (standardLimits.includes(army.pointsLimit)) {
    limitSel.value = String(army.pointsLimit);
    customInput.style.display = 'none';
  } else {
    limitSel.value = 'custom';
    customInput.style.display = 'inline-block';
    if (document.activeElement !== customInput) {
      customInput.value = army.pointsLimit;
    }
  }

  // Default Racial Trait selector
  const racialSel = document.getElementById('defaultRacialSelect');
  if (racialSel.options.length === 0) {
    const opts = ['<option value="">None</option>'];
    for (const t of TRAITS) {
      if (!t.characterRole) {
        opts.push(`<option value="${escapeHtml(t.id)}">${escapeHtml(t.name)} (${formatCostDelta(t.cost)})</option>`);
      }
    }
    racialSel.innerHTML = opts.join('');
  }
  racialSel.value = army.defaultRacial || '';

  // KPIs
  const kpiPointsBox = document.getElementById('kpiPointsBox');
  const kpiPointsVal = document.getElementById('kpiPointsVal');
  const barFill = document.getElementById('pointsBarFill');

  const overLimit = summary.pointsLimit > 0 && summary.totalPoints > summary.pointsLimit;
  kpiPointsBox.classList.toggle('over-limit', overLimit);

  if (summary.pointsLimit > 0) {
    kpiPointsVal.textContent = `${summary.totalPoints} / ${summary.pointsLimit}`;
    const pct = Math.min(100, Math.round((summary.totalPoints / summary.pointsLimit) * 100));
    barFill.style.width = `${pct}%`;
    barFill.classList.toggle('over', overLimit);
  } else {
    kpiPointsVal.textContent = `${summary.totalPoints} pts`;
    barFill.style.width = summary.totalPoints > 0 ? '100%' : '0%';
    barFill.classList.remove('over');
  }

  document.getElementById('kpiCompaniesVal').textContent = String(summary.startingCompanies);
  const exclText = summary.excludedCompanies > 0 ? ` (+${summary.excludedCompanies} excl.)` : '';
  document.getElementById('kpiCompaniesSub').textContent = `${summary.totalBases} total bases${exclText}`;
  document.getElementById('kpiBreakPointVal').textContent = String(summary.breakPoint);

  // Composition Limit Pills
  const limitPills = document.getElementById('limitPills');
  const entries = [
    { key: 'Lord', title: 'Warlord / Mage-lord' },
    { key: 'Captain', title: 'Captains' },
    { key: 'Magic-user', title: 'Magic-users' },
    { key: 'Rogue', title: 'Rogues' }
  ];

  limitPills.innerHTML = entries.map(e => {
    const info = summary.limits[e.key];
    let cls = 'limit-pill';
    if (!info.ok) cls += ' invalid';
    else if (info.count > 0) cls += ' ok-active';
    return `
      <span class="${cls}" title="${escapeHtml(e.title)}: ${info.count} of max ${info.max}">
        <span>${escapeHtml(e.title)}</span>
        <span class="count">${info.count}/${info.max}</span>
      </span>
    `;
  }).join('');

  // Status badge
  const statusEl = document.getElementById('armyStatusBadge');
  if (summary.errors.length > 0) {
    statusEl.className = 'status-badge invalid';
    statusEl.textContent = `${summary.errors.length} Rule ${summary.errors.length === 1 ? 'Issue' : 'Issues'}`;
  } else if (summary.warnings.length > 0) {
    statusEl.className = 'status-badge warn';
    statusEl.textContent = `${summary.warnings.length} ${summary.warnings.length === 1 ? 'Notice' : 'Notices'}`;
  } else if (summary.totalPoints === 0) {
    statusEl.className = 'status-badge valid';
    statusEl.textContent = 'Ready to Muster';
  } else {
    statusEl.className = 'status-badge valid';
    statusEl.textContent = 'Army Legal';
  }
}

function renderRoster(army, summary) {
  const isBattle = state.viewMode === 'battle';
  document.querySelector('.roster-toolbar')?.classList.toggle('is-battle-mode', isBattle);
  document.getElementById('modeBuild').classList.toggle('active', !isBattle);
  document.getElementById('modeBattle').classList.toggle('active', isBattle);
  document.getElementById('buildOnlyFilters').style.display = isBattle ? 'none' : 'flex';
  document.getElementById('btnResetBases').style.display = isBattle ? 'none' : 'inline-flex';
  document.getElementById('btnAddUnit').style.display = isBattle ? 'none' : 'inline-flex';
  document.getElementById('undoRedoGroup').style.display = isBattle ? 'none' : 'inline-flex';
  updateUndoButtons();

  const container = document.getElementById('rosterContainer');
  if (isBattle) {
    container.innerHTML = renderBattleModeHtml(army);
    return;
  }

  const allItems = summary.computedUnits;
  const activeItems = allItems.filter(x => x.calc.bases > 0);

  document.getElementById('countAll').textContent = `(${allItems.length})`;
  document.getElementById('countActive').textContent = `(${activeItems.length})`;
  document.getElementById('filterAll').classList.toggle('active', state.filterMode === 'all');
  document.getElementById('filterActive').classList.toggle('active', state.filterMode === 'active');

  const q = state.searchQuery.trim().toLowerCase();
  const visible = (state.filterMode === 'active' ? activeItems : allItems).filter(({ unit, calc }) => {
    if (!q) return true;
    const hay = [
      unit.name,
      unit.company,
      unit.racial,
      ...(unit.traits || []),
      unit.relic,
      ...(calc.isHorde ? ['horde'] : []),
      ...(calc.spells || []).map(s => s.id),
      unit.notes || ''
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });

  if (allItems.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Your Army Roster is Empty</h3>
        <p>Start forging custom units from scratch, or load one of the 38 Fantasy &amp; Historical faction presets.</p>
        <div class="empty-actions">
          <button class="btn btn-primary" data-action="open-add-unit">+ Add First Unit</button>
          <button class="btn" data-action="open-templates">Browse Faction Presets</button>
        </div>
      </div>
    `;
    return;
  }

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No Matching Units</h3>
        <p>${state.filterMode === 'active'
          ? 'No units currently have # Bases > 0. Switch to "All" and click + to add bases to your battle roster.'
          : 'No units match your search filter.'}</p>
        <div class="empty-actions">
          ${state.filterMode === 'active'
            ? '<button class="btn btn-primary" data-action="show-all-units">Show All Catalog Units</button>'
            : '<button class="btn" data-action="clear-search">Clear Search</button>'}
        </div>
      </div>
    `;
    return;
  }

  const unitById = Object.fromEntries((army.units || []).map(u => [u.id, u]));
  const attachedByHost = {};
  for (const u of army.units || []) {
    if (u.attachedTo && unitById[u.attachedTo]) {
      attachedByHost[u.attachedTo] = attachedByHost[u.attachedTo] || [];
      attachedByHost[u.attachedTo].push(u.name || u.company);
    }
  }

  const characters = visible.filter(x => x.calc.charInfo.isStandaloneCharacter);
  const companies = visible.filter(x => !x.calc.charInfo.isStandaloneCharacter);

  const sections = [];
  if (characters.length > 0) {
    sections.push(renderUnitSection('Characters', characters, unitById, attachedByHost));
  }
  if (companies.length > 0) {
    sections.push(renderUnitSection('Companies', companies, unitById, attachedByHost));
  }

  container.innerHTML = sections.join('');
}

function renderUnitSection(title, items, unitById = {}, attachedByHost = {}) {
  const activeCount = items.reduce((s, x) => s + x.calc.bases, 0);
  const sectionPts = items.reduce((s, x) => s + x.calc.totalCost, 0);
  return `
    <div class="unit-section">
      <div class="section-header">
        <div class="section-title">
          <span>${escapeHtml(title)}</span>
          <span class="section-count">${activeCount} active &middot; ${sectionPts} pts</span>
        </div>
      </div>
      <div class="unit-list">
        ${items.map((item, idx) => renderUnitCard(item, idx, items.length, unitById, attachedByHost)).join('')}
      </div>
    </div>
  `;
}

function statClass(delta) {
  if (delta > 0) return 'boosted';
  if (delta < 0) return 'reduced';
  return '';
}

function renderStatStrip(calc) {
  const d = calc.deltas || {};
  return `
    <div class="stat-strip" aria-label="Unit stats">
      <div class="stat-cell" title="Resolve">
        <span class="stat-cell-label">Res</span>
        <span class="stat-cell-val ${statClass(d.res)}">${calc.res}</span>
      </div>
      <div class="stat-cell" title="Movement (base widths)">
        <span class="stat-cell-label">Mov</span>
        <span class="stat-cell-val ${statClass(d.mov)}">${calc.mov}</span>
      </div>
      <div class="stat-cell" title="Melee attack dice">
        <span class="stat-cell-label">Mel</span>
        <span class="stat-cell-val ${statClass(d.mel)}">${calc.mel}</span>
      </div>
      <div class="stat-cell" title="Shooting (Short / Long)">
        <span class="stat-cell-label">Sht</span>
        <span class="stat-cell-val ${d.shtChanged ? 'modified' : ''}">${formatShooting(calc.shtShort, calc.shtLong)}</span>
      </div>
      <div class="stat-cell" title="Defence target roll">
        <span class="stat-cell-label">Def</span>
        <span class="stat-cell-val ${statClass(d.def)}">${formatDefence(calc.def)}</span>
      </div>
      <div class="stat-cell" title="Command radius">
        <span class="stat-cell-label">Com</span>
        <span class="stat-cell-val ${statClass(d.com)}">${calc.com || '—'}</span>
      </div>
    </div>
  `;
}

function renderUnitCard({ unit, calc }, index = 0, totalInSection = 1, unitById = {}, attachedByHost = {}) {
  const isActive = calc.bases > 0;
  const isChar = calc.charInfo.isCharacter;
  const cardClasses = [
    'unit-card',
    isActive ? 'active-unit' : 'inactive-unit',
    isChar ? 'character-card' : '',
    !calc.valid && isActive ? 'has-error' : ''
  ].filter(Boolean).join(' ');

  const pills = [];
  if (unit.racial && TRAIT_MAP[unit.racial] && calc.profile.allowTraits) {
    pills.push(`
      <button type="button" class="rule-pill pill-racial" data-rule-type="trait" data-rule-id="${escapeHtml(unit.racial)}" title="Click for rule details">
        <span class="pill-tag">Racial</span>
        <span>${escapeHtml(unit.racial)}</span>
      </button>
    `);
  }
  if (calc.profile.allowTraits && Array.isArray(unit.traits)) {
    for (const tid of unit.traits) {
      if (!tid || !TRAIT_MAP[tid]) continue;
      const isCharTrait = !!TRAIT_MAP[tid].characterRole;
      pills.push(`
        <button type="button" class="rule-pill ${isCharTrait ? 'pill-char-trait' : ''}" data-rule-type="trait" data-rule-id="${escapeHtml(tid)}" title="Click for rule details">
          <span>${escapeHtml(tid)}</span>
        </button>
      `);
    }
  }
  if (calc.isHorde) {
    pills.push(`
      <button type="button" class="rule-pill pill-horde" data-rule-type="horde" data-rule-id="Horde" title="Click for Horde formation rules">
        <span class="pill-tag">Trait</span>
        <span>Horde (${escapeHtml(calc.hordeFormation)})</span>
      </button>
    `);
  }
  if (calc.relic) {
    pills.push(`
      <button type="button" class="rule-pill pill-relic" data-rule-type="relic" data-rule-id="${escapeHtml(calc.relic.id)}" title="Click for relic details">
        <span class="pill-tag">Relic</span>
        <span>${escapeHtml(calc.relic.name)}</span>
      </button>
    `);
  }
  if (calc.spells && calc.spells.length > 0) {
    for (const sp of calc.spells) {
      pills.push(`
        <button type="button" class="rule-pill pill-spell" data-rule-type="spell" data-rule-id="${escapeHtml(sp.id)}" title="Click for spell rules">
          <span class="pill-tag">L${sp.level}</span>
          <span>${escapeHtml(sp.id)}</span>
        </button>
      `);
    }
  }
  if (unit.attachedTo && unitById[unit.attachedTo]) {
    pills.push(`<span class="rule-pill pill-attach">Attached → ${escapeHtml(unitById[unit.attachedTo].name)}</span>`);
  }
  if (attachedByHost[unit.id]?.length) {
    pills.push(`<span class="rule-pill pill-attach">With: ${escapeHtml(attachedByHost[unit.id].join(', '))}</span>`);
  }

  const errorHtml = calc.unitErrors.length > 0
    ? `<span class="unit-error-inline">${escapeHtml(calc.unitErrors[0])}</span>`
    : '';

  return `
    <article class="${cardClasses}" data-unit-id="${escapeHtml(unit.id)}" draggable="true">
      <div class="unit-main">
        <div class="unit-header-row" style="align-items:center;">
          ${renderUnitIconHtml(unit, calc)}
          <h4 class="unit-name">${escapeHtml(unit.name || calc.profile.name)}</h4>
          <span class="unit-profile-badge ${isChar ? 'is-char' : ''}">${escapeHtml(calc.profile.name)}</span>
          ${errorHtml}
        </div>
        ${renderStatStrip(calc)}
        ${pills.length > 0 ? `<div class="pill-row">${pills.join('')}</div>` : ''}
        ${unit.notes ? `<div class="unit-note-line">${escapeHtml(unit.notes)}</div>` : ''}
      </div>

      <div class="unit-controls">
        <div class="unit-cost-row">
          <div class="unit-cost-meta">
            <div class="unit-total-pts">${calc.totalCost} pts</div>
            <div class="unit-each-pts">${calc.cost} pts / base</div>
          </div>
          <div class="stepper" aria-label="Number of bases">
            <button type="button" data-action="dec-bases" data-unit-id="${escapeHtml(unit.id)}" ${calc.bases <= 0 ? 'disabled' : ''} aria-label="Decrease bases">&minus;</button>
            <span class="stepper-val">${calc.bases}</span>
            <button type="button" data-action="inc-bases" data-unit-id="${escapeHtml(unit.id)}" aria-label="Increase bases">+</button>
          </div>
        </div>
        ${calc.canFormHorde ? `
          <div class="unit-horde-row">
            <button type="button" class="btn btn-sm btn-horde-toggle ${calc.isHorde ? 'active' : ''}" data-action="toggle-horde" data-unit-id="${escapeHtml(unit.id)}" title="${calc.isHorde ? 'Disband Horde formation' : 'Form Irregular bases into a two-deep Horde (+1 front Mel/Charge, +1 Sht)'}">
              ${calc.isHorde ? `✓ Horde Formed (${escapeHtml(calc.hordeFormation)})` : `+ Form Horde (${escapeHtml(calc.hordeFormation)})`}
            </button>
          </div>
        ` : ''}
        <div class="unit-actions">
          <div class="reorder-btns" aria-label="Reorder unit">
            <button type="button" class="btn btn-sm btn-ghost btn-reorder" data-action="move-unit-up" data-unit-id="${escapeHtml(unit.id)}" ${index <= 0 ? 'disabled' : ''} title="Move unit up" aria-label="Move unit up">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
            <button type="button" class="btn btn-sm btn-ghost btn-reorder" data-action="move-unit-down" data-unit-id="${escapeHtml(unit.id)}" ${index >= totalInSection - 1 ? 'disabled' : ''} title="Move unit down" aria-label="Move unit down">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>
          <button type="button" class="btn btn-sm btn-ghost" data-action="edit-unit" data-unit-id="${escapeHtml(unit.id)}">Edit</button>
          <button type="button" class="btn btn-sm btn-ghost" data-action="dup-unit" data-unit-id="${escapeHtml(unit.id)}" title="Duplicate unit">Copy</button>
          <button type="button" class="btn btn-sm btn-danger-ghost" data-action="del-unit" data-unit-id="${escapeHtml(unit.id)}" title="Delete unit">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderSidebar(army, summary) {
  // Strategies
  const selectedIds = new Set(army.strategies || []);
  const atMax = selectedIds.size >= 3;

  document.getElementById('strategyBadge').textContent = `${selectedIds.size} / 3 · ${summary.strategyPoints} pts`;

  const stratList = document.getElementById('strategyList');
  stratList.innerHTML = STRATEGIES.map(s => {
    const isSel = selectedIds.has(s.id);
    const disabled = !isSel && atMax;
    return `
      <button type="button" class="strategy-item ${isSel ? 'selected' : ''}" data-action="toggle-strategy" data-strategy-id="${escapeHtml(s.id)}" ${disabled ? 'disabled' : ''}>
        <div>
          <div class="strategy-name">
            <span>${isSel ? '✓' : '+'}</span>
            <span>${escapeHtml(s.name)}</span>
          </div>
          <div class="strategy-desc-short">${escapeHtml(s.description)}</div>
        </div>
        <span class="strategy-cost">${s.cost} pts</span>
      </button>
    `;
  }).join('');

  // Breakdown
  document.getElementById('breakdownTotalBadge').textContent = `${summary.totalPoints} pts`;
  const remaining = summary.pointsLimit > 0 ? summary.pointsLimit - summary.totalPoints : null;

  document.getElementById('breakdownContent').innerHTML = `
    <div class="breakdown-row"><span>Standalone Characters</span><strong>${summary.characterPoints} pts</strong></div>
    <div class="breakdown-row"><span>Companies</span><strong>${summary.companyPoints} pts</strong></div>
    <div class="breakdown-row"><span>Strategies (${summary.strategies.length})</span><strong>${summary.strategyPoints} pts</strong></div>
    <div class="breakdown-row" style="font-size:12px;"><span>(Relics included above)</span><strong>${summary.relicPoints} pts</strong></div>
    <hr class="breakdown-divider" />
    <div class="breakdown-row"><span>Starting Companies (BP)</span><strong>${summary.startingCompanies}</strong></div>
    <div class="breakdown-row"><span>Army Break Point</span><strong>${summary.breakPoint} scattered</strong></div>
    ${remaining !== null ? `
      <hr class="breakdown-divider" />
      <div class="breakdown-row">
        <span>${remaining >= 0 ? 'Points Remaining' : 'Points Over Limit'}</span>
        <strong style="color:${remaining >= 0 ? 'var(--ok)' : 'var(--danger)'};">${Math.abs(remaining)} pts</strong>
      </div>
    ` : ''}
  `;

  // Validation Alerts
  const alertsEl = document.getElementById('validationAlerts');
  const alertHtml = [];
  for (const err of summary.errors) {
    alertHtml.push(`<div class="alert-item error"><span>⚠</span><span>${escapeHtml(err)}</span></div>`);
  }
  for (const warn of summary.warnings) {
    alertHtml.push(`<div class="alert-item warning"><span>•</span><span>${escapeHtml(warn)}</span></div>`);
  }
  if (summary.errors.length === 0 && summary.warnings.length === 0 && summary.totalPoints > 0) {
    alertHtml.push(`<div class="alert-item ok"><span>✓</span><span>All composition and trait rules satisfied!</span></div>`);
  }
  alertsEl.innerHTML = alertHtml.join('');

  // Tactical Profile Analytics
  const an = summary.analytics;
  const tagChips = [];
  if (an.tagCounts.mounted) tagChips.push(`<span class="tactical-tag">Mounted: ${an.tagCounts.mounted}</span>`);
  if (an.tagCounts.flying) tagChips.push(`<span class="tactical-tag">Flying: ${an.tagCounts.flying}</span>`);
  if (an.tagCounts.artillery) tagChips.push(`<span class="tactical-tag">Artillery: ${an.tagCounts.artillery}</span>`);
  if (an.tagCounts.shooting) tagChips.push(`<span class="tactical-tag">Shooters: ${an.tagCounts.shooting}</span>`);
  if (an.tagCounts.magic) tagChips.push(`<span class="tactical-tag">Mages: ${an.tagCounts.magic}</span>`);

  document.getElementById('tacticalProfileContent').innerHTML = `
    <div class="tactical-stat">
      <div class="tactical-stat-label">Melee Dice</div>
      <div class="tactical-stat-val">${an.totalMeleeDice}</div>
    </div>
    <div class="tactical-stat">
      <div class="tactical-stat-label">Shooting (S/L)</div>
      <div class="tactical-stat-val">${an.totalShortShootDice} / ${an.totalLongShootDice}</div>
    </div>
    <div class="tactical-stat">
      <div class="tactical-stat-label">Avg Resolve</div>
      <div class="tactical-stat-val">${an.avgResolve}</div>
    </div>
    <div class="tactical-stat">
      <div class="tactical-stat-label">Avg Move</div>
      <div class="tactical-stat-val">${an.avgMove}</div>
    </div>
    ${tagChips.length ? `<div class="tactical-tags">${tagChips.join('')}</div>` : ''}
  `;
}

// ============================================================================
// Unit Forge / Editor Drawer
// ============================================================================

function openUnitEditor(unitId = null) {
  const army = getCurrentArmy();
  if (!army) return;

  if (unitId) {
    const existing = army.units.find(u => u.id === unitId);
    if (!existing) return;
    state.editor.editingUnitId = existing.id;
    state.editor.draft = {
      id: existing.id,
      name: existing.name || '',
      company: existing.company || 'Formed company',
      racial: existing.racial || '',
      traits: [
        existing.traits?.[0] || '',
        existing.traits?.[1] || '',
        existing.traits?.[2] || ''
      ],
      relic: existing.relic || '',
      icon: existing.icon || '',
      spells: existing.spells ? { ...existing.spells } : {},
      attachedTo: existing.attachedTo || '',
      notes: existing.notes || '',
      horde: Boolean(existing.horde),
      bases: existing.bases ?? 1
    };
    document.getElementById('drawerTitle').textContent = 'Edit Unit';
    document.getElementById('btnSaveAndAddAnother').style.display = 'none';
    document.getElementById('btnDeleteUnitInEditor').style.display = 'inline-flex';
  } else {
    state.editor.editingUnitId = null;
    state.editor.draft = {
      id: generateId(),
      name: '',
      company: 'Formed company',
      racial: army.defaultRacial || '',
      traits: ['', '', ''],
      relic: '',
      icon: '',
      spells: {},
      attachedTo: '',
      notes: '',
      horde: false,
      bases: 1
    };
    document.getElementById('drawerTitle').textContent = 'Forge New Unit';
    document.getElementById('btnSaveAndAddAnother').style.display = 'inline-flex';
    document.getElementById('btnDeleteUnitInEditor').style.display = 'none';
  }

  state.editor.focusedSlot = state.editor.draft.racial ? 1 : 0;
  state.editor.traitSearch = '';
  state.editor.open = true;

  document.getElementById('editUnitName').value = state.editor.draft.name;
  document.getElementById('editUnitBases').value = state.editor.draft.bases;
  document.getElementById('editUnitNotes').value = state.editor.draft.notes || '';
  document.getElementById('traitSearchInput').value = '';

  renderEditor();
  openOverlay('unitDrawerOverlay');
  setTimeout(() => document.getElementById('editUnitName').focus(), 60);
}

function getDraftAllTraits(draft, excludeSlot = -1) {
  const arr = [];
  if (excludeSlot !== 0 && draft.racial) arr.push(draft.racial);
  for (let i = 0; i < 3; i++) {
    if (excludeSlot !== i + 1 && draft.traits[i]) arr.push(draft.traits[i]);
  }
  return arr;
}

function getDraftSlotValue(draft, slotIndex) {
  return slotIndex === 0 ? draft.racial : draft.traits[slotIndex - 1];
}

function setDraftSlotValue(draft, slotIndex, value) {
  if (slotIndex === 0) draft.racial = value;
  else draft.traits[slotIndex - 1] = value;
}

function renderEditor() {
  const draft = state.editor.draft;
  if (!draft) return;

  const cleanDraft = {
    ...draft,
    traits: draft.traits.filter(Boolean)
  };
  const calc = computeUnit(cleanDraft);

  // 1. Live Preview Card
  const previewEl = document.getElementById('editorPreview');
  const breakdownStr = calc.costBreakdown
    .map(b => `${b.label} (${b.cost >= 0 ? '+' : ''}${b.cost})`)
    .join(' · ');

  previewEl.innerHTML = `
    <div class="preview-top">
      <div style="display:flex; align-items:center; gap:10px;">
        ${renderUnitIconHtml(cleanDraft, calc, 'icon-lg')}
        <div>
          <div class="preview-name">${escapeHtml(draft.name || calc.profile.name)}</div>
          <div style="font-size:12px; color:var(--text-secondary);">${escapeHtml(calc.profile.name)}${calc.charInfo.isCharacterCompany ? ' · Character-Company' : ''}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="preview-cost">${calc.cost} pts / base</div>
        <div style="font-size:11.5px; color:var(--text-muted); font-family:var(--font-mono);">Total (${calc.bases}×): ${calc.totalCost} pts</div>
      </div>
    </div>
    ${renderStatStrip(calc)}
    ${calc.isHorde ? `<div class="pill-row"><span class="rule-pill pill-horde"><span class="pill-tag">Trait</span><span>Horde (${escapeHtml(calc.hordeFormation)})</span></span></div>` : ''}
    <div class="cost-breakdown-strip">${escapeHtml(breakdownStr)}</div>
    ${calc.unitErrors.length > 0 ? `<div class="alert-item error" style="margin:0;"><span>⚠</span><span>${escapeHtml(calc.unitErrors.join(' · '))}</span></div>` : ''}
  `;

  // 1a. Horde Formation Toggle in Editor
  const hordeBox = document.getElementById('editorHordeBox');
  if (calc.canFormHorde) {
    hordeBox.style.display = 'flex';
    hordeBox.innerHTML = `
      <div style="min-width:0;">
        <div class="horde-editor-title">Horde Formation Eligible (${escapeHtml(calc.hordeFormation)} block)</div>
        <div class="horde-editor-sub">${escapeHtml(HORDE_RULE.summary)} &middot; Free</div>
      </div>
      <button type="button" class="btn btn-sm btn-horde-toggle ${calc.isHorde ? 'active' : ''}" data-action="editor-toggle-horde">
        ${calc.isHorde ? '✓ Horde Formed' : `+ Form Horde`}
      </button>
    `;
  } else {
    draft.horde = false;
    hordeBox.style.display = 'none';
    hordeBox.innerHTML = '';
  }

  // 1b. Unit Icon Picker
  const detectedId = detectUnitIconId({ ...cleanDraft, icon: '' }, calc);
  const detectedLabel = UNIT_ICON_MAP[detectedId]?.label || 'Auto';
  const isAuto = !draft.icon;
  document.getElementById('iconPickerHint').textContent = isAuto
    ? `Auto (${detectedLabel})`
    : `Custom (${UNIT_ICON_MAP[draft.icon]?.label || draft.icon})`;

  document.getElementById('iconPickerStrip').innerHTML = [
    `<button type="button" class="icon-opt ${isAuto ? 'selected' : ''}" data-action="pick-icon" data-icon-id="" title="Auto-detect from profile &amp; traits">Auto</button>`,
    ...UNIT_ICONS.map(ic => `
      <button type="button" class="icon-opt ${draft.icon === ic.id ? 'selected' : ''}" data-action="pick-icon" data-icon-id="${ic.id}" title="${escapeHtml(ic.label)}" aria-label="${escapeHtml(ic.label)}">
        ${ic.svg}
      </button>
    `)
  ].join('');

  // 2. Profile Picker
  const charProfiles = BASE_PROFILES.filter(p => p.category === 'character');
  const compProfiles = BASE_PROFILES.filter(p => p.category === 'company');

  const renderProfGroup = (label, list) => `
    <div class="profile-picker-group">
      <div class="profile-group-label">${escapeHtml(label)}</div>
      <div class="profile-grid">
        ${list.map(p => `
          <button type="button" class="profile-opt ${draft.company === p.id ? 'selected' : ''}" data-action="pick-profile" data-profile-id="${escapeHtml(p.id)}">
            <div class="profile-opt-head">
              <span>${escapeHtml(p.name)}</span>
              <span class="profile-opt-cost">${p.cost} pts</span>
            </div>
            <div class="profile-opt-stats">R:${p.res} M:${p.mov} Ml:${p.mel} D:${p.def}+${p.com ? ` C:${p.com}` : ''}</div>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('profilePicker').innerHTML =
    renderProfGroup('Companies', compProfiles) +
    renderProfGroup('Standalone Characters (no traits)', charProfiles);

  // 3. Traits Section
  const traitsSection = document.getElementById('editorTraitsSection');
  if (!calc.profile.allowTraits) {
    traitsSection.style.display = 'none';
  } else {
    traitsSection.style.display = 'flex';
    const slotLabels = ['Racial Trait', 'Trait 1', 'Trait 2', 'Trait 3'];
    document.getElementById('traitSlots').innerHTML = slotLabels.map((lbl, idx) => {
      const val = getDraftSlotValue(draft, idx);
      const t = val ? TRAIT_MAP[val] : null;
      const focused = state.editor.focusedSlot === idx;
      return `
        <div class="trait-slot-box ${focused ? 'focused' : ''}" data-action="focus-slot" data-slot="${idx}">
          <div class="trait-slot-meta">
            <div class="trait-slot-label">${escapeHtml(lbl)}</div>
            <div class="trait-slot-val ${val ? '' : 'empty'}">${val ? `${escapeHtml(val)} (${formatCostDelta(t.cost)})` : 'Empty slot…'}</div>
          </div>
          ${val ? `<button type="button" class="btn btn-sm btn-ghost" data-action="clear-slot" data-slot="${idx}" title="Clear slot" style="padding:2px 6px;">&times;</button>` : ''}
        </div>
      `;
    }).join('');

    renderTraitPickerList(draft);
  }

  // 4. Relic Section
  const relicSel = document.getElementById('editUnitRelic');
  const relicHint = document.getElementById('relicHint');
  const relicDesc = document.getElementById('relicDescriptionBox');

  if (!calc.charInfo.isCharacter) {
    relicSel.disabled = true;
    relicSel.innerHTML = '<option value="">Relics require a Character or Character-company</option>';
    relicHint.textContent = 'Select a Character profile or add a Character (...) trait to equip a relic';
    relicDesc.textContent = '';
  } else {
    relicSel.disabled = false;
    relicHint.textContent = calc.charInfo.isMage
      ? 'Mage character — all relics unlocked'
      : 'Non-mage character (Familiar & Mystical Tome require a Mage)';

    const opts = ['<option value="">— No Relic —</option>'];
    for (const r of RELICS) {
      const restricted = r.mageOnly && !calc.charInfo.isMage;
      const tag = r.mageOnly ? ' [Mage only]' : '';
      opts.push(
        `<option value="${escapeHtml(r.id)}" ${draft.relic === r.id ? 'selected' : ''} ${restricted ? 'disabled' : ''}>${escapeHtml(r.name)} (+${r.cost} pts)${tag}</option>`
      );
    }
    relicSel.innerHTML = opts.join('');
    const currentRelic = RELIC_MAP[draft.relic];
    relicDesc.textContent = currentRelic ? currentRelic.description : '';
  }

  // 5. Spellbook Section (Mages only)
  const spellsSection = document.getElementById('editorSpellsSection');
  if (!calc.charInfo.isMage) {
    spellsSection.style.display = 'none';
  } else {
    spellsSection.style.display = 'flex';
    const maxLevels = calc.maxSpellLevels;
    const usedLevels = calc.totalSpellLevels;
    const budgetHint = document.getElementById('spellBudgetHint');
    budgetHint.textContent = `${usedLevels} / ${maxLevels} spell levels used${maxLevels === 4 ? ' (+1 Mystical Tome)' : ''}`;
    budgetHint.style.color = usedLevels > maxLevels ? 'var(--danger)' : 'var(--text-muted)';

    document.getElementById('spellPickerList').innerHTML = SPELLS.map(sp => {
      const lvl = (draft.spells && draft.spells[sp.id]) || 0;
      const canAdd = lvl < 3 && usedLevels < maxLevels;
      return `
        <div class="spell-row ${lvl > 0 ? 'active-spell' : ''}">
          <div class="spell-row-meta">
            <div class="spell-row-name">${escapeHtml(sp.name)} <span class="spell-row-info">(${escapeHtml(sp.difficulty)} · ${escapeHtml(sp.range)})</span></div>
            <div class="spell-row-info">${escapeHtml(sp.description.slice(0, 95))}${sp.description.length > 95 ? '…' : ''}</div>
          </div>
          <div class="stepper">
            <button type="button" data-action="dec-spell" data-spell-id="${escapeHtml(sp.id)}" ${lvl <= 0 ? 'disabled' : ''}>&minus;</button>
            <span class="stepper-val">L${lvl}</span>
            <button type="button" data-action="inc-spell" data-spell-id="${escapeHtml(sp.id)}" ${!canAdd ? 'disabled' : ''}>+</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 6. Character Attachment Section (Standalone Characters only)
  const attachSection = document.getElementById('editorAttachSection');
  const attachSel = document.getElementById('editUnitAttach');
  if (!calc.charInfo.isStandaloneCharacter) {
    attachSection.style.display = 'none';
  } else {
    attachSection.style.display = 'flex';
    const army = getCurrentArmy();
    const companyUnits = (army?.units || []).filter(u => PROFILE_MAP[u.company]?.category === 'company');
    const opts = ['<option value="">— Unattached —</option>'];
    for (const cu of companyUnits) {
      opts.push(`<option value="${escapeHtml(cu.id)}" ${draft.attachedTo === cu.id ? 'selected' : ''}>${escapeHtml(cu.name || cu.company)} (${escapeHtml(cu.company)})</option>`);
    }
    attachSel.innerHTML = opts.join('');
  }
}

function renderTraitPickerList(draft) {
  const slot = state.editor.focusedSlot;
  const currentVal = getDraftSlotValue(draft, slot);
  const otherTraits = getDraftAllTraits(draft, slot);
  const q = state.editor.traitSearch.trim().toLowerCase();

  const filtered = TRAITS
    .filter(t => !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    .sort((a, b) => {
      if (!q) return 0;
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const score = name => (name === q ? 0 : name.startsWith(q) ? 1 : name.includes(q) ? 2 : 3);
      return score(aName) - score(bName) || aName.localeCompare(bName);
    });

  const listEl = document.getElementById('traitPickerList');
  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="padding:14px; text-align:center; color:var(--text-muted); font-size:12.5px;">No traits match "${escapeHtml(state.editor.traitSearch)}"</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(t => {
    const isSelectedHere = currentVal === t.id;
    const conflict = isSelectedHere ? null : checkTraitConflict(t.id, otherTraits);
    const modsStr = formatTraitModsShort(t);
    return `
      <button type="button" class="trait-option ${isSelectedHere ? 'selected' : ''}" data-action="pick-trait" data-trait-id="${escapeHtml(t.id)}" ${conflict ? 'disabled' : ''}>
        <div style="min-width:0;">
          <div>
            <span class="trait-opt-name">${escapeHtml(t.name)}</span>
            ${modsStr ? `<span class="trait-opt-mods">${escapeHtml(modsStr)}</span>` : ''}
          </div>
          <div class="trait-opt-desc">${escapeHtml(t.description)}</div>
          ${conflict ? `<div class="trait-opt-conflict">${escapeHtml(conflict.reason)}</div>` : ''}
        </div>
        <span class="trait-opt-cost ${t.cost < 0 ? 'negative' : ''}">${formatCostDelta(t.cost)}</span>
      </button>
    `;
  }).join('');
}

function commitUnitDraft(addAnother = false) {
  const army = getCurrentArmy();
  const draft = state.editor.draft;
  if (!army || !draft) return;

  const profile = PROFILE_MAP[draft.company];
  const allowTraits = profile?.allowTraits;

  const cleanUnit = {
    id: state.editor.editingUnitId || generateId(),
    name: draft.name.trim() || profile.name,
    company: draft.company,
    racial: allowTraits ? (draft.racial || '') : '',
    traits: allowTraits ? draft.traits.filter(Boolean) : [],
    relic: '',
    icon: draft.icon && UNIT_ICON_MAP[draft.icon] ? draft.icon : '',
    spells: {},
    attachedTo: '',
    notes: (draft.notes || '').trim(),
    horde: draft.company === 'Irregular company' && (parseInt(draft.bases, 10) === 6 || parseInt(draft.bases, 10) === 8) ? Boolean(draft.horde) : false,
    bases: Math.max(0, parseInt(draft.bases, 10) || 0)
  };

  // Preserve relic only if unit is a character / character-company
  const tempCalc = computeUnit({ ...cleanUnit, relic: draft.relic });
  if (tempCalc.charInfo.isCharacter && draft.relic) {
    const relicObj = RELIC_MAP[draft.relic];
    if (!relicObj?.mageOnly || tempCalc.charInfo.isMage) {
      cleanUnit.relic = draft.relic;
    }
  }

  // Preserve spells only if unit is a mage
  if (tempCalc.charInfo.isMage && draft.spells) {
    for (const [sid, lvl] of Object.entries(draft.spells)) {
      const n = parseInt(lvl, 10) || 0;
      if (n > 0 && SPELL_MAP[sid]) cleanUnit.spells[sid] = Math.min(3, n);
    }
  }

  // Preserve attachment only for standalone characters
  if (tempCalc.charInfo.isStandaloneCharacter && draft.attachedTo) {
    cleanUnit.attachedTo = draft.attachedTo;
  }

  pushUndoSnapshot();

  if (state.editor.editingUnitId) {
    const idx = army.units.findIndex(u => u.id === state.editor.editingUnitId);
    if (idx >= 0) army.units[idx] = cleanUnit;
    showToast(`Updated "${cleanUnit.name}"`);
  } else {
    army.units.push(cleanUnit);
    showToast(`Added "${cleanUnit.name}"`);
  }

  saveState();
  renderAll();

  if (addAnother) {
    openUnitEditor(null);
  } else {
    closeOverlay('unitDrawerOverlay');
    state.editor.open = false;
  }
}

// ============================================================================
// Modals: Templates, Compendium, Rule Detail, Print, Share
// ============================================================================

function openOverlay(id) {
  const el = document.getElementById(id);
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.overlay.open')) {
    document.body.classList.remove('modal-open');
  }
}

function renderSavedArmiesModal() {
  const cur = getCurrentArmy();
  if (!cur) return;
  const curSummary = computeArmy(cur);
  const limitTxt = curSummary.pointsLimit > 0 ? ` / ${curSummary.pointsLimit}` : '';
  document.getElementById('saveBoxSummary').textContent =
    `${curSummary.totalPoints}${limitTxt} pts · ${curSummary.startingCompanies} cos · BP ${curSummary.breakPoint}`;

  document.getElementById('savedArmiesCount').textContent = `(${state.armies.length})`;

  const grid = document.getElementById('savedArmiesGrid');
  grid.innerHTML = state.armies.map(a => {
    const sum = computeArmy(a);
    const isCur = a.id === cur.id;
    const ptsLabel = sum.pointsLimit > 0 ? `${sum.totalPoints}/${sum.pointsLimit} pts` : `${sum.totalPoints} pts`;
    return `
      <div class="template-card ${isCur ? 'is-current-army' : ''}">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
            <h3>${escapeHtml(a.name || 'Untitled Army')}</h3>
            ${isCur ? '<span class="unit-profile-badge badge-custom" style="font-size:10px; flex-shrink:0;">Active</span>' : ''}
          </div>
          ${a.tagline ? `<p>${escapeHtml(a.tagline)}</p>` : `<p style="color:var(--text-muted);">${a.units.length} units in catalog · ${formatSavedTime(a.updatedAt)}</p>`}
        </div>
        <div>
          <div class="template-meta">
            <span>${ptsLabel}</span>
            <span>${sum.startingCompanies} cos</span>
            <span>BP ${sum.breakPoint}</span>
          </div>
          <div class="template-card-actions">
            <button type="button" class="btn btn-sm ${isCur ? '' : 'btn-primary'}" style="flex:1;" data-action="open-saved-army" data-army-id="${escapeHtml(a.id)}" ${isCur ? 'disabled' : ''}>
              ${isCur ? 'Currently Open' : 'Open'}
            </button>
            <button type="button" class="btn btn-sm" data-action="dup-saved-army" data-army-id="${escapeHtml(a.id)}" title="Duplicate saved army">Copy</button>
            <button type="button" class="btn btn-sm btn-danger-ghost" data-action="del-saved-army" data-army-id="${escapeHtml(a.id)}" ${state.armies.length <= 1 ? 'disabled' : ''} title="Delete saved army">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openSavedArmiesModal() {
  const cur = getCurrentArmy();
  if (!cur) return;
  document.getElementById('saveArmyNameInput').value = cur.name || '';
  document.getElementById('saveArmyTaglineInput').value = cur.tagline || '';
  renderSavedArmiesModal();
  openOverlay('savedArmiesModalOverlay');
  setTimeout(() => document.getElementById('saveArmyNameInput').focus(), 50);
}

function renderTemplatesGrid() {
  const allPresets = getAllPresets();
  const customCount = state.customPresets.length;
  const fantasyCount = PRESET_ARMIES.filter(p => (p.category || 'fantasy') === 'fantasy').length;
  const historicalCount = PRESET_ARMIES.filter(p => p.category === 'historical').length;

  document.getElementById('tplCountAll').textContent = `(${allPresets.length})`;
  document.getElementById('tplCountCustom').textContent = `(${customCount})`;
  document.getElementById('tplCountFantasy').textContent = `(${fantasyCount})`;
  document.getElementById('tplCountHistorical').textContent = `(${historicalCount})`;

  document.querySelectorAll('#templatesTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.templateTab === state.templateTab);
  });

  const q = state.templateSearch.trim().toLowerCase();
  const filtered = allPresets.filter(p => {
    const cat = p.category || 'fantasy';
    if (state.templateTab !== 'all' && cat !== state.templateTab) return false;
    if (!q) return true;
    const hay = [
      p.name,
      p.tagline || '',
      p.defaultRacial || '',
      ...p.units.map(u => u.name)
    ].join(' ').toLowerCase();
    return hay.includes(q);
  });

  const grid = document.getElementById('templatesGrid');
  if (filtered.length === 0) {
    const msg = state.templateTab === 'custom' && customCount === 0
      ? 'No custom presets saved yet. Click "Save Army" in the top bar and choose "Save to Faction Presets" to add your own rosters here!'
      : `No faction presets match "${escapeHtml(state.templateSearch)}".`;
    grid.innerHTML = `<div style="grid-column:1/-1; padding:24px; text-align:center; color:var(--text-muted);">${msg}</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const charCount = p.units.filter(u => PROFILE_MAP[u.company]?.category === 'character').length;
    const compCount = p.units.length - charCount;
    const isCustom = p.category === 'custom';
    const isHist = p.category === 'historical';
    const badgeLabel = isCustom ? 'Custom' : (isHist ? 'Historical' : 'Fantasy');
    const badgeCls = isCustom ? 'unit-profile-badge badge-custom' : 'unit-profile-badge';
    return `
      <div class="template-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
            <h3>${escapeHtml(p.name)}</h3>
            <span class="${badgeCls}" style="font-size:10px; flex-shrink:0;">${badgeLabel}</span>
          </div>
          <p>${escapeHtml(p.tagline || 'Custom saved army roster')}</p>
        </div>
        <div>
          <div class="template-meta">
            <span>${charCount} chars</span>
            <span>${compCount} companies</span>
            ${p.defaultRacial ? `<span>Racial: ${escapeHtml(p.defaultRacial)}</span>` : ''}
          </div>
          <div class="template-card-actions">
            <button type="button" class="btn btn-sm btn-primary" style="flex:1;" data-action="load-preset" data-preset-id="${escapeHtml(p.id)}">
              Load ${escapeHtml(p.name)}
            </button>
            ${isCustom ? `<button type="button" class="btn btn-sm btn-danger-ghost" data-action="del-custom-preset" data-preset-id="${escapeHtml(p.id)}" title="Delete custom preset">Delete</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openTemplatesModal() {
  renderTemplatesGrid();
  openOverlay('templatesModalOverlay');
  setTimeout(() => document.getElementById('templatesSearch').focus(), 50);
}

function openCompendiumModal() {
  renderCompendium();
  openOverlay('compendiumModalOverlay');
  setTimeout(() => document.getElementById('compendiumSearch').focus(), 50);
}

function renderCompendium() {
  const tab = state.compendiumTab;
  const q = state.compendiumSearch.trim().toLowerCase();

  document.querySelectorAll('#compendiumTabs .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  const box = document.getElementById('compendiumContent');
  let html = '';

  if (tab === 'traits') {
    const items = TRAITS.filter(t => !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    const hordeMatches = !q || HORDE_RULE.name.toLowerCase().includes(q) || HORDE_RULE.description.toLowerCase().includes(q) || 'formation'.includes(q);
    const hordeCardHtml = hordeMatches ? `
      <div class="ref-card ref-card-horde">
        <div class="ref-card-head">
          <span class="ref-card-title">${escapeHtml(HORDE_RULE.name)} <span style="font-family:var(--font-mono); font-size:11.5px; color:var(--accent); font-weight:600;">(Formation · Irregular 6 or 8 bases)</span></span>
          <span class="ref-card-cost">Free</span>
        </div>
        <div class="ref-card-body">${escapeHtml(HORDE_RULE.description)}</div>
      </div>
    ` : '';
    html = hordeCardHtml + items.map(t => {
      const mods = formatTraitModsShort(t);
      const incompat = Array.from(INCOMPATIBILITY_MAP[t.id] || []);
      return `
        <div class="ref-card">
          <div class="ref-card-head">
            <span class="ref-card-title">${escapeHtml(t.name)}${mods ? ` <span style="font-family:var(--font-mono); font-size:12px; color:var(--accent); font-weight:600;">(${escapeHtml(mods)})</span>` : ''}</span>
            <span class="ref-card-cost">${formatCostDelta(t.cost)} pts</span>
          </div>
          <div class="ref-card-body">${escapeHtml(t.description)}</div>
          ${incompat.length > 0 ? `<div class="ref-card-incompat"><strong>Incompatible with:</strong> ${escapeHtml(incompat.join(', '))}</div>` : ''}
        </div>
      `;
    }).join('');
  } else if (tab === 'profiles') {
    const items = BASE_PROFILES.filter(p => !q || p.name.toLowerCase().includes(q) || p.limitNote.toLowerCase().includes(q));
    html = items.map(p => `
      <div class="ref-card">
        <div class="ref-card-head">
          <span class="ref-card-title">${escapeHtml(p.name)} <span style="font-size:11.5px; color:var(--text-muted); font-weight:500;">(${p.category === 'character' ? 'Standalone Character' : 'Company'})</span></span>
          <span class="ref-card-cost">${p.cost} pts</span>
        </div>
        <div class="ref-card-body">
          <div style="font-family:var(--font-mono); font-size:12px; margin-bottom:4px; color:var(--text-primary);">
            Res: <strong>${p.res}</strong> &middot; Mov: <strong>${p.mov}</strong> &middot; Mel: <strong>${p.mel}</strong> &middot; Sht: <strong>${formatShooting(p.shtShort, p.shtLong)}</strong> &middot; Def: <strong>${formatDefence(p.def)}</strong> &middot; Com: <strong>${p.com || '—'}</strong>
          </div>
          <div>${escapeHtml(p.limitNote)}</div>
        </div>
      </div>
    `).join('');
  } else if (tab === 'relics') {
    const items = RELICS.filter(r => !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    html = items.map(r => `
      <div class="ref-card">
        <div class="ref-card-head">
          <span class="ref-card-title">${escapeHtml(r.name)}${r.mageOnly ? ' <span style="font-size:11px; color:var(--character-text);">[Mage-lord / Magic-user only]</span>' : ''}</span>
          <span class="ref-card-cost">+${r.cost} pts</span>
        </div>
        <div class="ref-card-body">${escapeHtml(r.description)}</div>
      </div>
    `).join('');
  } else if (tab === 'strategies') {
    const items = STRATEGIES.filter(s => !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
    html = items.map(s => `
      <div class="ref-card">
        <div class="ref-card-head">
          <span class="ref-card-title">${escapeHtml(s.name)}</span>
          <span class="ref-card-cost">${s.cost} pts</span>
        </div>
        <div class="ref-card-body">${escapeHtml(s.description)}</div>
      </div>
    `).join('');
  } else if (tab === 'spells') {
    const items = SPELLS.filter(sp => !q || sp.name.toLowerCase().includes(q) || sp.description.toLowerCase().includes(q));
    html = items.map(sp => `
      <div class="ref-card">
        <div class="ref-card-head">
          <span class="ref-card-title">${escapeHtml(sp.name)} <span style="font-size:11.5px; color:var(--text-muted); font-weight:500;">(Range: ${escapeHtml(sp.range)})</span></span>
          <span class="ref-card-cost">${escapeHtml(sp.difficulty)}</span>
        </div>
        <div class="ref-card-body">${escapeHtml(sp.description)}</div>
      </div>
    `).join('');
  }

  box.innerHTML = html || `<div style="padding:24px; text-align:center; color:var(--text-muted);">No rules match "${escapeHtml(state.compendiumSearch)}".</div>`;
}

function openRuleDetail(type, id) {
  const titleEl = document.getElementById('ruleModalTitle');
  const bodyEl = document.getElementById('ruleModalBody');

  if (type === 'horde') {
    titleEl.textContent = `${HORDE_RULE.name} (Formation Trait)`;
    bodyEl.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
        <span class="rule-pill pill-horde"><span class="pill-tag">Trait</span><span>Horde</span></span>
        <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent);">Free · Irregular Company (6 or 8 bases)</span>
      </div>
      <p style="margin:0; line-height:1.6;">${escapeHtml(HORDE_RULE.description)}</p>
    `;
    openOverlay('ruleModalOverlay');
  } else if (type === 'trait' && TRAIT_MAP[id]) {
    const t = TRAIT_MAP[id];
    const mods = formatTraitModsShort(t);
    const incompat = Array.from(INCOMPATIBILITY_MAP[t.id] || []);
    titleEl.textContent = t.name;
    bodyEl.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
        <span class="unit-profile-badge">Trait</span>
        <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent);">${formatCostDelta(t.cost)} pts</span>
        ${mods ? `<span style="font-family:var(--font-mono); font-size:12.5px;">${escapeHtml(mods)}</span>` : ''}
      </div>
      <p style="margin:0; line-height:1.6;">${escapeHtml(t.description)}</p>
      ${incompat.length > 0 ? `<div class="alert-item error" style="margin:0;"><span><strong>Incompatible with:</strong> ${escapeHtml(incompat.join(', '))}</span></div>` : ''}
    `;
    openOverlay('ruleModalOverlay');
  } else if (type === 'relic' && RELIC_MAP[id]) {
    const r = RELIC_MAP[id];
    titleEl.textContent = r.name;
    bodyEl.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
        <span class="rule-pill pill-relic">Relic</span>
        <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent);">+${r.cost} pts</span>
        ${r.mageOnly ? `<span class="unit-profile-badge is-char">Mage-lord / Magic-user only</span>` : ''}
      </div>
      <p style="margin:0; line-height:1.6;">${escapeHtml(r.description)}</p>
    `;
    openOverlay('ruleModalOverlay');
  } else if (type === 'spell' && SPELL_MAP[id]) {
    const sp = SPELL_MAP[id];
    titleEl.textContent = sp.name;
    bodyEl.innerHTML = `
      <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
        <span class="rule-pill pill-spell">Spell</span>
        <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent);">Cast: ${escapeHtml(sp.difficulty)}</span>
        <span style="font-family:var(--font-mono); font-size:12.5px;">Range: ${escapeHtml(sp.range)}</span>
      </div>
      <p style="margin:0; line-height:1.6;">${escapeHtml(sp.description)}</p>
    `;
    openOverlay('ruleModalOverlay');
  }
}

function buildPrintSheetHtml(army, includeAppendix, includeZeroBases) {
  const summary = computeArmy(army);
  const rows = summary.computedUnits.filter(x => includeZeroBases || x.calc.bases > 0);

  const usedTraits = new Set();
  const usedRelics = new Set();
  const usedSpells = new Set();
  const unitById = Object.fromEntries((army.units || []).map(u => [u.id, u]));

  let hasAnyHorde = false;
  for (const { calc } of rows) {
    for (const tid of calc.traits) usedTraits.add(tid);
    if (calc.isHorde) hasAnyHorde = true;
    if (calc.relic) usedRelics.add(calc.relic.id);
    for (const sp of calc.spells || []) usedSpells.add(sp.id);
  }

  const stratHtml = summary.strategies.length > 0
    ? `<div class="ps-strategies"><strong>Strategies:</strong> ${summary.strategies.map(s => `${escapeHtml(s.name)} (${s.cost} pts)`).join(' &middot; ')}</div>`
    : '';

  const tableRowsHtml = rows.length > 0
    ? rows.map(({ unit, calc }) => {
        const extras = [];
        const traitNames = [...calc.traits];
        if (calc.isHorde) traitNames.push(`Horde (${calc.hordeFormation})`);
        if (traitNames.length > 0) extras.push(traitNames.join(', '));
        if (calc.relic) extras.push(`Relic: ${calc.relic.name}`);
        if (calc.spells?.length > 0) extras.push(`Spells: ${calc.spells.map(s => `${s.id} L${s.level}`).join(', ')}`);
        if (unit.attachedTo && unitById[unit.attachedTo]) extras.push(`Attached → ${unitById[unit.attachedTo].name}`);
        if (unit.notes) extras.push(`Note: ${unit.notes}`);
        return `
          <tr>
            <td class="left"><strong>${escapeHtml(unit.name || calc.profile.name)}</strong><br/><span style="font-size:10.5px; color:#555;">${escapeHtml(calc.profile.name)}</span></td>
            <td class="mono">${calc.res}</td>
            <td class="mono">${calc.mov}</td>
            <td class="mono">${calc.mel}</td>
            <td class="mono">${formatShooting(calc.shtShort, calc.shtLong)}</td>
            <td class="mono">${formatDefence(calc.def)}</td>
            <td class="mono">${calc.com || '—'}</td>
            <td class="left" style="font-size:11px;">${escapeHtml(extras.join(' | ') || '—')}</td>
            <td class="mono">${calc.cost}</td>
            <td class="mono">${calc.bases}</td>
            <td class="mono"><strong>${calc.totalCost}</strong></td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="11" style="padding:18px; color:#666;">No active units with # Bases &gt; 0. Check "Include 0-base units" or add bases to your roster.</td></tr>`;

  let appendixHtml = '';
  if (includeAppendix && (usedTraits.size > 0 || hasAnyHorde || usedRelics.size > 0 || usedSpells.size > 0 || summary.strategies.length > 0)) {
    const entries = [];
    if (hasAnyHorde) {
      entries.push(`<div class="ps-rule-entry"><strong>[Formation Trait] ${escapeHtml(HORDE_RULE.name)}:</strong> ${escapeHtml(HORDE_RULE.description)}</div>`);
    }
    for (const s of summary.strategies) {
      entries.push(`<div class="ps-rule-entry"><strong>[Strategy] ${escapeHtml(s.name)}:</strong> ${escapeHtml(s.description)}</div>`);
    }
    for (const rid of Array.from(usedRelics).sort()) {
      const r = RELIC_MAP[rid];
      entries.push(`<div class="ps-rule-entry"><strong>[Relic] ${escapeHtml(r.name)}:</strong> ${escapeHtml(r.description)}</div>`);
    }
    for (const spid of Array.from(usedSpells).sort()) {
      const sp = SPELL_MAP[spid];
      entries.push(`<div class="ps-rule-entry"><strong>[Spell] ${escapeHtml(sp.name)} (${escapeHtml(sp.difficulty)}, ${escapeHtml(sp.range)}):</strong> ${escapeHtml(sp.description)}</div>`);
    }
    for (const tid of Array.from(usedTraits).sort()) {
      const t = TRAIT_MAP[tid];
      entries.push(`<div class="ps-rule-entry"><strong>${escapeHtml(t.name)}:</strong> ${escapeHtml(t.description)}</div>`);
    }
    appendixHtml = `
      <div class="ps-rules-appendix">
        <h4>Quick-Reference Rules Appendix</h4>
        <div class="ps-rules-grid">${entries.join('')}</div>
      </div>
    `;
  }

  return `
    <div class="ps-header">
      <div>
        <div class="ps-subtitle">Fantastic Battles — Battle Roster</div>
        <h3 class="ps-title">${escapeHtml(army.name || 'Untitled Army')}</h3>
      </div>
      <div class="ps-stats">
        <div><strong>${summary.totalPoints} pts</strong>${summary.pointsLimit > 0 ? ` / ${summary.pointsLimit}` : ''}</div>
        <div>Companies: ${summary.startingCompanies} &middot; Break Point: <strong>${summary.breakPoint}</strong></div>
      </div>
    </div>
    ${stratHtml}
    <table class="ps-table">
      <thead>
        <tr>
          <th class="left">Unit</th>
          <th>Res</th>
          <th>Mov</th>
          <th>Mel</th>
          <th>Sht</th>
          <th>Def</th>
          <th>Com</th>
          <th class="left">Traits &amp; Relics</th>
          <th>Cost</th>
          <th>Bases</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>${tableRowsHtml}</tbody>
    </table>
    ${appendixHtml}
    <div class="ps-footer">
      <span>Generated by Fantastic Battles Online Army Builder</span>
      <span>Unofficial fan-made companion for Fantastic Battles (Nic Wright / irregularwars.com)</span>
    </div>
  `;
}

function renderPrintPreview() {
  const army = getCurrentArmy();
  if (!army) return;
  const incApp = document.getElementById('chkPrintAppendix').checked;
  const incZero = document.getElementById('chkPrintZeroBases').checked;
  const isCards = state.printMode === 'cards';

  document.getElementById('printModeTable').classList.toggle('active', !isCards);
  document.getElementById('printModeCards').classList.toggle('active', isCards);
  document.getElementById('lblPrintAppendix').style.display = isCards ? 'none' : 'inline-flex';

  const html = isCards
    ? buildPrintCardsHtml(army, incZero)
    : buildPrintSheetHtml(army, incApp, incZero);

  document.getElementById('printPreviewBox').innerHTML = html;
  document.getElementById('printSheet').innerHTML = html;
}

function openPregameModal() {
  const army = getCurrentArmy();
  if (!army) return;
  document.getElementById('pregameModalBody').innerHTML = renderPregameModalHtml(army);
  openOverlay('pregameModalOverlay');
}

function getComparableArmies() {
  const list = state.armies.map(a => ({
    key: `army:${a.id}`,
    group: 'Saved Armies',
    army: a
  }));
  for (const p of state.customPresets) {
    list.push({
      key: `preset:${p.id}`,
      group: 'My Custom Presets',
      army: {
        id: p.id,
        name: `${p.name} (Preset)`,
        bannerColor: p.bannerColor || 'gold',
        pointsLimit: typeof p.pointsLimit === 'number' ? p.pointsLimit : 500,
        strategies: p.strategies || [],
        units: (p.units || []).map((u, idx) => ({ ...u, id: `${p.id}_u${idx}` }))
      }
    });
  }
  return list;
}

function renderCompareModal() {
  const items = getComparableArmies();
  const selA = document.getElementById('compareSelectA');
  const selB = document.getElementById('compareSelectB');

  const buildOptions = selectedKey => {
    const saved = items.filter(x => x.group === 'Saved Armies');
    const presets = items.filter(x => x.group === 'My Custom Presets');
    const optHtml = x => {
      const pts = computeArmy(x.army).totalPoints;
      return `<option value="${escapeHtml(x.key)}" ${x.key === selectedKey ? 'selected' : ''}>${escapeHtml(x.army.name || 'Untitled')} (${pts} pts)</option>`;
    };
    let html = `<optgroup label="Saved Armies">${saved.map(optHtml).join('')}</optgroup>`;
    if (presets.length > 0) {
      html += `<optgroup label="My Custom Presets">${presets.map(optHtml).join('')}</optgroup>`;
    }
    return html;
  };

  if (!items.some(x => x.key === state.compare.idA)) {
    state.compare.idA = items[0]?.key || null;
  }
  if (!items.some(x => x.key === state.compare.idB)) {
    const alt = items.find(x => x.key !== state.compare.idA && computeArmy(x.army).totalPoints > 0)
      || items.find(x => x.key !== state.compare.idA)
      || items[0];
    state.compare.idB = alt?.key || null;
  }

  selA.innerHTML = buildOptions(state.compare.idA);
  selB.innerHTML = buildOptions(state.compare.idB);

  const entryA = items.find(x => x.key === state.compare.idA);
  const entryB = items.find(x => x.key === state.compare.idB);
  const sameHintHtml = (entryA && entryB && entryA.key === entryB.key)
    ? `<div class="cmp-same-hint">
        <span>${items.length <= 1
          ? 'Tip: Load a second faction preset or save another army to compare a real matchup.'
          : 'Tip: Both sides are set to the same army — choose a different opponent in Army B above.'}</span>
        ${items.length <= 1 ? '<button type="button" class="btn btn-sm btn-primary" data-action="compare-open-presets">Browse Faction Presets</button>' : ''}
      </div>`
    : '';
  document.getElementById('compareContent').innerHTML = sameHintHtml + renderComparisonHtml(entryA?.army, entryB?.army);
}

function openCompareModal() {
  const cur = getCurrentArmy();
  if (cur) state.compare.idA = `army:${cur.id}`;
  if (state.compare.idB === state.compare.idA) {
    state.compare.idB = null;
  }
  renderCompareModal();
  openOverlay('compareModalOverlay');
}

function openPrintModal() {
  renderPrintPreview();
  openOverlay('printModalOverlay');
}

function openShareModal() {
  const army = getCurrentArmy();
  if (!army) return;
  const baseUrl = window.location.href.split('#')[0];
  const shareHash = encodeArmyToShareHash(army);
  document.getElementById('shareUrlInput').value = baseUrl + shareHash;
  document.getElementById('exportTextArea').value = exportArmyText(army);
  openOverlay('shareModalOverlay');
}

async function copyToClipboard(text, successMsg) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast(successMsg);
  }
}

// ============================================================================
// Event Binding
// ============================================================================

function bindEvents() {
  // Theme toggle
  document.getElementById('btnTheme').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Saved army switcher
  document.getElementById('armySelect').addEventListener('change', e => {
    state.currentArmyId = e.target.value;
    state.searchQuery = '';
    document.getElementById('rosterSearch').value = '';
    saveState();
    renderAll();
  });

  document.getElementById('btnNewArmy').addEventListener('click', () => {
    const army = createBlankArmy(`New Army ${state.armies.length + 1}`);
    state.armies.unshift(army);
    state.currentArmyId = army.id;
    state.filterMode = 'all';
    saveState();
    renderAll();
    showToast('Created new blank army');
  });

  document.getElementById('btnDeleteArmy').addEventListener('click', () => {
    if (state.armies.length <= 1) return;
    const army = getCurrentArmy();
    if (!confirm(`Delete "${army.name}"? This cannot be undone.`)) return;
    state.armies = state.armies.filter(a => a.id !== army.id);
    state.currentArmyId = state.armies[0].id;
    saveState();
    renderAll();
    showToast(`Deleted "${army.name}"`);
  });

  // Topbar modals
  document.getElementById('btnSaveArmy').addEventListener('click', openSavedArmiesModal);
  document.getElementById('btnTemplates').addEventListener('click', openTemplatesModal);
  document.getElementById('btnCompare').addEventListener('click', openCompareModal);
  document.getElementById('btnCompendium').addEventListener('click', openCompendiumModal);
  document.getElementById('btnPrint').addEventListener('click', openPrintModal);
  document.getElementById('btnShare').addEventListener('click', openShareModal);

  // Command bar inputs
  document.getElementById('armyNameInput').addEventListener('input', e => {
    const army = getCurrentArmy();
    if (!army) return;
    army.name = e.target.value;
    saveState();
    renderTopBar(army);
  });

  document.getElementById('pointsLimitSelect').addEventListener('change', e => {
    const army = getCurrentArmy();
    if (!army) return;
    const val = e.target.value;
    if (val === 'custom') {
      const customInput = document.getElementById('customPointsInput');
      customInput.style.display = 'inline-block';
      customInput.value = army.pointsLimit || 600;
      army.pointsLimit = parseInt(customInput.value, 10) || 600;
      customInput.focus();
    } else {
      army.pointsLimit = parseInt(val, 10) || 0;
    }
    saveState();
    renderAll();
  });

  document.getElementById('customPointsInput').addEventListener('input', e => {
    const army = getCurrentArmy();
    if (!army) return;
    army.pointsLimit = Math.max(0, parseInt(e.target.value, 10) || 0);
    saveState();
    renderAll();
  });

  document.getElementById('defaultRacialSelect').addEventListener('change', e => {
    const army = getCurrentArmy();
    if (!army) return;
    pushUndoSnapshot();
    army.defaultRacial = e.target.value;
    saveState();
    showToast(army.defaultRacial ? `Default racial trait set to ${army.defaultRacial}` : 'Default racial trait cleared');
  });

  // Roster Toolbar: Build / Battle Mode, Undo/Redo, Pre-Game, Filters
  document.getElementById('modeBuild').addEventListener('click', () => {
    state.viewMode = 'build';
    state.mobileTab = 'roster';
    renderAll();
  });

  document.getElementById('modeBattle').addEventListener('click', () => {
    state.viewMode = 'battle';
    state.mobileTab = 'battle';
    renderAll();
  });

  // Mobile Collapsible Options Toggle
  const mobileOptBtn = document.getElementById('btnMobileCommandToggle');
  if (mobileOptBtn) {
    mobileOptBtn.addEventListener('click', () => {
      state.mobileOptionsOpen = !state.mobileOptionsOpen;
      renderAll();
    });
  }

  // Tappable Army Status Badge -> Jump to Breakdown / Validation Alerts
  const statusBadgeEl = document.getElementById('armyStatusBadge');
  if (statusBadgeEl) {
    const jumpToBreakdown = () => {
      if (window.innerWidth <= 768) {
        state.mobileTab = 'tactics';
        renderAll();
      }
      setTimeout(() => {
        const target = document.querySelector('#validationAlerts .alert') || document.getElementById('breakdownContent');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const panel = target.closest('.panel');
          if (panel) {
            panel.classList.add('panel-flash');
            setTimeout(() => panel.classList.remove('panel-flash'), 900);
          }
        }
      }, 40);
    };
    statusBadgeEl.addEventListener('click', jumpToBreakdown);
    statusBadgeEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        jumpToBreakdown();
      }
    });
  }

  // Mobile Bottom Navigation Bar
  const mobileNav = document.getElementById('mobileBottomNav');
  if (mobileNav) {
    mobileNav.addEventListener('click', e => {
      const btn = e.target.closest('.mobile-nav-btn[data-mobile-tab]');
      if (!btn) return;
      const tab = btn.dataset.mobileTab;
      if (tab === 'roster') {
        state.viewMode = 'build';
        state.mobileTab = 'roster';
        renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'battle') {
        state.viewMode = 'battle';
        state.mobileTab = 'battle';
        renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'tactics') {
        state.mobileTab = 'tactics';
        renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'presets') {
        document.getElementById('btnTemplates').click();
      } else if (tab === 'more') {
        openOverlay('mobileMoreOverlay');
      }
    });
  }

  // Mobile More Actions Bottom Sheet
  const mobileMoreGrid = document.getElementById('mobileMoreGrid');
  if (mobileMoreGrid) {
    mobileMoreGrid.addEventListener('click', e => {
      const btn = e.target.closest('button[data-more-action]');
      if (!btn || btn.disabled) return;
      const action = btn.dataset.moreAction;
      closeOverlay('mobileMoreOverlay');
      if (action === 'save') document.getElementById('btnSaveArmy').click();
      else if (action === 'compare') document.getElementById('btnCompare').click();
      else if (action === 'rules') document.getElementById('btnCompendium').click();
      else if (action === 'print') document.getElementById('btnPrint').click();
      else if (action === 'share') document.getElementById('btnShare').click();
      else if (action === 'pregame') document.getElementById('btnPregame').click();
      else if (action === 'new-army') document.getElementById('btnNewArmy').click();
      else if (action === 'clear-bases') document.getElementById('btnResetBases').click();
      else if (action === 'delete-army') document.getElementById('btnDeleteArmy').click();
    });
  }

  document.getElementById('btnUndo').addEventListener('click', performUndo);
  document.getElementById('btnRedo').addEventListener('click', performRedo);
  document.getElementById('btnPregame').addEventListener('click', openPregameModal);

  document.getElementById('filterAll').addEventListener('click', () => {
    state.filterMode = 'all';
    renderAll();
  });

  document.getElementById('filterActive').addEventListener('click', () => {
    state.filterMode = 'active';
    renderAll();
  });

  document.getElementById('rosterSearch').addEventListener('input', e => {
    state.searchQuery = e.target.value;
    renderAll();
  });

  document.getElementById('btnResetBases').addEventListener('click', () => {
    const army = getCurrentArmy();
    if (!army) return;
    const anyActive = army.units.some(u => (u.bases || 0) > 0);
    if (!anyActive) return;
    pushUndoSnapshot();
    for (const u of army.units) u.bases = 0;
    saveState();
    renderAll();
    showToast('Reset all base counts to 0');
  });

  document.getElementById('btnAddUnit').addEventListener('click', () => openUnitEditor(null));

  // Delegated clicks on Roster & Battle Mode
  const rosterEl = document.getElementById('rosterContainer');
  rosterEl.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const army = getCurrentArmy();
    if (!army) return;

    if (btn.dataset.ruleType) {
      openRuleDetail(btn.dataset.ruleType, btn.dataset.ruleId);
      return;
    }

    if (btn.dataset.battleAction) {
      if (btn.dataset.battleAction === 'open-pregame') {
        openPregameModal();
        return;
      }
      if (handleBattleAction(army, btn)) {
        renderAll();
      }
      return;
    }

    const action = btn.dataset.action;
    const uid = btn.dataset.unitId;

    if (action === 'exit-battle-mode') {
      state.viewMode = 'build';
      renderAll();
    } else if (action === 'open-add-unit') {
      openUnitEditor(null);
    } else if (action === 'open-templates') {
      openTemplatesModal();
    } else if (action === 'show-all-units') {
      state.filterMode = 'all';
      renderAll();
    } else if (action === 'clear-search') {
      state.searchQuery = '';
      document.getElementById('rosterSearch').value = '';
      renderAll();
    } else if (action === 'inc-bases') {
      const u = army.units.find(x => x.id === uid);
      if (u) {
        pushUndoSnapshot();
        u.bases = (u.bases || 0) + 1;
        if (u.company !== 'Irregular company' || (u.bases !== 6 && u.bases !== 8)) {
          u.horde = false;
        }
        saveState();
        renderAll();
      }
    } else if (action === 'dec-bases') {
      const u = army.units.find(x => x.id === uid);
      if (u && (u.bases || 0) > 0) {
        pushUndoSnapshot();
        u.bases -= 1;
        if (u.company !== 'Irregular company' || (u.bases !== 6 && u.bases !== 8)) {
          u.horde = false;
        }
        saveState();
        renderAll();
      }
    } else if (action === 'toggle-horde') {
      const u = army.units.find(x => x.id === uid);
      if (u && u.company === 'Irregular company' && (u.bases === 6 || u.bases === 8)) {
        pushUndoSnapshot();
        u.horde = !u.horde;
        saveState();
        renderAll();
        const form = u.bases === 8 ? '4×2' : '3×2';
        showToast(u.horde ? `Formed Horde (${form}) — +1 front Mel/Charge & +1 Sht` : 'Disbanded Horde formation');
      }
    } else if (action === 'move-unit-up' || action === 'move-unit-down') {
      const dir = action === 'move-unit-up' ? -1 : 1;
      const summary = computeArmy(army);
      const q = state.searchQuery.trim().toLowerCase();
      const visible = summary.computedUnits.filter(({ unit, calc }) => {
        if (state.filterMode === 'active' && calc.bases <= 0) return false;
        if (!q) return true;
        const hay = [unit.name, unit.company, unit.racial, ...(unit.traits || []), unit.relic].join(' ').toLowerCase();
        return hay.includes(q);
      });
      const currentItem = visible.find(x => x.unit.id === uid);
      if (!currentItem) return;
      const isChar = currentItem.calc.charInfo.isStandaloneCharacter;
      const section = visible.filter(x => x.calc.charInfo.isStandaloneCharacter === isChar);
      const pos = section.findIndex(x => x.unit.id === uid);
      const targetPos = pos + dir;
      if (pos < 0 || targetPos < 0 || targetPos >= section.length) return;

      const targetId = section[targetPos].unit.id;
      const idxA = army.units.findIndex(x => x.id === uid);
      const idxB = army.units.findIndex(x => x.id === targetId);
      if (idxA >= 0 && idxB >= 0) {
        pushUndoSnapshot();
        [army.units[idxA], army.units[idxB]] = [army.units[idxB], army.units[idxA]];
        saveState();
        renderAll();
      }
    } else if (action === 'edit-unit') {
      openUnitEditor(uid);
    } else if (action === 'dup-unit') {
      const idx = army.units.findIndex(x => x.id === uid);
      if (idx >= 0) {
        pushUndoSnapshot();
        const src = army.units[idx];
        const rawName = (src.name || src.company || 'Unit').trim();
        const baseName = rawName.replace(/\s+\d+$/, '') || rawName;
        const existingNames = new Set(
          army.units.map(u => (u.name || u.company || '').trim().toLowerCase())
        );
        let num = 2;
        while (existingNames.has(`${baseName} ${num}`.toLowerCase())) {
          num++;
        }
        const newName = `${baseName} ${num}`;

        // Insert after the last consecutive copy sharing the same base name
        let insertIdx = idx + 1;
        const baseLower = baseName.toLowerCase();
        while (insertIdx < army.units.length) {
          const nextName = (army.units[insertIdx].name || army.units[insertIdx].company || '').trim();
          const nextBase = nextName.replace(/\s+\d+$/, '').toLowerCase();
          if (nextBase === baseLower) insertIdx++;
          else break;
        }

        const copy = {
          ...src,
          id: generateId(),
          name: newName,
          traits: [...(src.traits || [])],
          spells: src.spells ? { ...src.spells } : {},
          notes: src.notes || ''
        };
        army.units.splice(insertIdx, 0, copy);
        saveState();
        renderAll();
        showToast(`Created "${newName}"`);
      }
    } else if (action === 'del-unit') {
      const u = army.units.find(x => x.id === uid);
      if (!u) return;
      pushUndoSnapshot();
      army.units = army.units.filter(x => x.id !== uid);
      for (const other of army.units) {
        if (other.attachedTo === uid) other.attachedTo = '';
      }
      saveState();
      renderAll();
      showToast(`Removed "${u.name}"`);
    }
  });

  // Drag-and-Drop Unit Reordering in Build Mode
  rosterEl.addEventListener('dragstart', e => {
    if (state.viewMode !== 'build') return;
    const card = e.target.closest('.unit-card[data-unit-id]');
    if (!card) return;
    state.dragUnitId = card.dataset.unitId;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', state.dragUnitId); } catch {}
  });

  rosterEl.addEventListener('dragover', e => {
    if (!state.dragUnitId || state.viewMode !== 'build') return;
    const card = e.target.closest('.unit-card[data-unit-id]');
    if (!card || card.dataset.unitId === state.dragUnitId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    card.classList.add('drag-over');
  });

  rosterEl.addEventListener('dragleave', e => {
    const card = e.target.closest('.unit-card[data-unit-id]');
    if (card) card.classList.remove('drag-over');
  });

  rosterEl.addEventListener('drop', e => {
    if (!state.dragUnitId || state.viewMode !== 'build') return;
    const card = e.target.closest('.unit-card[data-unit-id]');
    if (!card) return;
    e.preventDefault();
    card.classList.remove('drag-over');
    const targetId = card.dataset.unitId;
    const sourceId = state.dragUnitId;
    state.dragUnitId = null;
    if (!sourceId || !targetId || sourceId === targetId) return;

    const army = getCurrentArmy();
    if (!army) return;
    const fromIdx = army.units.findIndex(u => u.id === sourceId);
    const toIdx = army.units.findIndex(u => u.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    // Keep characters with characters and companies with companies
    const fromIsChar = PROFILE_MAP[army.units[fromIdx].company]?.category === 'character';
    const toIsChar = PROFILE_MAP[army.units[toIdx].company]?.category === 'character';
    if (fromIsChar !== toIsChar) return;

    pushUndoSnapshot();
    const [moved] = army.units.splice(fromIdx, 1);
    army.units.splice(toIdx, 0, moved);
    saveState();
    renderAll();
  });

  rosterEl.addEventListener('dragend', () => {
    state.dragUnitId = null;
    rosterEl.querySelectorAll('.dragging, .drag-over').forEach(el => {
      el.classList.remove('dragging', 'drag-over');
    });
  });

  // Strategies toggle
  document.getElementById('strategyList').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="toggle-strategy"]');
    if (!btn || btn.disabled) return;
    const army = getCurrentArmy();
    if (!army) return;
    const sid = btn.dataset.strategyId;
    pushUndoSnapshot();
    if (!Array.isArray(army.strategies)) army.strategies = [];
    if (army.strategies.includes(sid)) {
      army.strategies = army.strategies.filter(id => id !== sid);
    } else if (army.strategies.length < 3) {
      army.strategies.push(sid);
    }
    saveState();
    renderAll();
  });

  // Unit Editor Drawer events
  document.getElementById('btnCloseDrawer').addEventListener('click', () => closeOverlay('unitDrawerOverlay'));
  document.getElementById('btnCancelUnit').addEventListener('click', () => closeOverlay('unitDrawerOverlay'));
  document.getElementById('btnSaveUnit').addEventListener('click', () => commitUnitDraft(false));
  document.getElementById('btnSaveAndAddAnother').addEventListener('click', () => commitUnitDraft(true));

  document.getElementById('btnDeleteUnitInEditor').addEventListener('click', () => {
    const army = getCurrentArmy();
    const uid = state.editor.editingUnitId;
    if (!army || !uid) return;
    const target = army.units.find(x => x.id === uid);
    if (!target) return;
    pushUndoSnapshot();
    army.units = army.units.filter(x => x.id !== uid);
    for (const other of army.units) {
      if (other.attachedTo === uid) other.attachedTo = '';
    }
    state.editor.open = false;
    state.editor.draft = null;
    closeOverlay('unitDrawerOverlay');
    saveState();
    renderAll();
    showToast(`Deleted "${target.name || target.company}"`);
  });

  document.getElementById('editUnitName').addEventListener('input', e => {
    if (!state.editor.draft) return;
    state.editor.draft.name = e.target.value;
    renderEditor();
  });

  document.getElementById('editUnitBases').addEventListener('input', e => {
    if (!state.editor.draft) return;
    state.editor.draft.bases = Math.max(0, parseInt(e.target.value, 10) || 0);
    if (state.editor.draft.bases !== 6 && state.editor.draft.bases !== 8) {
      state.editor.draft.horde = false;
    }
    renderEditor();
  });

  document.getElementById('editorHordeBox').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="editor-toggle-horde"]');
    if (!btn || !state.editor.draft) return;
    state.editor.draft.horde = !state.editor.draft.horde;
    renderEditor();
  });

  document.getElementById('iconPickerStrip').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="pick-icon"]');
    if (!btn || !state.editor.draft) return;
    state.editor.draft.icon = btn.dataset.iconId || '';
    renderEditor();
  });

  document.getElementById('profilePicker').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="pick-profile"]');
    if (!btn || !state.editor.draft) return;
    state.editor.draft.company = btn.dataset.profileId;
    const prof = PROFILE_MAP[btn.dataset.profileId];
    if (prof && !prof.allowTraits) {
      state.editor.draft.racial = '';
      state.editor.draft.traits = ['', '', ''];
    }
    renderEditor();
  });

  document.getElementById('traitSlots').addEventListener('click', e => {
    const clearBtn = e.target.closest('button[data-action="clear-slot"]');
    if (clearBtn && state.editor.draft) {
      e.stopPropagation();
      const slot = parseInt(clearBtn.dataset.slot, 10);
      setDraftSlotValue(state.editor.draft, slot, '');
      state.editor.focusedSlot = slot;
      renderEditor();
      return;
    }
    const slotBox = e.target.closest('[data-action="focus-slot"]');
    if (slotBox) {
      state.editor.focusedSlot = parseInt(slotBox.dataset.slot, 10);
      renderEditor();
    }
  });

  document.getElementById('traitSearchInput').addEventListener('input', e => {
    state.editor.traitSearch = e.target.value;
    if (state.editor.draft) renderTraitPickerList(state.editor.draft);
  });

  document.getElementById('traitPickerList').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="pick-trait"]');
    if (!btn || btn.disabled || !state.editor.draft) return;
    const tid = btn.dataset.traitId;
    const slot = state.editor.focusedSlot;
    const current = getDraftSlotValue(state.editor.draft, slot);

    if (current === tid) {
      setDraftSlotValue(state.editor.draft, slot, '');
    } else {
      setDraftSlotValue(state.editor.draft, slot, tid);
      // Auto-advance to next empty slot for fast building
      for (let i = 0; i < 4; i++) {
        if (!getDraftSlotValue(state.editor.draft, i)) {
          state.editor.focusedSlot = i;
          break;
        }
      }
    }
    renderEditor();
  });

  document.getElementById('editUnitRelic').addEventListener('change', e => {
    if (!state.editor.draft) return;
    state.editor.draft.relic = e.target.value;
    renderEditor();
  });

  document.getElementById('spellPickerList').addEventListener('click', e => {
    const btn = e.target.closest('button[data-spell-id]');
    if (!btn || btn.disabled || !state.editor.draft) return;
    const sid = btn.dataset.spellId;
    if (!state.editor.draft.spells) state.editor.draft.spells = {};
    const curLvl = state.editor.draft.spells[sid] || 0;
    if (btn.dataset.action === 'inc-spell') {
      state.editor.draft.spells[sid] = Math.min(3, curLvl + 1);
    } else if (btn.dataset.action === 'dec-spell') {
      const next = Math.max(0, curLvl - 1);
      if (next === 0) delete state.editor.draft.spells[sid];
      else state.editor.draft.spells[sid] = next;
    }
    renderEditor();
  });

  document.getElementById('editUnitAttach').addEventListener('change', e => {
    if (!state.editor.draft) return;
    state.editor.draft.attachedTo = e.target.value;
  });

  document.getElementById('editUnitNotes').addEventListener('input', e => {
    if (!state.editor.draft) return;
    state.editor.draft.notes = e.target.value;
  });

  // Save & Saved Armies Modal
  document.getElementById('btnQuickSaveCurrent').addEventListener('click', () => {
    const cur = getCurrentArmy();
    if (!cur) return;
    const newName = document.getElementById('saveArmyNameInput').value.trim();
    const newTag = document.getElementById('saveArmyTaglineInput').value.trim();
    if (newName) cur.name = newName;
    cur.tagline = newTag;
    saveState();
    renderAll();
    renderSavedArmiesModal();
    showToast(`Saved "${cur.name}" in builder`);
  });

  document.getElementById('btnSaveAsCopy').addEventListener('click', () => {
    const cur = getCurrentArmy();
    if (!cur) return;
    const inputName = document.getElementById('saveArmyNameInput').value.trim() || cur.name || 'Saved Army';
    const inputTag = document.getElementById('saveArmyTaglineInput').value.trim();
    const existingNames = new Set(state.armies.map(a => (a.name || '').trim().toLowerCase()));
    let finalName = inputName;
    if (existingNames.has(finalName.toLowerCase())) {
      const base = inputName.replace(/\s+\d+$/, '') || inputName;
      let num = 2;
      while (existingNames.has(`${base} ${num}`.toLowerCase())) num++;
      finalName = `${base} ${num}`;
    }
    const copy = cloneArmy(cur, finalName);
    copy.tagline = inputTag;
    state.armies.unshift(copy);
    state.currentArmyId = copy.id;
    saveState();
    renderAll();
    document.getElementById('saveArmyNameInput').value = copy.name;
    renderSavedArmiesModal();
    showToast(`Saved copy "${copy.name}"`);
  });

  document.getElementById('btnSaveAsPreset').addEventListener('click', () => {
    const cur = getCurrentArmy();
    if (!cur) return;
    const presetName = document.getElementById('saveArmyNameInput').value.trim() || cur.name || 'Custom Army';
    const tagline = document.getElementById('saveArmyTaglineInput').value.trim() || `Custom saved roster (${cur.units.length} units)`;
    const keepBases = document.getElementById('chkPresetKeepBases').checked;

    const presetObj = {
      id: 'custom_' + generateId(),
      name: presetName,
      category: 'custom',
      tagline,
      bannerColor: cur.bannerColor || 'gold',
      pointsLimit: cur.pointsLimit,
      defaultRacial: cur.defaultRacial || '',
      strategies: keepBases ? [...(cur.strategies || [])] : [],
      units: (cur.units || []).map(u => ({
        name: u.name,
        company: u.company,
        racial: u.racial || '',
        traits: Array.isArray(u.traits) ? [...u.traits] : [],
        relic: u.relic || '',
        icon: u.icon || '',
        spells: u.spells ? { ...u.spells } : {},
        notes: u.notes || '',
        bases: keepBases ? (u.bases || 0) : 0
      }))
    };

    const existingIdx = state.customPresets.findIndex(p => p.name.toLowerCase() === presetName.toLowerCase());
    if (existingIdx >= 0) {
      presetObj.id = state.customPresets[existingIdx].id;
      state.customPresets[existingIdx] = presetObj;
    } else {
      state.customPresets.unshift(presetObj);
    }
    saveCustomPresets();
    showToast(`Saved "${presetName}" to Faction Presets → My Presets`);
  });

  document.getElementById('btnSaveModalNewBlank').addEventListener('click', () => {
    const army = createBlankArmy(`New Army ${state.armies.length + 1}`);
    state.armies.unshift(army);
    state.currentArmyId = army.id;
    state.filterMode = 'all';
    saveState();
    renderAll();
    closeOverlay('savedArmiesModalOverlay');
    showToast('Created new blank army');
  });

  document.getElementById('savedArmiesGrid').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.action;
    const aid = btn.dataset.armyId;
    if (!aid) return;

    if (action === 'open-saved-army') {
      state.currentArmyId = aid;
      state.searchQuery = '';
      document.getElementById('rosterSearch').value = '';
      saveState();
      renderAll();
      closeOverlay('savedArmiesModalOverlay');
      const opened = getCurrentArmy();
      showToast(`Opened "${opened?.name || 'Army'}"`);
    } else if (action === 'dup-saved-army') {
      const src = state.armies.find(a => a.id === aid);
      if (!src) return;
      const base = (src.name || 'Army').trim().replace(/\s+\d+$/, '') || 'Army';
      const existingNames = new Set(state.armies.map(a => (a.name || '').trim().toLowerCase()));
      let num = 2;
      while (existingNames.has(`${base} ${num}`.toLowerCase())) num++;
      const copy = cloneArmy(src, `${base} ${num}`);
      state.armies.unshift(copy);
      saveState();
      renderAll();
      renderSavedArmiesModal();
      showToast(`Duplicated "${copy.name}"`);
    } else if (action === 'del-saved-army') {
      if (state.armies.length <= 1) return;
      const target = state.armies.find(a => a.id === aid);
      if (!target) return;
      if (!confirm(`Delete "${target.name}"? This cannot be undone.`)) return;
      state.armies = state.armies.filter(a => a.id !== aid);
      if (state.currentArmyId === aid) {
        state.currentArmyId = state.armies[0].id;
      }
      saveState();
      renderAll();
      renderSavedArmiesModal();
      showToast(`Deleted "${target.name}"`);
    }
  });

  // Templates Modal
  document.getElementById('templatesTabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    state.templateTab = btn.dataset.templateTab;
    renderTemplatesGrid();
  });

  document.getElementById('templatesSearch').addEventListener('input', e => {
    state.templateSearch = e.target.value;
    renderTemplatesGrid();
  });

  document.getElementById('templatesGrid').addEventListener('click', e => {
    const delBtn = e.target.closest('button[data-action="del-custom-preset"]');
    if (delBtn) {
      const pid = delBtn.dataset.presetId;
      const target = state.customPresets.find(p => p.id === pid);
      if (!target) return;
      if (!confirm(`Remove "${target.name}" from My Presets?`)) return;
      state.customPresets = state.customPresets.filter(p => p.id !== pid);
      saveCustomPresets();
      renderTemplatesGrid();
      showToast(`Removed "${target.name}" from My Presets`);
      return;
    }

    const btn = e.target.closest('button[data-action="load-preset"]');
    if (!btn) return;
    const preset = getAllPresets().find(p => p.id === btn.dataset.presetId);
    if (!preset) return;
    const army = createArmyFromPreset(preset, false);
    state.armies.unshift(army);
    state.currentArmyId = army.id;
    state.filterMode = 'all';
    state.searchQuery = '';
    document.getElementById('rosterSearch').value = '';
    saveState();
    renderAll();
    closeOverlay('templatesModalOverlay');
    showToast(`Loaded "${preset.name}"`);
  });

  // Compendium Modal
  document.getElementById('compendiumTabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    state.compendiumTab = btn.dataset.tab;
    renderCompendium();
  });

  document.getElementById('compendiumSearch').addEventListener('input', e => {
    state.compendiumSearch = e.target.value;
    renderCompendium();
  });

  // Print Modal
  document.getElementById('printModeTable').addEventListener('click', () => {
    state.printMode = 'table';
    renderPrintPreview();
  });

  document.getElementById('printModeCards').addEventListener('click', () => {
    state.printMode = 'cards';
    renderPrintPreview();
  });

  document.getElementById('chkPrintAppendix').addEventListener('change', renderPrintPreview);
  document.getElementById('chkPrintZeroBases').addEventListener('change', renderPrintPreview);
  document.getElementById('btnDoPrint').addEventListener('click', () => {
    renderPrintPreview();
    window.print();
  });

  // Compare Modal
  document.getElementById('compareSelectA').addEventListener('change', e => {
    state.compare.idA = e.target.value;
    renderCompareModal();
  });

  document.getElementById('compareSelectB').addEventListener('change', e => {
    state.compare.idB = e.target.value;
    renderCompareModal();
  });

  document.getElementById('btnCompareSwap').addEventListener('click', () => {
    [state.compare.idA, state.compare.idB] = [state.compare.idB, state.compare.idA];
    renderCompareModal();
  });

  document.getElementById('compareContent').addEventListener('click', e => {
    if (e.target.closest('button[data-action="compare-open-presets"]')) {
      closeOverlay('compareModalOverlay');
      openTemplatesModal();
    }
  });

  // Pre-Game Modal
  document.getElementById('pregameModalBody').addEventListener('click', e => {
    const btn = e.target.closest('button[data-pregame-action]');
    if (!btn || btn.disabled) return;
    const army = getCurrentArmy();
    if (!army) return;
    handlePregameAction(army, btn);
    document.getElementById('pregameModalBody').innerHTML = renderPregameModalHtml(army);
    if (state.viewMode === 'battle') renderAll();
  });

  // Share / Export / Import Modal
  document.getElementById('btnCopyShareUrl').addEventListener('click', () => {
    copyToClipboard(document.getElementById('shareUrlInput').value, 'Shareable army link copied!');
  });

  document.getElementById('btnCopyText').addEventListener('click', () => {
    copyToClipboard(document.getElementById('exportTextArea').value, 'Plain-text roster copied!');
  });

  document.getElementById('btnDownloadJson').addEventListener('click', () => {
    const army = getCurrentArmy();
    if (!army) return;
    const blob = new Blob([JSON.stringify(army, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(army.name || 'fantastic-battles-army').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded army JSON backup');
  });

  document.getElementById('btnDownloadLibraryJson').addEventListener('click', () => {
    const payload = {
      type: 'fantastic-battles-library',
      version: 1,
      exportedAt: new Date().toISOString(),
      armies: state.armies,
      customPresets: state.customPresets
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fantastic-battles-full-library.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${state.armies.length} armies & ${state.customPresets.length} custom presets`);
  });

  document.getElementById('importJsonInput').addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        const sanitizeArmy = raw => ({
          id: generateId(),
          name: String(raw.name || 'Imported Army'),
          tagline: String(raw.tagline || ''),
          bannerColor: String(raw.bannerColor || 'gold'),
          pointsLimit: Number(raw.pointsLimit) >= 0 ? Number(raw.pointsLimit) : 500,
          defaultRacial: TRAIT_MAP[raw.defaultRacial] ? raw.defaultRacial : '',
          strategies: Array.isArray(raw.strategies) ? raw.strategies.filter(s => STRATEGY_MAP[s]).slice(0, 3) : [],
          updatedAt: Date.now(),
          units: (raw.units || []).map(u => {
            const cleanSpells = {};
            if (u.spells && typeof u.spells === 'object') {
              for (const [k, v] of Object.entries(u.spells)) {
                const n = parseInt(v, 10) || 0;
                if (n > 0 && SPELL_MAP[k]) cleanSpells[k] = Math.min(3, n);
              }
            }
            return {
              id: generateId(),
              name: String(u.name || ''),
              company: PROFILE_MAP[u.company] ? u.company : 'Formed company',
              racial: TRAIT_MAP[u.racial] ? u.racial : '',
              traits: Array.isArray(u.traits) ? u.traits.filter(t => TRAIT_MAP[t]).slice(0, 3) : [],
              relic: RELIC_MAP[u.relic] ? u.relic : '',
              icon: u.icon && UNIT_ICON_MAP[u.icon] ? u.icon : '',
              spells: cleanSpells,
              notes: String(u.notes || ''),
              attachedTo: '',
              horde: Boolean(u.horde),
              bases: Math.max(0, parseInt(u.bases, 10) || 0)
            };
          })
        });

        if (data && data.type === 'fantastic-battles-library' && Array.isArray(data.armies)) {
          const importedArmies = data.armies.map(sanitizeArmy);
          state.armies = [...importedArmies, ...state.armies];
          if (importedArmies.length > 0) state.currentArmyId = importedArmies[0].id;
          let presetAdded = 0;
          if (Array.isArray(data.customPresets)) {
            for (const p of data.customPresets) {
              if (p && p.name && Array.isArray(p.units)) {
                state.customPresets.unshift({ ...p, id: 'custom_' + generateId(), category: 'custom' });
                presetAdded++;
              }
            }
            saveCustomPresets();
          }
          saveState();
          renderAll();
          closeOverlay('shareModalOverlay');
          showToast(`Imported ${importedArmies.length} armies & ${presetAdded} custom presets`);
        } else if (data && Array.isArray(data.units)) {
          const imported = sanitizeArmy(data);
          state.armies.unshift(imported);
          state.currentArmyId = imported.id;
          saveState();
          renderAll();
          closeOverlay('shareModalOverlay');
          showToast(`Imported "${imported.name}"`);
        } else {
          throw new Error('Invalid format');
        }
      } catch {
        showToast('Could not import file — invalid Fantastic Battles JSON');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  // Generic modal close buttons & backdrop clicks
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeOverlay(btn.dataset.closeModal));
  });

  document.querySelectorAll('.overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeOverlay(overlay.id);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.overlay.open').forEach(o => closeOverlay(o.id));
      return;
    }
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      e.preventDefault();
      performUndo();
    } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      e.preventDefault();
      performRedo();
    }
  });
}

// ============================================================================
// Boot
// ============================================================================

initTheme();
loadState();
bindEvents();
renderAll();

// Register Offline-Ready Service Worker (safe no-op if unsupported)
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
