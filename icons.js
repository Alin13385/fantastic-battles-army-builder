// Fantastic Battles — Tabletop Unit Type SVG Icons & Smart Auto-Detection

export const UNIT_ICONS = [
  {
    id: 'archer',
    label: 'Archers (Bow & Arrow)',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 19C9.5 17.5 14.5 12.5 16 8"/>
      <path d="M5 19C4.5 13 9 6.5 16 5"/>
      <path d="M5 19L16 5"/>
      <path d="M7 7L19 19"/>
      <polyline points="14 19 19 19 19 14"/>
      <path d="M6 10L7 7L10 6"/>
    </svg>`
  },
  {
    id: 'cavalry',
    label: 'Mounted (Horse Head)',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 20c0-3.5 1.2-6 3-8l-1-3.5L10.5 6l1-2.5 2 2c2.5.4 4.8 2 6 4.5l1.5 2.2-1.8 1.6-2.7-.8-2 1.8c1 1.5 1.5 3.2 1.5 5.2H6z"/>
      <circle cx="13.5" cy="9.2" r="0.8" fill="currentColor" stroke="none"/>
      <path d="M8.8 12.2c-.8 1.4-1.3 3.2-1.4 5.3"/>
    </svg>`
  },
  {
    id: 'shield',
    label: 'Shieldwall / Heavy Infantry',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l7 3v5.5c0 4.6-3 8.5-7 9.5-4-1-7-4.9-7-9.5V6l7-3z"/>
      <path d="M12 3v18"/>
      <path d="M5 10.5h14"/>
    </svg>`
  },
  {
    id: 'spear',
    label: 'Spears & Pikes',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="20" x2="18" y2="6"/>
      <polygon points="15 4 20 4 20 9 17.5 6.5" fill="currentColor"/>
      <line x1="20" y1="20" x2="6" y2="6"/>
      <polygon points="9 4 4 4 4 9 6.5 6.5" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'axe',
    label: 'Heavy Weapons / Berserkers',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="19" x2="18" y2="6"/>
      <path d="M13 4c2.8-.6 5.5.5 7 3-2 1.8-4.2 2.4-6.5 2L13 4z"/>
      <path d="M10.5 7.5L16.5 13.5"/>
    </svg>`
  },
  {
    id: 'swords',
    label: 'Elite / Swordsmen',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
      <line x1="13" y1="19" x2="19" y2="13"/>
      <line x1="16" y1="16" x2="20" y2="20"/>
      <polyline points="9.5 17.5 21 6 21 3 18 3 6.5 14.5"/>
      <line x1="11" y1="19" x2="5" y2="13"/>
      <line x1="8" y1="16" x2="4" y2="20"/>
    </svg>`
  },
  {
    id: 'skirmisher',
    label: 'Skirmishers / Foresters',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 20c1.5-7 6-13 15-15-1 9-6 14-15 15z"/>
      <path d="M4 20L14 10"/>
      <path d="M9 15l1-4"/>
      <path d="M12 12l3-1"/>
    </svg>`
  },
  {
    id: 'artillery',
    label: 'Artillery / Ordnance',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 13l11-5 2 4-11 4.5z"/>
      <circle cx="9.5" cy="17" r="3"/>
      <path d="M12.5 17H19"/>
      <circle cx="19.5" cy="6.5" r="1.4" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    id: 'chariot',
    label: 'Vehicle / Chariot',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <circle cx="12" cy="12" r="2.2"/>
      <line x1="12" y1="4" x2="12" y2="9.8"/>
      <line x1="12" y1="14.2" x2="12" y2="20"/>
      <line x1="4" y1="12" x2="9.8" y2="12"/>
      <line x1="14.2" y1="12" x2="20" y2="12"/>
      <line x1="6.3" y1="6.3" x2="10.4" y2="10.4"/>
      <line x1="13.6" y1="13.6" x2="17.7" y2="17.7"/>
      <line x1="17.7" y1="6.3" x2="13.6" y2="10.4"/>
      <line x1="10.4" y1="13.6" x2="6.3" y2="17.7"/>
    </svg>`
  },
  {
    id: 'flying',
    label: 'Flying Unit',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19c0-5-3-9-9-11 1 4 2.5 6.5 5 8-1.5.5-2.5 1.2-3 2 2.5 0 5-.5 7 1z"/>
      <path d="M12 19c0-5 3-9 9-11-1 4-2.5 6.5-5 8 1.5.5 2.5 1.2 3 2-2.5 0-5-.5-7 1z"/>
      <path d="M12 7v12"/>
    </svg>`
  },
  {
    id: 'dragon',
    label: 'Dragon / Colossal',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 18c1-4 2.5-7.5 6-9l-2-4 4.5 2L16 4l-.5 4c2.2 1 4 2.8 4.5 5l-3.5 1 1.5 2-4.5-.5c-2.5 1-4.5 2.5-5.5 4.5H4z"/>
      <circle cx="14.2" cy="10.2" r="0.9" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    id: 'monster',
    label: 'Monster / Fantastic Beast',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 17c1-5 2-9 4-12"/>
      <path d="M10 19c.5-5.5 1.5-10 3-14"/>
      <path d="M15 18c.5-4.5 1.8-8.5 3.5-11.5"/>
      <path d="M4 19.5c4.5-1.5 11.5-1.5 16 0"/>
    </svg>`
  },
  {
    id: 'swarm',
    label: 'Swarm',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="7.5" cy="9" r="2.2"/>
      <circle cx="16.5" cy="8.5" r="2.2"/>
      <circle cx="12" cy="15.5" r="2.5"/>
      <path d="M5 7l-1.5-1M10 7l1.5-1M14 6.5L12.5 5.5M19 6.5l1.5-1M9 14l-2-1M15 14l2-1M9.5 18l-1.5 1.5M14.5 18l1.5 1.5"/>
    </svg>`
  },
  {
    id: 'crown',
    label: 'Warlord (Crown)',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 18h18l-1.5-10-4.5 4-3-6-3 6-4.5-4L3 18z"/>
      <line x1="4" y1="21" x2="20" y2="21"/>
    </svg>`
  },
  {
    id: 'magic',
    label: 'Mage / Magic-user',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"/>
      <line x1="12" y1="15" x2="12" y2="21"/>
      <circle cx="18.5" cy="16.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="5.5" cy="17.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    id: 'banner',
    label: 'Captain (Banner)',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <line x1="6" y1="3" x2="6" y2="21"/>
      <path d="M6 4h12l-2.8 4.5L18 13H6"/>
    </svg>`
  },
  {
    id: 'dagger',
    label: 'Rogue (Dagger)',
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 5l-9.5 9.5"/>
      <path d="M19 5l-5.5 1.5-4 4 4 4 4-4L19 5z"/>
      <path d="M7.5 12.5l4 4"/>
      <line x1="5" y1="19" x2="9" y2="15"/>
    </svg>`
  }
];

export const UNIT_ICON_MAP = Object.fromEntries(UNIT_ICONS.map(i => [i.id, i]));

export function detectUnitIconId(unit, calc) {
  if (unit.icon && UNIT_ICON_MAP[unit.icon]) return unit.icon;

  const company = unit.company || '';
  const traits = calc?.traits || [];
  const has = t => traits.includes(t);

  // Standalone Characters
  if (company === 'Warlord') return 'crown';
  if (company === 'Mage-lord' || company === 'Magic-user') return 'magic';
  if (company === 'Captain') return 'banner';
  if (company === 'Rogue') return 'dagger';

  // Character-companies
  if (has('Character (Warlord)')) return 'crown';
  if (has('Character (Mage-lord)') || has('Character (Magic-user)')) return 'magic';
  if (has('Character (Captain)')) return 'banner';

  // Distinct base silhouettes
  if (company === 'Dragon') return 'dragon';
  if (company === 'Ordnance battery' || has('Artillery') || has('Artillery (indirect)')) return 'artillery';
  if (company === 'Vehicle') return 'chariot';

  // Trait-driven battlefield roles
  if (has('Flying')) return 'flying';
  if (has('Mounted')) return 'cavalry';
  if (has('Swarm')) return 'swarm';
  if (has('Shooting') || has('Shooting (skilled)') || has('Shooting (mixed)')) return 'archer';
  if (company === 'Fantastic beast' || has('Giant') || has('Monstrous')) return 'monster';
  if (has('Long spears') || has('Pikes')) return 'spear';
  if (has('Shieldwall')) return 'shield';
  if (has('Heavy melee weapons') || has('Berserk')) return 'axe';
  if (has('Skirmishers') || has('Foresters')) return 'skirmisher';

  // Fallback by company class
  if (company === 'Elite company') return 'swords';
  if (company === 'Formed company') return 'shield';
  return 'swords';
}

export function renderUnitIconHtml(unit, calc, extraClass = '') {
  const iconId = detectUnitIconId(unit, calc);
  const icon = UNIT_ICON_MAP[iconId] || UNIT_ICONS[0];
  const isChar = calc?.charInfo?.isCharacter;
  return `<span class="unit-type-icon ${isChar ? 'is-char' : ''} ${extraClass}" title="${icon.label}" aria-hidden="true">${icon.svg}</span>`;
}
