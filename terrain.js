// Fantastic Battles — Terrain Quick-Reference & Battlefield Layout Generator
// Concise mechanical summaries referencing Fantastic Battles v1.1 (pp. 19–21) & v1.2 Update (p. 3).

const TERRAIN_STORAGE_KEY = 'fb_terrain_state_v1';

export const TERRAIN_SETUP_GUIDE = [
  { label: 'Table Size', value: '30×20bw (750–1000 pts) or 20×20bw (250–500 pts)' },
  { label: 'Density', value: '1–3 features per 10×10bw square · Keep ≥50% open ground' },
  { label: 'Area Features', value: '3×2bw up to 8×6bw (hills, woods, rough, ponds, settlements, impassable)' },
  { label: 'Rivers', value: '1–2bw wide · Include ≥1 bridge (1bw open) or ford (1–4bw rough)' },
  { label: 'Linear & Roads', value: 'Linear ≥3bw long, ≤½bw deep · Roads ≤1bw wide (not counted in 1–3 limit)' }
];

export const TERRAIN_RULES = [
  {
    id: 'open',
    name: 'Open Terrain',
    category: 'Ground',
    color: '#6e8c54',
    pageRef: 'v1.1 p. 19',
    mov: 'Normal',
    mel: '0',
    sht: '0',
    los: 'Open',
    summary: 'Default unobstructed battlefield ground. No movement, combat, or line-of-sight penalties.',
    notes: 'Table setup should leave at least 50% of the playing surface as open terrain.'
  },
  {
    id: 'hill',
    name: 'Hills',
    category: 'Area (3×2–8×6bw)',
    color: '#a89259',
    pageRef: 'v1.1 p. 19',
    mov: 'Normal',
    mel: '-1 uphill',
    sht: 'Shoot over lower allies',
    los: 'Crest blocks LoS',
    summary: 'Units fighting uphill suffer -1 Melee. Units on a hill crest or slope may shoot over friendly units on lower ground.',
    notes: 'The hill crest blocks line of sight to targets behind it. Agree crest boundaries before battle.'
  },
  {
    id: 'rough',
    name: 'Rough Terrain',
    category: 'Area (3×2–8×6bw)',
    color: '#9c7d4b',
    pageRef: 'v1.1 p. 20',
    mov: '-1bw (-2bw mounted, min 1bw)',
    mel: '-1 (-2 mounted)',
    sht: '-1 vs target >50% inside',
    los: 'Open',
    summary: 'Scree, bogs, crops, rocky slopes, or shallow fords. Slows movement and disrupts melee while offering light cover against shooting.',
    notes: 'Foresters & Ephemeral ignore movement and melee penalties. Flying ignores movement penalties.'
  },
  {
    id: 'wood',
    name: 'Woods',
    category: 'Area (3×2–8×6bw)',
    color: '#2f7a3e',
    pageRef: 'v1.1 p. 20',
    mov: 'Reduced to 1bw',
    mel: '-2 (-4 mounted / long spears)',
    sht: '-1 vs target >50% inside',
    los: 'Blocked at edge (max 2bw in/out/within)',
    summary: 'Dense woodland severely slows movement and punishes mounted troops and long spears in melee, while providing cover and blocking sight.',
    notes: 'Units cannot see through woods; max 2bw visibility into, out of, or within woods. Foresters & Ephemeral ignore move/melee penalties.'
  },
  {
    id: 'water',
    name: 'Water Features',
    category: 'Area / River (1–2bw wide)',
    color: '#2e7ba8',
    pageRef: 'v1.1 p. 20 · v1.2 p. 3',
    mov: 'Reduced to 1bw',
    mel: '-2 (-4 mounted)',
    sht: 'No shooting inside*',
    los: 'Open',
    summary: 'Streams, rivers, ponds, and marshes. Units inside cannot shoot unless Amphibious; v1.2 gives Amphibious units in water -1 shooting cover.',
    notes: 'Rivers (1–2bw wide) need ≥1 crossing: bridges (1bw wide, open) or fords (1–4bw wide, rough). Amphibious treats water as open.'
  },
  {
    id: 'settlement',
    name: 'Settlements',
    category: 'Area (3×2–8×6bw)',
    color: '#b56e45',
    pageRef: 'v1.1 p. 21',
    mov: '-1bw (-2bw mounted, min 1bw)',
    mel: '-1 (-2 mounted)',
    sht: '-1 vs target >50% inside',
    los: 'Agree pre-game',
    summary: 'Villages, ruins, shrines, or encampments. Counts as Rough terrain (Foresters do NOT ignore settlement penalties).',
    notes: 'Once per settlement per battle, an unattached character or character-company may spend 1 action to Consult priests, Demand submission, or Steal relic (see rulebook p. 21 tables).'
  },
  {
    id: 'impassable',
    name: 'Impassable Terrain',
    category: 'Area (3×2–8×6bw)',
    color: '#6b6f78',
    pageRef: 'v1.1 p. 21 · v1.2 p. 3',
    mov: 'Cannot enter or cross*',
    mel: 'N/A',
    sht: 'N/A',
    los: 'Agree pre-game',
    summary: 'Sheer cliffs, lava pools, deep chasms, or fortified towers. Blocks normal movement completely.',
    notes: 'v1.2: Ephemeral units may pass completely through impassable terrain if they have enough movement and landing space. Agree whether features block LoS (e.g. cliffs yes, chasms no).'
  },
  {
    id: 'linear',
    name: 'Linear Features',
    category: 'Linear (≥3bw × ≤½bw)',
    color: '#8f8470',
    pageRef: 'v1.1 p. 21',
    mov: '-1bw to cross',
    mel: '-1 both sides · no charge bonus',
    sht: '-1 vs defending target',
    los: 'Open (unless high wall)',
    summary: 'Stone walls, hedges, ditches, and palisades. Disrupts attackers crossing them and provides cover to defenders lining the obstacle.',
    notes: 'Neither side gains a charge bonus across a linear feature. Raised battlements combine Linear Feature rules with a Hill crest.'
  },
  {
    id: 'road',
    name: 'Roads',
    category: 'Track (≤1bw wide)',
    color: '#b89f6d',
    pageRef: 'v1.1 p. 21',
    mov: 'Ignore terrain penalties*',
    mel: '0',
    sht: '0',
    los: 'Open',
    summary: 'Single companies and groups in Column formation ignore terrain movement penalties while moving along a road.',
    notes: 'Maximum 1bw wide. Roads do NOT count toward the 1–3 terrain features per 10×10bw square limit.'
  }
];

export const TERRAIN_RULE_MAP = Object.fromEntries(TERRAIN_RULES.map(t => [t.id, t]));

export const BIOMES = [
  {
    id: 'balanced',
    name: 'Balanced',
    desc: 'Classic fantasy mix of hills, woods, rough ground & obstacles',
    weights: { hill: 26, wood: 26, rough: 22, linear: 12, settlement: 6, impassable: 4, water: 4 },
    riverChance: 0.35,
    roadChance: 0.45
  },
  {
    id: 'woodland',
    name: 'Woodland',
    desc: 'Dense forests, clearings, glades & rough undergrowth',
    weights: { wood: 44, rough: 24, hill: 14, linear: 8, water: 6, settlement: 2, impassable: 2 },
    riverChance: 0.4,
    roadChance: 0.45
  },
  {
    id: 'highlands',
    name: 'Highlands',
    desc: 'Steep ridges, rocky scree & impassable crags',
    weights: { hill: 40, rough: 26, impassable: 16, linear: 8, wood: 6, water: 2, settlement: 2 },
    riverChance: 0.25,
    roadChance: 0.3
  },
  {
    id: 'borderlands',
    name: 'Borderlands',
    desc: 'Villages, roads, stone walls, hedgerows & crop fields',
    weights: { settlement: 18, linear: 26, rough: 24, hill: 14, wood: 12, water: 4, impassable: 2 },
    riverChance: 0.3,
    roadChance: 0.85
  },
  {
    id: 'rivervalley',
    name: 'River Valley',
    desc: 'Guaranteed river crossing with bridges/fords, marshes & hills',
    weights: { wood: 24, hill: 22, rough: 24, water: 12, linear: 10, settlement: 6, impassable: 2 },
    riverChance: 1.0,
    roadChance: 0.7
  }
];

const FEATURE_LABELS = {
  hill: ['Gentle Hill', 'Ridge Hill', 'Watch Hill', 'Grassy Knoll', 'High Slope'],
  wood: ['Dense Wood', 'Ancient Grove', 'Pine Copse', 'Thicket', 'Dark Wood'],
  rough: ['Rocky Ground', 'Scree Field', 'Marshy Bog', 'Overgrown Field', 'Broken Ground'],
  water: ['Shallow Pond', 'Marsh Pool', 'Sunken Mere', 'Flooded Hollow'],
  settlement: ['Hamlet', 'Ruined Shrine', 'Outpost', 'Stone Village', 'Camp'],
  impassable: ['Sheer Crag', 'Rock Spire', 'Deep Chasm', 'Ruined Tower'],
  linear: ['Stone Wall', 'Hedge Row', 'Timber Fence', 'Low Dike']
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Seeded PRNG (mulberry32) so maps can be reproduced & shared cleanly
function createRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickWeighted(rng, weights) {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[0]?.[0] || 'hill';
}

function defaultSettings() {
  return {
    tableSize: '30x20', // '30x20' | '20x20'
    biome: 'balanced',
    density: 'standard', // 'sparse' | 'standard' | 'dense'
    riverMode: 'auto', // 'auto' | 'yes' | 'no'
    roadMode: 'auto', // 'auto' | 'yes' | 'no'
    showGrid: true,
    showDeployment: false,
    showLabels: true,
    seed: Math.floor(Math.random() * 900000) + 100000,
    selectedFeatureId: null
  };
}

let terrainState = null;
let mobileControlsOpen = false;

export function getTerrainState() {
  if (!terrainState) {
    try {
      const saved = JSON.parse(localStorage.getItem(TERRAIN_STORAGE_KEY) || 'null');
      terrainState = { ...defaultSettings(), ...(saved && typeof saved === 'object' ? saved : {}) };
    } catch {
      terrainState = defaultSettings();
    }
  }
  return terrainState;
}

function saveTerrainState() {
  try {
    localStorage.setItem(TERRAIN_STORAGE_KEY, JSON.stringify(terrainState));
  } catch {
    // ignore quota
  }
}

// ============================================================================
// Procedural Battlefield Layout Engine (30x20bw or 20x20bw)
// ============================================================================

export function generateBattlefield(settings) {
  const width = settings.tableSize === '20x20' ? 20 : 30;
  const height = 20;
  const cols = width / 10; // 3 or 2
  const rows = height / 10; // 2
  const tableArea = width * height; // 600 or 400 bw^2

  const rng = createRng(settings.seed || 123456);
  const biome = BIOMES.find(b => b.id === settings.biome) || BIOMES[0];

  const features = [];
  let nextId = 1;

  // 1) Optional River (1.5–2bw wide, organic meandering spline)
  const wantRiver = settings.riverMode === 'yes'
    || (settings.riverMode === 'auto' && rng() < biome.riverChance);

  let river = null;
  if (wantRiver) {
    const horizontal = rng() < 0.72;
    const riverWidth = rng() < 0.5 ? 1.5 : 2;
    const riverSeed = Math.floor(rng() * 100000);
    let rawPts;

    if (horizontal) {
      // 5 control points with natural S-bend meander, extended slightly past edges for clean clipping
      const baseY = 8 + rng() * 4;
      const amp = 1.6 + rng() * 2.1;
      const phase = rng() * Math.PI * 2;
      const drift = (rng() - 0.5) * 3.2;
      rawPts = [];
      const segs = 5;
      for (let i = 0; i <= segs; i++) {
        const u = i / segs;
        const x = -1.2 + u * (width + 2.4);
        const y = Math.max(4.2, Math.min(height - 4.2,
          baseY + Math.sin(u * Math.PI * 1.8 + phase) * amp + (u - 0.5) * drift
        ));
        rawPts.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
      }
    } else {
      const baseX = width * (0.36 + rng() * 0.28);
      const amp = 1.5 + rng() * 2.0;
      const phase = rng() * Math.PI * 2;
      const drift = (rng() - 0.5) * 3.2;
      rawPts = [];
      const segs = 4;
      for (let i = 0; i <= segs; i++) {
        const u = i / segs;
        const y = -1.2 + u * (height + 2.4);
        const x = Math.max(4.5, Math.min(width - 4.5,
          baseX + Math.sin(u * Math.PI * 1.7 + phase) * amp + (u - 0.5) * drift
        ));
        rawPts.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
      }
    }

    const curve = sampleCatmullRom(rawPts, 16);
    const crossingCount = horizontal && width === 30 ? (rng() < 0.65 ? 2 : 1) : 1;
    const crossings = [];
    for (let c = 0; c < crossingCount; c++) {
      const frac = crossingCount === 2
        ? (c === 0 ? 0.28 + rng() * 0.1 : 0.64 + rng() * 0.12)
        : (0.42 + rng() * 0.16);
      const sp = sampleCurveAtFraction(curve, frac);
      const isBridge = rng() < 0.58;
      // Tangent angle along river; bridge spans across the river (perpendicular to tangent)
      const riverAngleDeg = +(Math.atan2(sp.ty, sp.tx) * 180 / Math.PI).toFixed(1);
      crossings.push({
        kind: isBridge ? 'bridge' : 'ford',
        x: +sp.x.toFixed(2),
        y: +sp.y.toFixed(2),
        nx: sp.nx,
        ny: sp.ny,
        tx: sp.tx,
        ty: sp.ty,
        widthBw: isBridge ? 1 : randInt(rng, 2, 3),
        angle: riverAngleDeg
      });
    }

    river = {
      id: `f_${nextId++}`,
      type: 'water',
      isRiver: true,
      name: 'River',
      horizontal,
      widthBw: riverWidth,
      seed: riverSeed,
      pts: rawPts,
      curve,
      crossings,
      sector: 'Across table',
      approxArea: +((horizontal ? width : height) * riverWidth * 0.92).toFixed(1),
      dimText: `${riverWidth}bw wide · ${crossings.map(c => c.kind === 'bridge' ? '1bw Bridge' : `${c.widthBw}bw Ford`).join(', ')}`
    };
    features.push(river);
  }

  // 2) Optional Road (<=1bw wide; medieval dirt/cobble track, does NOT count toward 1-3 limit)
  const wantRoad = settings.roadMode === 'yes'
    || (settings.roadMode === 'auto' && rng() < biome.roadChance);

  let road = null;
  if (wantRoad) {
    const roadWidth = 0.88;
    const roadSeed = Math.floor(rng() * 100000);
    let rawPts;

    if (river && river.crossings.length > 0) {
      // Route road naturally perpendicular through the first river crossing with smooth approach curves
      const cr = river.crossings[0];
      // Ensure normal points roughly from top/left toward bottom/right
      let nx = cr.nx;
      let ny = cr.ny;
      if (river.horizontal && ny < 0) { nx = -nx; ny = -ny; }
      if (!river.horizontal && nx < 0) { nx = -nx; ny = -ny; }

      const approachDist = river.widthBw * 0.95 + 1.4;
      const pBefore = { x: cr.x - nx * approachDist, y: cr.y - ny * approachDist };
      const pAfter = { x: cr.x + nx * approachDist, y: cr.y + ny * approachDist };

      if (river.horizontal) {
        const topX = Math.max(2.5, Math.min(width - 2.5, pBefore.x + (rng() - 0.5) * 6));
        const botX = Math.max(2.5, Math.min(width - 2.5, pAfter.x + (rng() - 0.5) * 6));
        const midTop = {
          x: (topX + pBefore.x) / 2 + (rng() - 0.5) * 2.2,
          y: pBefore.y * 0.45
        };
        const midBot = {
          x: (botX + pAfter.x) / 2 + (rng() - 0.5) * 2.2,
          y: pAfter.y + (height - pAfter.y) * 0.55
        };
        rawPts = [
          { x: topX, y: -1.0 },
          midTop,
          pBefore,
          { x: cr.x, y: cr.y },
          pAfter,
          midBot,
          { x: botX, y: height + 1.0 }
        ];
      } else {
        const leftY = Math.max(2.5, Math.min(height - 2.5, pBefore.y + (rng() - 0.5) * 5.5));
        const rightY = Math.max(2.5, Math.min(height - 2.5, pAfter.y + (rng() - 0.5) * 5.5));
        const midLeft = {
          x: pBefore.x * 0.45,
          y: (leftY + pBefore.y) / 2 + (rng() - 0.5) * 2.0
        };
        const midRight = {
          x: pAfter.x + (width - pAfter.x) * 0.55,
          y: (rightY + pAfter.y) / 2 + (rng() - 0.5) * 2.0
        };
        rawPts = [
          { x: -1.0, y: leftY },
          midLeft,
          pBefore,
          { x: cr.x, y: cr.y },
          pAfter,
          midRight,
          { x: width + 1.0, y: rightY }
        ];
      }
    } else if (rng() < 0.65) {
      // Gently winding East-West trade road
      const baseY = 6.5 + rng() * 7;
      const amp = 1.4 + rng() * 2.2;
      const phase = rng() * Math.PI * 2;
      const drift = (rng() - 0.5) * 4;
      rawPts = [];
      for (let i = 0; i <= 4; i++) {
        const u = i / 4;
        const x = -1.0 + u * (width + 2.0);
        const y = Math.max(2.8, Math.min(height - 2.8,
          baseY + Math.sin(u * Math.PI * 1.5 + phase) * amp + (u - 0.5) * drift
        ));
        rawPts.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
      }
    } else {
      // Gently winding North-South highway
      const baseX = 5 + rng() * (width - 10);
      const amp = 1.4 + rng() * 2.2;
      const phase = rng() * Math.PI * 2;
      const drift = (rng() - 0.5) * 4;
      rawPts = [];
      for (let i = 0; i <= 4; i++) {
        const u = i / 4;
        const y = -1.0 + u * (height + 2.0);
        const x = Math.max(3.2, Math.min(width - 3.2,
          baseX + Math.sin(u * Math.PI * 1.5 + phase) * amp + (u - 0.5) * drift
        ));
        rawPts.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
      }
    }

    const roadCurve = sampleCatmullRom(rawPts, 14);
    const labelPt = sampleCurveAtFraction(roadCurve, river ? 0.17 : 0.5);
    road = {
      id: `f_${nextId++}`,
      type: 'road',
      isRoad: true,
      name: 'Road',
      widthBw: roadWidth,
      seed: roadSeed,
      pts: rawPts,
      curve: roadCurve,
      labelPt,
      sector: 'Not counted in 1–3 limit',
      approxArea: 0, // Roads do not subtract from open-ground maneuver space
      dimText: '≤1bw wide (ignores terrain mov penalties in column/single)'
    };
    features.push(road);
  }

  // 3) Per-sector placement (1-3 features per 10x10bw square, keeping total terrain area <= 45% so open >= 55%)
  const maxTerrainArea = tableArea * 0.44;
  let usedArea = river ? river.approxArea : 0;
  let settlementCount = 0;
  let impassableCount = 0;
  const maxSettlements = settings.biome === 'borderlands' ? 2 : 1;
  const maxImpassable = settings.biome === 'highlands' ? 2 : 1;

  const sectorStats = [];
  const colLetters = ['A', 'B', 'C'];

  // Density min/max per 10x10bw sector
  const densityRanges = {
    sparse: [1, 2],
    standard: [1, 3],
    dense: [2, 3]
  };
  const [minPerSec, maxPerSec] = densityRanges[settings.density] || [1, 3];

  const placedBoxes = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const secName = `${colLetters[c]}${r + 1}`;
      const secX0 = c * 10;
      const secY0 = r * 10;
      const riverInSector = river ? polylineIntersectsRect(river.curve || river.pts, secX0, secY0, 10, 10) : false;

      let targetCount = randInt(rng, minPerSec, maxPerSec);
      if (riverInSector && targetCount > 1) {
        // River already occupies part of this sector
        targetCount = Math.max(1, targetCount - 1);
      }

      let secPlaced = 0;

      for (let slot = 0; slot < targetCount; slot++) {
        // Pick terrain type respecting caps
        const weights = { ...biome.weights };
        if (settlementCount >= maxSettlements) weights.settlement = 0;
        if (impassableCount >= maxImpassable) weights.impassable = 0;
        if (river) weights.water = Math.min(weights.water || 0, 2);

        let type = pickWeighted(rng, weights);

        // If approaching open-ground cap, prefer linear or smaller feature
        if (usedArea > maxTerrainArea * 0.85 && type !== 'linear') {
          type = rng() < 0.6 ? 'linear' : type;
        }

        let placed = null;
        for (let attempt = 0; attempt < 26; attempt++) {
          if (type === 'linear') {
            const len = randInt(rng, 3, 5);
            const depth = 0.5;
            const angle = Math.round((rng() * 160 - 80) / 15) * 15;
            const cx = +(secX0 + 2.2 + rng() * 5.6).toFixed(1);
            const cy = +(secY0 + 2.2 + rng() * 5.6).toFixed(1);
            const halfR = len / 2 + 0.6;
            if (cx - halfR < 0.7 || cx + halfR > width - 0.7 || cy - halfR < 0.7 || cy + halfR > height - 0.7) continue;
            if (overlapsAny(cx, cy, len / 2 + 0.5, 1.4, placedBoxes)) continue;
            // Check 5 sample points along the full rotated linear segment against river & road
            const rad = angle * Math.PI / 180;
            const cosA = Math.cos(rad);
            const sinA = Math.sin(rad);
            let hitsWaterOrRoad = false;
            for (const frac of [-0.5, -0.25, 0, 0.25, 0.5]) {
              const sx = cx + cosA * len * frac;
              const sy = cy + sinA * len * frac;
              if (river && pointNearPolyline(sx, sy, river.curve || river.pts, river.widthBw / 2 + 0.85)) {
                hitsWaterOrRoad = true;
                break;
              }
              if (road && pointNearPolyline(sx, sy, road.curve || road.pts, road.widthBw / 2 + 0.7)) {
                hitsWaterOrRoad = true;
                break;
              }
            }
            if (hitsWaterOrRoad) continue;

            const labels = FEATURE_LABELS.linear;
            placed = {
              id: `f_${nextId++}`,
              type: 'linear',
              name: labels[randInt(rng, 0, labels.length - 1)],
              sector: secName,
              cx, cy,
              w: len,
              h: depth,
              angle,
              approxArea: +(len * depth).toFixed(1),
              dimText: `${len}×½bw linear`
            };
            placedBoxes.push({ cx, cy, rx: len / 2 + 0.4, ry: 1.2 });
            break;
          } else {
            // Area feature: 3x2bw to 7x5bw (strictly within 3x2bw - 8x6bw rule)
            const w = type === 'impassable' || type === 'settlement'
              ? randInt(rng, 3, 5)
              : randInt(rng, 3, 6);
            const h = type === 'impassable' || type === 'settlement'
              ? randInt(rng, 2, 4)
              : randInt(rng, 2, Math.min(5, w));
            const area = +(w * h * 0.78).toFixed(1); // organic ellipse/blob ~78% of bounding box
            if (usedArea + area > maxTerrainArea) {
              // Shrink to 3x2 if possible, otherwise skip
              if (w > 3 || h > 2) continue;
              if (usedArea + 4.7 > maxTerrainArea) break;
            }
            const angle = Math.round((rng() * 60 - 30) / 10) * 10;
            const marginX = w / 2 + 0.6;
            const marginY = h / 2 + 0.6;
            const minX = Math.max(marginX, secX0 + 0.8);
            const maxX = Math.min(width - marginX, secX0 + 9.2);
            const minY = Math.max(marginY, secY0 + 0.8);
            const maxY = Math.min(height - marginY, secY0 + 9.2);
            if (maxX <= minX || maxY <= minY) continue;

            const cx = +(minX + rng() * (maxX - minX)).toFixed(1);
            const cy = +(minY + rng() * (maxY - minY)).toFixed(1);

            if (overlapsAny(cx, cy, w / 2 + 0.55, h / 2 + 0.55, placedBoxes)) continue;
            if (river && pointNearPolyline(cx, cy, river.curve || river.pts, river.widthBw / 2 + Math.max(w, h) * 0.44 + 0.35)) continue;
            if (road && pointNearPolyline(cx, cy, road.curve || road.pts, (type === 'settlement' ? 0.55 : 0.95) + Math.max(w, h) * 0.36)) continue;

            const labels = FEATURE_LABELS[type] || ['Terrain'];
            const blobSeed = Math.floor(rng() * 10000);
            placed = {
              id: `f_${nextId++}`,
              type,
              name: labels[randInt(rng, 0, labels.length - 1)],
              sector: secName,
              cx, cy,
              w, h,
              angle,
              blobSeed,
              approxArea: area,
              dimText: `${w}×${h}bw`
            };
            placedBoxes.push({ cx, cy, rx: w / 2 + 0.45, ry: h / 2 + 0.45 });
            break;
          }
        }

        if (placed) {
          features.push(placed);
          usedArea += placed.approxArea;
          secPlaced++;
          if (placed.type === 'settlement') settlementCount++;
          if (placed.type === 'impassable') impassableCount++;
        }
      }

      sectorStats.push({
        sector: secName,
        count: secPlaced + (riverInSector ? 1 : 0),
        hasRiver: riverInSector
      });
    }
  }

  const openPct = Math.max(0, Math.min(100, Math.round(((tableArea - usedArea) / tableArea) * 100)));

  return {
    width,
    height,
    cols,
    rows,
    tableArea,
    usedArea: +usedArea.toFixed(1),
    openPct,
    biome,
    features,
    sectorStats
  };
}

function overlapsAny(cx, cy, rx, ry, boxes) {
  for (const b of boxes) {
    if (Math.abs(cx - b.cx) < (rx + b.rx) && Math.abs(cy - b.cy) < (ry + b.ry)) {
      return true;
    }
  }
  return false;
}

function sampleCatmullRom(pts, samplesPerSeg = 14) {
  if (!pts || pts.length < 2) return [];
  const raw = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const steps = i === pts.length - 2 ? samplesPerSeg : samplesPerSeg;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const x = 0.5 * (
        (2 * p1.x) +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
      );
      const y = 0.5 * (
        (2 * p1.y) +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
      );
      raw.push({ x, y });
    }
  }
  raw.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y });

  // Compute cumulative arc length, unit tangent (tx, ty) and unit normal (nx, ny)
  let dist = 0;
  const out = [];
  for (let i = 0; i < raw.length; i++) {
    if (i > 0) dist += Math.hypot(raw[i].x - raw[i - 1].x, raw[i].y - raw[i - 1].y);
    const prev = raw[Math.max(0, i - 1)];
    const next = raw[Math.min(raw.length - 1, i + 1)];
    let tx = next.x - prev.x;
    let ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    out.push({ x: raw[i].x, y: raw[i].y, tx, ty, nx: -ty, ny: tx, dist });
  }
  return out;
}

function sampleCurveAtFraction(curve, frac) {
  if (!curve || curve.length === 0) return { x: 0, y: 0, tx: 1, ty: 0, nx: 0, ny: 1, dist: 0 };
  const total = curve[curve.length - 1].dist || 1;
  const target = Math.max(0, Math.min(1, frac)) * total;
  for (let i = 1; i < curve.length; i++) {
    if (curve[i].dist >= target) {
      const a = curve[i - 1];
      const b = curve[i];
      const span = (b.dist - a.dist) || 1;
      const t = (target - a.dist) / span;
      let tx = a.tx + (b.tx - a.tx) * t;
      let ty = a.ty + (b.ty - a.ty) * t;
      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        tx, ty,
        nx: -ty,
        ny: tx,
        dist: target
      };
    }
  }
  return curve[curve.length - 1];
}

function buildRibbonPolygon(curve, halfWidth, wobbleAmp = 0.08, seed = 1) {
  if (!curve || curve.length < 2) return '';
  const left = [];
  const right = [];
  const p1 = (seed % 97) * 0.13;
  const p2 = (seed % 53) * 0.21;
  for (let i = 0; i < curve.length; i++) {
    const pt = curve[i];
    const d = pt.dist;
    const wL = halfWidth * (1 + wobbleAmp * Math.sin(d * 0.65 + p1) + wobbleAmp * 0.45 * Math.cos(d * 1.45 + p2));
    const wR = halfWidth * (1 + wobbleAmp * Math.cos(d * 0.58 + p2) + wobbleAmp * 0.45 * Math.sin(d * 1.32 + p1));
    left.push(`${(pt.x + pt.nx * wL).toFixed(2)},${(pt.y + pt.ny * wL).toFixed(2)}`);
    right.push(`${(pt.x - pt.nx * wR).toFixed(2)},${(pt.y - pt.ny * wR).toFixed(2)}`);
  }
  right.reverse();
  return `M ${left[0]} L ${left.slice(1).join(' L ')} L ${right.join(' L ')} Z`;
}

function buildOffsetPolyline(curve, offset, startFrac = 0, endFrac = 1) {
  if (!curve || curve.length < 2) return '';
  const total = curve[curve.length - 1].dist || 1;
  const dMin = startFrac * total;
  const dMax = endFrac * total;
  const seg = [];
  for (const pt of curve) {
    if (pt.dist >= dMin && pt.dist <= dMax) {
      seg.push(`${(pt.x + pt.nx * offset).toFixed(2)},${(pt.y + pt.ny * offset).toFixed(2)}`);
    }
  }
  if (seg.length < 2) return '';
  return `M ${seg[0]} L ${seg.slice(1).join(' L ')}`;
}

function distPointToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function pointNearPolyline(px, py, pts, threshold) {
  for (let i = 0; i < pts.length - 1; i++) {
    if (distPointToSegment(px, py, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) < threshold) {
      return true;
    }
  }
  return false;
}

function polylineIntersectsRect(pts, rx, ry, rw, rh) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    for (let s = 0; s <= 8; s++) {
      const t = s / 8;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      if (x >= rx && x <= rx + rw && y >= ry && y <= ry + rh) return true;
    }
  }
  return false;
}

// ============================================================================
// Organic SVG Terrain Rendering
// ============================================================================

function buildSmoothPath(pts) {
  if (!pts || pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) {
    return `${d} L ${pts[1].x} ${pts[1].y}`;
  }
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function buildOrganicBlobPath(w, h, seed, roughness = 0.14) {
  const rng = createRng(seed || 42);
  const rx = w / 2;
  const ry = h / 2;
  const n = 10;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const jitter = 1 + (rng() * 2 - 1) * roughness;
    pts.push({
      x: Math.cos(a) * rx * jitter,
      y: Math.sin(a) * ry * jitter
    });
  }
  let d = '';
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n];
    const curr = pts[i];
    const next = pts[(i + 1) % n];
    const mid1x = (prev.x + curr.x) / 2;
    const mid1y = (prev.y + curr.y) / 2;
    const mid2x = (curr.x + next.x) / 2;
    const mid2y = (curr.y + next.y) / 2;
    if (i === 0) d += `M ${mid1x.toFixed(2)} ${mid1y.toFixed(2)}`;
    d += ` Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}, ${mid2x.toFixed(2)} ${mid2y.toFixed(2)}`;
  }
  return d + ' Z';
}

function renderRiverCrossingsSvg(f, kindFilter, isSelected, showLabels) {
  const selCls = isSelected ? ' is-selected' : '';
  const items = (f.crossings || []).filter(c => c.kind === kindFilter);
  if (items.length === 0) return '';

  return items.map(c => {
    const halfSpan = f.widthBw / 2 + 0.34;
    if (c.kind === 'bridge') {
      const bw = c.widthBw; // 1bw deck width
      const plankCount = Math.max(5, Math.round(halfSpan * 4.5));
      let planks = '';
      for (let i = 0; i < plankCount; i++) {
        const py = -halfSpan + 0.16 + (i / (plankCount - 1)) * (halfSpan * 2 - 0.32);
        planks += `<line x1="${(-bw / 2 + 0.14).toFixed(2)}" y1="${py.toFixed(2)}" x2="${(bw / 2 - 0.14).toFixed(2)}" y2="${py.toFixed(2)}" stroke="#5c462b" stroke-width="0.06" stroke-opacity="0.55"/>`;
      }
      return `
        <g class="map-feature map-bridge${selCls}" data-feature-id="${escapeHtml(f.id)}">
          <g transform="translate(${c.x},${c.y}) rotate(${c.angle})">
            <!-- Water shadow under bridge -->
            <rect x="${(-bw / 2 + 0.14).toFixed(2)}" y="${(-halfSpan + 0.22).toFixed(2)}" width="${(bw + 0.1).toFixed(2)}" height="${(halfSpan * 2 - 0.24).toFixed(2)}" rx="0.1" fill="#0d293b" fill-opacity="0.42"/>
            <!-- Stone abutment approaches -->
            <path d="M ${(-bw / 2 - 0.22).toFixed(2)} ${(-halfSpan - 0.12).toFixed(2)} L ${(bw / 2 + 0.22).toFixed(2)} ${(-halfSpan - 0.12).toFixed(2)} L ${(bw / 2 + 0.08).toFixed(2)} ${(-halfSpan + 0.28).toFixed(2)} L ${(-bw / 2 - 0.08).toFixed(2)} ${(-halfSpan + 0.28).toFixed(2)} Z" fill="#9e927c" stroke="#3c3428" stroke-width="0.08"/>
            <path d="M ${(-bw / 2 - 0.08).toFixed(2)} ${(halfSpan - 0.28).toFixed(2)} L ${(bw / 2 + 0.08).toFixed(2)} ${(halfSpan - 0.28).toFixed(2)} L ${(bw / 2 + 0.22).toFixed(2)} ${(halfSpan + 0.12).toFixed(2)} L ${(-bw / 2 - 0.22).toFixed(2)} ${(halfSpan + 0.12).toFixed(2)} Z" fill="#9e927c" stroke="#3c3428" stroke-width="0.08"/>
            <!-- Bridge roadway deck -->
            <rect x="${(-bw / 2).toFixed(2)}" y="${(-halfSpan).toFixed(2)}" width="${bw.toFixed(2)}" height="${(halfSpan * 2).toFixed(2)}" rx="0.08" fill="#c2aa80" stroke="#453624" stroke-width="0.08"/>
            ${planks}
            <!-- Stone parapet walls + end piers -->
            <rect x="${(-bw / 2 - 0.12).toFixed(2)}" y="${(-halfSpan - 0.04).toFixed(2)}" width="0.18" height="${(halfSpan * 2 + 0.08).toFixed(2)}" rx="0.05" fill="#d8cfc0" stroke="#463e32" stroke-width="0.07"/>
            <rect x="${(bw / 2 - 0.06).toFixed(2)}" y="${(-halfSpan - 0.04).toFixed(2)}" width="0.18" height="${(halfSpan * 2 + 0.08).toFixed(2)}" rx="0.05" fill="#d8cfc0" stroke="#463e32" stroke-width="0.07"/>
            <rect x="${(-bw / 2 - 0.16).toFixed(2)}" y="${(-halfSpan - 0.1).toFixed(2)}" width="0.24" height="0.24" rx="0.04" fill="#ece4d6" stroke="#3c3428" stroke-width="0.07"/>
            <rect x="${(bw / 2 - 0.08).toFixed(2)}" y="${(-halfSpan - 0.1).toFixed(2)}" width="0.24" height="0.24" rx="0.04" fill="#ece4d6" stroke="#3c3428" stroke-width="0.07"/>
            <rect x="${(-bw / 2 - 0.16).toFixed(2)}" y="${(halfSpan - 0.14).toFixed(2)}" width="0.24" height="0.24" rx="0.04" fill="#ece4d6" stroke="#3c3428" stroke-width="0.07"/>
            <rect x="${(bw / 2 - 0.08).toFixed(2)}" y="${(halfSpan - 0.14).toFixed(2)}" width="0.24" height="0.24" rx="0.04" fill="#ece4d6" stroke="#3c3428" stroke-width="0.07"/>
          </g>
        </g>
      `;
    }

    // Ford: sandy shallow shoal + translucent wet water + river stepping stones + foam ripples
    const fw = c.widthBw;
    const rng = createRng(Math.round(c.x * 131 + c.y * 57));
    let stones = '';
    const stoneCount = Math.max(8, Math.round(fw * 5.5));
    for (let i = 0; i < stoneCount; i++) {
      const sx = ((rng() - 0.5) * (fw * 0.78)).toFixed(2);
      const sy = ((rng() - 0.5) * (f.widthBw * 0.72)).toFixed(2);
      const sr = (0.09 + rng() * 0.1).toFixed(2);
      stones += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="#d6cbb0" stroke="#5c523c" stroke-width="0.045" fill-opacity="0.92"/>`;
    }
    return `
      <g class="map-feature map-ford${selCls}" data-feature-id="${escapeHtml(f.id)}">
        <g transform="translate(${c.x},${c.y}) rotate(${c.angle})">
          <ellipse cx="0" cy="0" rx="${(fw / 2 + 0.16).toFixed(2)}" ry="${(f.widthBw / 2 + 0.12).toFixed(2)}" fill="#b39f6e" fill-opacity="0.62"/>
          <ellipse cx="0" cy="0" rx="${(fw / 2).toFixed(2)}" ry="${(f.widthBw / 2 * 0.88).toFixed(2)}" fill="#5aa8c4" fill-opacity="0.72" stroke="#e4d6ae" stroke-width="0.09" stroke-dasharray="0.32 0.24"/>
          ${stones}
          <path d="M ${(-fw * 0.36).toFixed(2)} ${(-f.widthBw * 0.22).toFixed(2)} Q 0 ${(-f.widthBw * 0.3).toFixed(2)} ${(fw * 0.36).toFixed(2)} ${(-f.widthBw * 0.2).toFixed(2)}" fill="none" stroke="#e8f8ff" stroke-width="0.09" stroke-opacity="0.82" stroke-linecap="round"/>
          <path d="M ${(-fw * 0.32).toFixed(2)} ${(f.widthBw * 0.2).toFixed(2)} Q 0 ${(f.widthBw * 0.12).toFixed(2)} ${(fw * 0.32).toFixed(2)} ${(f.widthBw * 0.24).toFixed(2)}" fill="none" stroke="#e8f8ff" stroke-width="0.09" stroke-opacity="0.82" stroke-linecap="round"/>
        </g>
      </g>
    `;
  }).join('');
}

function renderFeatureSvg(f, isSelected, showLabels) {
  const selCls = isSelected ? ' is-selected' : '';

  if (f.isRiver) {
    const curve = f.curve || sampleCatmullRom(f.pts, 14);
    const halfW = f.widthBw / 2;
    const bankOuter = buildRibbonPolygon(curve, halfW + 0.32, 0.11, f.seed + 1);
    const waterShallow = buildRibbonPolygon(curve, halfW + 0.03, 0.09, f.seed + 7);
    const waterDeep = buildRibbonPolygon(curve, halfW * 0.62, 0.07, f.seed + 19);

    // Subtle organic water flow shimmer streaks following the river curve (no rigid dashes!)
    const rng = createRng(f.seed + 41);
    let ripples = '';
    const streakCount = Math.max(6, Math.round(curve[curve.length - 1].dist / 3.2));
    for (let i = 0; i < streakCount; i++) {
      const startF = Math.min(0.92, (i + 0.15 + rng() * 0.35) / streakCount);
      const spanF = 0.05 + rng() * 0.055;
      const offset = (rng() - 0.5) * (f.widthBw * 0.46);
      const streakD = buildOffsetPolyline(curve, offset, startF, Math.min(0.98, startF + spanF));
      if (streakD) {
        ripples += `<path d="${streakD}" fill="none" stroke="#b9e6fa" stroke-width="${(0.06 + rng() * 0.05).toFixed(2)}" stroke-opacity="${(0.32 + rng() * 0.25).toFixed(2)}" stroke-linecap="round"/>`;
      }
    }

    // Scattered shoreline pebbles / reed tufts along the banks
    let bankDetails = '';
    const detailCount = Math.max(10, Math.round(curve[curve.length - 1].dist * 0.7));
    for (let i = 0; i < detailCount; i++) {
      const frac = 0.05 + (i / detailCount) * 0.9 + (rng() - 0.5) * 0.03;
      const pt = sampleCurveAtFraction(curve, frac);
      // Skip right next to crossings
      if ((f.crossings || []).some(c => Math.hypot(pt.x - c.x, pt.y - c.y) < c.widthBw * 0.8 + 0.7)) continue;
      const side = rng() < 0.5 ? 1 : -1;
      const off = (halfW + 0.18 + rng() * 0.18) * side;
      const dx = (pt.x + pt.nx * off).toFixed(2);
      const dy = (pt.y + pt.ny * off).toFixed(2);
      if (rng() < 0.55) {
        bankDetails += `<circle cx="${dx}" cy="${dy}" r="${(0.11 + rng() * 0.09).toFixed(2)}" fill="#2e6b34" fill-opacity="0.72"/>`;
      } else {
        bankDetails += `<circle cx="${dx}" cy="${dy}" r="${(0.08 + rng() * 0.07).toFixed(2)}" fill="#8d846c" fill-opacity="0.75"/>`;
      }
    }

    return `
      <g class="map-feature map-river${selCls}" data-feature-id="${escapeHtml(f.id)}">
        <path d="${bankOuter}" fill="#7c6b48" fill-opacity="0.72" stroke="#483d27" stroke-opacity="0.5" stroke-width="0.08"/>
        <path d="${waterShallow}" fill="#3b8cb5" stroke="#1f5878" stroke-width="0.1"/>
        <path d="${waterDeep}" fill="#22668f" fill-opacity="0.82"/>
        ${ripples}
        ${bankDetails}
      </g>
    `;
  }

  if (f.isRoad) {
    const curve = f.curve || sampleCatmullRom(f.pts, 12);
    const halfW = f.widthBw / 2;
    const vergePoly = buildRibbonPolygon(curve, halfW + 0.22, 0.08, f.seed + 3);
    const trackPoly = buildRibbonPolygon(curve, halfW, 0.06, f.seed + 11);
    const rutLeft = buildOffsetPolyline(curve, halfW * 0.42, 0, 1);
    const rutRight = buildOffsetPolyline(curve, -halfW * 0.42, 0, 1);

    // Subtle scattered pebbles / worn dirt speckles along the roadbed
    const rng = createRng(f.seed + 29);
    let speckles = '';
    const count = Math.max(14, Math.round(curve[curve.length - 1].dist * 1.1));
    for (let i = 0; i < count; i++) {
      const pt = sampleCurveAtFraction(curve, 0.03 + rng() * 0.94);
      const off = (rng() - 0.5) * (f.widthBw * 0.72);
      const px = (pt.x + pt.nx * off).toFixed(2);
      const py = (pt.y + pt.ny * off).toFixed(2);
      const r = (0.05 + rng() * 0.05).toFixed(2);
      const col = rng() < 0.5 ? '#755f3c' : '#e2d2ae';
      speckles += `<circle cx="${px}" cy="${py}" r="${r}" fill="${col}" fill-opacity="0.55"/>`;
    }

    return `
      <g class="map-feature map-road${selCls}" data-feature-id="${escapeHtml(f.id)}">
        <path d="${vergePoly}" fill="#6e5c39" fill-opacity="0.48"/>
        <path d="${trackPoly}" fill="#bfa574" stroke="#6d5836" stroke-opacity="0.6" stroke-width="0.08"/>
        <path d="${rutLeft}" fill="none" stroke="#8c7146" stroke-width="0.09" stroke-opacity="0.62" stroke-linecap="round"/>
        <path d="${rutRight}" fill="none" stroke="#8c7146" stroke-width="0.09" stroke-opacity="0.62" stroke-linecap="round"/>
        ${speckles}
      </g>
    `;
  }

  if (f.type === 'linear') {
    const hw = f.w / 2;
    const hh = f.h / 2; // ~0.25bw
    const rng = createRng(Math.round(f.cx * 97 + f.cy * 53 + f.w * 19 + Math.abs(f.angle) * 7));
    const kind = (f.name || '').toLowerCase();
    let linearSvg = '';

    if (kind.includes('hedge')) {
      // Dense leafy medieval hedgerow with layered foliage clusters & ground shadow
      let shadowPuffs = '';
      let basePuffs = '';
      let midPuffs = '';
      let topPuffs = '';
      const count = Math.max(7, Math.round(f.w * 3.1));
      for (let i = 0; i < count; i++) {
        const u = i / (count - 1);
        const px = -hw + 0.18 + u * (f.w - 0.36) + (rng() - 0.5) * 0.14;
        const py = (rng() - 0.5) * 0.12;
        const r = 0.27 + rng() * 0.12;
        shadowPuffs += `<circle cx="${(px + 0.08).toFixed(2)}" cy="${(py + 0.12).toFixed(2)}" r="${(r + 0.03).toFixed(2)}" fill="#162912" fill-opacity="0.45"/>`;
        basePuffs += `<circle cx="${px.toFixed(2)}" cy="${py.toFixed(2)}" r="${r.toFixed(2)}" fill="#235424" stroke="#143315" stroke-width="0.06"/>`;
        midPuffs += `<circle cx="${(px - 0.04).toFixed(2)}" cy="${(py - 0.04).toFixed(2)}" r="${(r * 0.72).toFixed(2)}" fill="#387a34"/>`;
        if (rng() < 0.75) {
          topPuffs += `<circle cx="${(px - 0.07).toFixed(2)}" cy="${(py - 0.07).toFixed(2)}" r="${(r * 0.38).toFixed(2)}" fill="#62ab4b" fill-opacity="0.85"/>`;
        }
        if (rng() < 0.25) {
          topPuffs += `<circle cx="${(px + 0.08).toFixed(2)}" cy="${(py - 0.04).toFixed(2)}" r="0.05" fill="#e6cf6a" fill-opacity="0.9"/>`;
        }
      }
      linearSvg = `${shadowPuffs}${basePuffs}${midPuffs}${topPuffs}`;
    } else if (kind.includes('fence') || kind.includes('timber')) {
      // Wooden post-and-rail fence with worn earth strip, twin rails, and spaced timber posts
      const postCount = Math.max(4, Math.round(f.w * 1.35) + 1);
      let posts = '';
      for (let i = 0; i < postCount; i++) {
        const px = -hw + 0.14 + (i / (postCount - 1)) * (f.w - 0.28);
        posts += `
          <circle cx="${(px + 0.06).toFixed(2)}" cy="0.08" r="0.16" fill="#1b140b" fill-opacity="0.42"/>
          <rect x="${(px - 0.12).toFixed(2)}" y="-0.15" width="0.24" height="0.30" rx="0.05" fill="#6b4724" stroke="#2d1c0c" stroke-width="0.055"/>
          <rect x="${(px - 0.07).toFixed(2)}" y="-0.10" width="0.12" height="0.14" rx="0.03" fill="#b88a56" fill-opacity="0.85"/>
        `;
      }
      linearSvg = `
        <rect x="${(-hw - 0.06).toFixed(2)}" y="-0.22" width="${(f.w + 0.12).toFixed(2)}" height="0.46" rx="0.2" fill="#5e4d2e" fill-opacity="0.38"/>
        <line x1="${(-hw + 0.12).toFixed(2)}" y1="0.09" x2="${(hw - 0.12).toFixed(2)}" y2="0.09" stroke="#1c140b" stroke-opacity="0.38" stroke-width="0.22" stroke-linecap="round"/>
        <line x1="${(-hw + 0.12).toFixed(2)}" y1="-0.08" x2="${(hw - 0.12).toFixed(2)}" y2="-0.08" stroke="#996d3f" stroke-width="0.11" stroke-linecap="round"/>
        <line x1="${(-hw + 0.12).toFixed(2)}" y1="0.07" x2="${(hw - 0.12).toFixed(2)}" y2="0.07" stroke="#855b31" stroke-width="0.11" stroke-linecap="round"/>
        <line x1="${(-hw + 0.14).toFixed(2)}" y1="-0.10" x2="${(hw - 0.14).toFixed(2)}" y2="-0.10" stroke="#cca06a" stroke-opacity="0.7" stroke-width="0.04"/>
        ${posts}
      `;
    } else if (kind.includes('dike') || kind.includes('ditch')) {
      // Earthen dike: shaded sunken ditch + raised grassy-earth embankment berm with slope ticks
      let ticks = '';
      const tickCount = Math.max(8, Math.round(f.w * 2.8));
      for (let i = 0; i < tickCount; i++) {
        const tx = -hw + 0.25 + (i / (tickCount - 1)) * (f.w - 0.5);
        ticks += `<line x1="${tx.toFixed(2)}" y1="-0.05" x2="${tx.toFixed(2)}" y2="0.22" stroke="#42351f" stroke-opacity="0.45" stroke-width="0.05"/>`;
      }
      linearSvg = `
        <rect x="${(-hw - 0.08).toFixed(2)}" y="-0.32" width="${(f.w + 0.16).toFixed(2)}" height="0.64" rx="0.26" fill="#4f4228" fill-opacity="0.62"/>
        <rect x="${(-hw).toFixed(2)}" y="0.02" width="${f.w.toFixed(2)}" height="0.24" rx="0.11" fill="#3a301c" fill-opacity="0.82"/>
        <rect x="${(-hw - 0.02).toFixed(2)}" y="-0.24" width="${(f.w + 0.04).toFixed(2)}" height="0.28" rx="0.14" fill="#9a8759" stroke="#574a2c" stroke-width="0.06"/>
        <line x1="${(-hw + 0.18).toFixed(2)}" y1="-0.12" x2="${(hw - 0.18).toFixed(2)}" y2="-0.12" stroke="#c7b585" stroke-width="0.09" stroke-linecap="round" stroke-opacity="0.82"/>
        ${ticks}
      `;
    } else {
      // Dry-stone medieval wall: shadow + mortar footing + individual irregular stone blocks + moss tufts
      const palette = ['#b8b1a0', '#9f9888', '#cbc4b4', '#8b8475', '#d6d0c2'];
      let blocks = '';
      let cursor = -hw + 0.08;
      while (cursor < hw - 0.14) {
        const bw = Math.min(hw - 0.06 - cursor, 0.34 + rng() * 0.26);
        const bh = 0.28 + rng() * 0.12;
        const by = -bh / 2 + (rng() - 0.5) * 0.06;
        const col = palette[randInt(rng, 0, palette.length - 1)];
        blocks += `<rect x="${cursor.toFixed(2)}" y="${by.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="0.07" fill="${col}" stroke="#3e392f" stroke-width="0.055"/>`;
        if (rng() < 0.28) {
          blocks += `<circle cx="${(cursor + bw * 0.4).toFixed(2)}" cy="${(by + 0.04).toFixed(2)}" r="0.065" fill="#4f7a38" fill-opacity="0.72"/>`;
        }
        cursor += bw - 0.02;
      }
      linearSvg = `
        <rect x="${(-hw + 0.06).toFixed(2)}" y="${(-hh + 0.10).toFixed(2)}" width="${f.w.toFixed(2)}" height="${(f.h + 0.04).toFixed(2)}" rx="0.16" fill="#181b12" fill-opacity="0.44"/>
        <rect x="${(-hw - 0.04).toFixed(2)}" y="${(-hh - 0.03).toFixed(2)}" width="${(f.w + 0.08).toFixed(2)}" height="${(f.h + 0.06).toFixed(2)}" rx="0.16" fill="#5e5749" fill-opacity="0.78"/>
        ${blocks}
        <rect x="${(-hw - 0.06).toFixed(2)}" y="-0.22" width="0.24" height="0.44" rx="0.06" fill="#cfc9b8" stroke="#36322a" stroke-width="0.06"/>
        <rect x="${(hw - 0.18).toFixed(2)}" y="-0.22" width="0.24" height="0.44" rx="0.06" fill="#cfc9b8" stroke="#36322a" stroke-width="0.06"/>
      `;
    }

    return `
      <g class="map-feature map-linear${selCls}" data-feature-id="${escapeHtml(f.id)}" transform="translate(${f.cx},${f.cy}) rotate(${f.angle})">
        ${linearSvg}
      </g>
    `;
  }

  // Area features
  const outerBlob = buildOrganicBlobPath(f.w, f.h, f.blobSeed, f.type === 'impassable' ? 0.22 : 0.14);
  let innerSvg = '';

  if (f.type === 'hill') {
    const midBlob = buildOrganicBlobPath(f.w * 0.68, f.h * 0.66, f.blobSeed + 7, 0.12);
    const crestBlob = buildOrganicBlobPath(f.w * 0.38, f.h * 0.36, f.blobSeed + 19, 0.1);
    innerSvg = `
      <path d="${outerBlob}" fill="#9c8954" fill-opacity="0.72" stroke="#5e4e27" stroke-width="0.15"/>
      <path d="${midBlob}" fill="#b39f64" fill-opacity="0.78" stroke="#6e5c31" stroke-width="0.12"/>
      <path d="${crestBlob}" fill="#cbb77a" fill-opacity="0.88" stroke="#7d6936" stroke-width="0.12"/>
    `;
  } else if (f.type === 'wood') {
    const rng = createRng(f.blobSeed + 31);
    const treeCount = Math.max(4, Math.min(10, Math.round(f.w * f.h * 0.45)));
    let trees = '';
    for (let i = 0; i < treeCount; i++) {
      const tx = (rng() - 0.5) * (f.w * 0.62);
      const ty = (rng() - 0.5) * (f.h * 0.58);
      const tr = 0.42 + rng() * 0.32;
      trees += `<circle cx="${tx.toFixed(2)}" cy="${ty.toFixed(2)}" r="${tr.toFixed(2)}" fill="#236630" stroke="#143d1c" stroke-width="0.1"/>`;
      trees += `<circle cx="${(tx - 0.08).toFixed(2)}" cy="${(ty - 0.08).toFixed(2)}" r="${(tr * 0.52).toFixed(2)}" fill="#3d994e" fill-opacity="0.75"/>`;
    }
    innerSvg = `
      <path d="${outerBlob}" fill="#2b6e38" fill-opacity="0.58" stroke="#184521" stroke-width="0.16"/>
      ${trees}
    `;
  } else if (f.type === 'rough') {
    const rng = createRng(f.blobSeed + 53);
    const dots = [];
    const count = Math.max(5, Math.min(14, Math.round(f.w * f.h * 0.7)));
    for (let i = 0; i < count; i++) {
      const rx = ((rng() - 0.5) * f.w * 0.65).toFixed(2);
      const ry = ((rng() - 0.5) * f.h * 0.6).toFixed(2);
      const rad = (0.14 + rng() * 0.16).toFixed(2);
      dots.push(`<circle cx="${rx}" cy="${ry}" r="${rad}" fill="#594525" fill-opacity="0.7"/>`);
    }
    innerSvg = `
      <path d="${outerBlob}" fill="#9c804e" fill-opacity="0.62" stroke="#5e4926" stroke-width="0.15" stroke-dasharray="0.45 0.25"/>
      ${dots.join('')}
    `;
  } else if (f.type === 'water') {
    const innerBlob = buildOrganicBlobPath(f.w * 0.62, f.h * 0.58, f.blobSeed + 11, 0.12);
    innerSvg = `
      <path d="${outerBlob}" fill="#2b7da8" fill-opacity="0.76" stroke="#174966" stroke-width="0.16"/>
      <path d="${innerBlob}" fill="#54a9d4" fill-opacity="0.52"/>
    `;
  } else if (f.type === 'settlement') {
    // 3-4 tiny pitched-roof cottages inside a village boundary
    const houses = [
      { x: -f.w * 0.22, y: -f.h * 0.14, w: 0.9, h: 0.65, r: -8 },
      { x: f.w * 0.16, y: -f.h * 0.1, w: 0.85, h: 0.6, r: 12 },
      { x: -0.1, y: f.h * 0.18, w: 0.95, h: 0.62, r: 5 }
    ].map(hs => `
      <g transform="translate(${hs.x.toFixed(2)},${hs.y.toFixed(2)}) rotate(${hs.r})">
        <rect x="${-hs.w / 2}" y="${-hs.h / 2}" width="${hs.w}" height="${hs.h}" fill="#a84832" stroke="#3a1c14" stroke-width="0.1"/>
        <line x1="${-hs.w / 2}" y1="0" x2="${hs.w / 2}" y2="0" stroke="#e6c4a8" stroke-width="0.09"/>
      </g>
    `).join('');
    innerSvg = `
      <path d="${outerBlob}" fill="#a68a63" fill-opacity="0.68" stroke="#5c4228" stroke-width="0.15" stroke-dasharray="0.35 0.2"/>
      ${houses}
    `;
  } else if (f.type === 'impassable') {
    const cragInner = buildOrganicBlobPath(f.w * 0.56, f.h * 0.54, f.blobSeed + 23, 0.25);
    innerSvg = `
      <path d="${outerBlob}" fill="#52565e" fill-opacity="0.88" stroke="#1e2024" stroke-width="0.18"/>
      <path d="${cragInner}" fill="#777c87" fill-opacity="0.8" stroke="#2c2f36" stroke-width="0.12"/>
      <line x1="${-f.w * 0.2}" y1="${-f.h * 0.15}" x2="${f.w * 0.22}" y2="${f.h * 0.18}" stroke="#c2c7d1" stroke-width="0.11" stroke-opacity="0.65"/>
    `;
  }

  return `
    <g class="map-feature map-${escapeHtml(f.type)}${selCls}" data-feature-id="${escapeHtml(f.id)}" transform="translate(${f.cx},${f.cy}) rotate(${f.angle})">
      ${innerSvg}
    </g>
  `;
}

function renderAllLabelsSvg(bf) {
  const { width, height } = bf;
  const clampX = x => Math.max(2.4, Math.min(width - 2.4, x)).toFixed(2);
  const clampY = y => Math.max(1.15, Math.min(height - 0.75, y)).toFixed(2);
  const out = [];

  for (const f of bf.features) {
    if (f.isRiver) {
      const halfSpan = f.widthBw / 2 + 0.34;
      for (const c of f.crossings || []) {
        const txt = c.kind === 'bridge' ? `Bridge (${c.widthBw}bw)` : `Ford (${c.widthBw}bw)`;
        out.push(`<text x="${clampX(c.x)}" y="${clampY(c.y - halfSpan - 0.32)}" text-anchor="middle" class="map-label">${escapeHtml(txt)}</text>`);
      }
    } else if (f.isRoad) {
      const lp = f.labelPt || sampleCurveAtFraction(f.curve || [], 0.22);
      out.push(`<text x="${clampX(lp.x)}" y="${clampY(lp.y - 0.55)}" text-anchor="middle" class="map-label">Road</text>`);
    } else if (f.type === 'linear') {
      const rad = (f.angle || 0) * Math.PI / 180;
      const topClear = Math.abs(Math.sin(rad)) * (f.w / 2) + 0.58;
      out.push(`<text x="${clampX(f.cx)}" y="${clampY(f.cy - topClear)}" text-anchor="middle" class="map-label">${escapeHtml(f.name)} (${f.w}bw)</text>`);
    } else {
      const lx = clampX(f.cx);
      const ly = clampY(f.cy);
      out.push(`<text x="${lx}" y="${ly}" text-anchor="middle" class="map-label">${escapeHtml(f.name)}</text>`);
      out.push(`<text x="${lx}" y="${(parseFloat(ly) + 0.75).toFixed(2)}" text-anchor="middle" class="map-sublabel">${f.w}×${f.h}bw</text>`);
    }
  }
  return `<g class="map-labels" pointer-events="none">${out.join('')}</g>`;
}

export function renderBattlefieldSvg(bf, settings) {
  const { width, height, cols, rows } = bf;
  const colLetters = ['A', 'B', 'C'];

  // 10x10bw sector grid + 5bw subtle guides + crisp 2bw border ticks + high-contrast sector labels
  let gridSvg = '';
  if (settings.showGrid) {
    const lines = [];
    // Subtle 5bw half-sector guide lines
    for (let x = 5; x < width; x += 10) {
      lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#ffffff" stroke-opacity="0.16" stroke-width="0.08" stroke-dasharray="0.3 0.35"/>`);
    }
    for (let y = 5; y < height; y += 10) {
      lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#ffffff" stroke-opacity="0.16" stroke-width="0.08" stroke-dasharray="0.3 0.35"/>`);
    }
    // Primary 10x10bw sector boundaries with subtle dark backing for clear contrast over all terrain
    for (let x = 10; x < width; x += 10) {
      lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#0d120a" stroke-opacity="0.42" stroke-width="0.22"/>`);
      lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#f5f0d5" stroke-opacity="0.78" stroke-width="0.13" stroke-dasharray="0.55 0.32"/>`);
    }
    for (let y = 10; y < height; y += 10) {
      lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#0d120a" stroke-opacity="0.42" stroke-width="0.22"/>`);
      lines.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#f5f0d5" stroke-opacity="0.78" stroke-width="0.13" stroke-dasharray="0.55 0.32"/>`);
    }
    // Crisp 2bw border tick marks (longer at 5bw marks)
    for (let x = 2; x < width; x += 2) {
      const len = x % 10 === 0 ? 0.65 : 0.42;
      lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${len}" stroke="#f5f0d5" stroke-opacity="0.62" stroke-width="0.1"/>`);
      lines.push(`<line x1="${x}" y1="${height}" x2="${x}" y2="${height - len}" stroke="#f5f0d5" stroke-opacity="0.62" stroke-width="0.1"/>`);
    }
    for (let y = 2; y < height; y += 2) {
      const len = y % 10 === 0 ? 0.65 : 0.42;
      lines.push(`<line x1="0" y1="${y}" x2="${len}" y2="${y}" stroke="#f5f0d5" stroke-opacity="0.62" stroke-width="0.1"/>`);
      lines.push(`<line x1="${width}" y1="${y}" x2="${width - len}" y2="${y}" stroke="#f5f0d5" stroke-opacity="0.62" stroke-width="0.1"/>`);
    }
    const labels = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        labels.push(`<text x="${c * 10 + 0.62}" y="${r * 10 + 1.28}" class="map-sector-tag">${colLetters[c]}${r + 1}</text>`);
      }
    }
    gridSvg = `<g class="map-grid">${lines.join('')}${labels.join('')}</g>`;
  }

  // Optional Pitched Battle deployment zones (v1.1 p. 22)
  // Defender: 6bw deep, 2bw from side edges. Attacker: 4bw deep, 4bw from side edges. 10bw gap between.
  let deploySvg = '';
  if (settings.showDeployment) {
    deploySvg = `
      <g class="map-deploy-zones" pointer-events="none">
        <rect x="2" y="0" width="${width - 4}" height="6" fill="#2e7ba8" fill-opacity="0.18" stroke="#6cc2f0" stroke-width="0.14" stroke-dasharray="0.5 0.3"/>
        <text x="${width / 2}" y="5.58" text-anchor="middle" class="map-deploy-label">Defender Deployment (6bw deep · 2bw side margin)</text>

        <rect x="4" y="${height - 4}" width="${width - 8}" height="4" fill="#c94a38" fill-opacity="0.18" stroke="#ff8675" stroke-width="0.14" stroke-dasharray="0.5 0.3"/>
        <text x="${width / 2}" y="${height - 0.6}" text-anchor="middle" class="map-deploy-label">Attacker Deployment (4bw deep · 4bw side margin)</text>
      </g>
    `;
  }

  // Layered draw order inside table clip:
  // 1) River water & banks  2) Dirt/wagon road  3) Fords (wet shallow crossing over road/river)
  // 4) Stone bridges (above road & river)  5) Area features  6) Linear features
  // 7) Labels on top (unclipped & clamped within margins so nothing overlaps or cuts off text)
  const rivers = bf.features.filter(f => f.isRiver);
  const roads = bf.features.filter(f => f.isRoad);
  const areas = bf.features.filter(f => !f.isRiver && !f.isRoad && f.type !== 'linear');
  const linears = bf.features.filter(f => f.type === 'linear');

  const riversSvg = rivers.map(f => renderFeatureSvg(f, f.id === settings.selectedFeatureId, false)).join('');
  const roadsSvg = roads.map(f => renderFeatureSvg(f, f.id === settings.selectedFeatureId, false)).join('');
  const fordsSvg = rivers.map(f => renderRiverCrossingsSvg(f, 'ford', f.id === settings.selectedFeatureId, false)).join('');
  const bridgesSvg = rivers.map(f => renderRiverCrossingsSvg(f, 'bridge', f.id === settings.selectedFeatureId, false)).join('');
  const areasSvg = areas.map(f => renderFeatureSvg(f, f.id === settings.selectedFeatureId, false)).join('');
  const linearsSvg = linears.map(f => renderFeatureSvg(f, f.id === settings.selectedFeatureId, false)).join('');
  const labelsSvg = settings.showLabels ? renderAllLabelsSvg(bf) : '';

  return `
    <svg class="battlefield-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generated ${width} by ${height} base-width battlefield terrain map">
      <defs>
        <radialGradient id="fbMatGrad" cx="50%" cy="50%" r="72%">
          <stop offset="0%" stop-color="#5a7545"/>
          <stop offset="100%" stop-color="#425832"/>
        </radialGradient>
        <clipPath id="fbTableClip">
          <rect x="0" y="0" width="${width}" height="${height}"/>
        </clipPath>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#fbMatGrad)"/>
      <g clip-path="url(#fbTableClip)">
        ${riversSvg}
        ${roadsSvg}
        ${fordsSvg}
        ${bridgesSvg}
        ${areasSvg}
        ${linearsSvg}
      </g>
      ${gridSvg}
      ${labelsSvg}
      ${deploySvg}
      <rect x="0.08" y="0.08" width="${width - 0.16}" height="${height - 0.16}" fill="none" stroke="#decb01" stroke-opacity="0.55" stroke-width="0.18"/>
    </svg>
  `;
}

// ============================================================================
// UI Renderers: Compendium Terrain Tab + Battlefield Generator Modal
// ============================================================================

export function renderTerrainCompendiumHtml(searchQuery = '') {
  const q = searchQuery.trim().toLowerCase();
  const items = TERRAIN_RULES.filter(t =>
    !q
    || t.name.toLowerCase().includes(q)
    || t.summary.toLowerCase().includes(q)
    || t.notes.toLowerCase().includes(q)
    || t.mov.toLowerCase().includes(q)
    || t.mel.toLowerCase().includes(q)
    || t.sht.toLowerCase().includes(q)
  );

  const setupBanner = !q ? `
    <div class="terrain-setup-banner">
      <div class="terrain-setup-head">
        <div>
          <strong>Tabletop Setup Guidelines</strong>
          <span style="font-size:11.5px; color:var(--text-muted); margin-left:6px;">(Fantastic Battles v1.1 p. 19)</span>
        </div>
        <button type="button" class="btn btn-sm btn-primary" data-action="open-terrain-gen-from-ref">
          🗺️ Launch Map Generator
        </button>
      </div>
      <div class="terrain-setup-grid">
        ${TERRAIN_SETUP_GUIDE.map(g => `
          <div class="terrain-setup-item">
            <span class="terrain-setup-label">${escapeHtml(g.label)}</span>
            <span class="terrain-setup-val">${escapeHtml(g.value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  const cards = items.map(t => `
    <div class="ref-card terrain-ref-card" style="border-left: 4px solid ${t.color};">
      <div class="ref-card-head">
        <span class="ref-card-title">
          ${escapeHtml(t.name)}
          <span style="font-size:11.5px; color:var(--text-muted); font-weight:500;">(${escapeHtml(t.category)})</span>
        </span>
        <span class="ref-card-cost" style="color:var(--text-muted); font-weight:600;">${escapeHtml(t.pageRef)}</span>
      </div>
      <div class="terrain-mod-strip">
        <span><strong>Mov:</strong> ${escapeHtml(t.mov)}</span>
        <span><strong>Mel:</strong> ${escapeHtml(t.mel)}</span>
        <span><strong>Sht:</strong> ${escapeHtml(t.sht)}</span>
        <span><strong>LoS:</strong> ${escapeHtml(t.los)}</span>
      </div>
      <div class="ref-card-body">${escapeHtml(t.summary)}</div>
      <div class="terrain-ref-note">${escapeHtml(t.notes)}</div>
    </div>
  `).join('');

  return setupBanner + (cards || `<div style="padding:24px; text-align:center; color:var(--text-muted);">No terrain rules match "${escapeHtml(searchQuery)}".</div>`);
}

export function renderTerrainModalHtml() {
  const s = getTerrainState();
  const bf = generateBattlefield(s);
  const selected = bf.features.find(f => f.id === s.selectedFeatureId) || null;
  const selectedRule = selected ? TERRAIN_RULE_MAP[selected.type] : null;

  const openOk = bf.openPct >= 50;
  const countedFeatures = bf.features.filter(f => !f.isRoad).length;
  const controlsOpenCls = mobileControlsOpen ? ' mobile-controls-open' : '';

  const inspectorHtml = selected && selectedRule
    ? `
      <div class="terrain-inspector active" style="border-left: 4px solid ${selectedRule.color};">
        <div class="terrain-inspector-head">
          <div>
            <strong>${escapeHtml(selected.name)}</strong>
            <span class="terrain-inspector-meta">${escapeHtml(selectedRule.name)} &middot; ${escapeHtml(selected.dimText)} &middot; Sector ${escapeHtml(selected.sector)}</span>
          </div>
          <span class="panel-badge">${escapeHtml(selectedRule.pageRef)}</span>
        </div>
        <div class="terrain-mod-strip">
          <span><strong>Mov:</strong> ${escapeHtml(selectedRule.mov)}</span>
          <span><strong>Mel:</strong> ${escapeHtml(selectedRule.mel)}</span>
          <span><strong>Sht:</strong> ${escapeHtml(selectedRule.sht)}</span>
          <span><strong>LoS:</strong> ${escapeHtml(selectedRule.los)}</span>
        </div>
        <div class="terrain-inspector-body">${escapeHtml(selectedRule.summary)} <span style="color:var(--text-muted);">${escapeHtml(selectedRule.notes)}</span></div>
      </div>
    `
    : `
      <div class="terrain-inspector">
        <span style="color:var(--text-secondary); font-size:12.5px;">
          💡 <strong>Tip:</strong> Tap any terrain feature on the map or chips to view its <strong>Mov / Mel / Sht / LoS</strong> modifiers.
        </span>
      </div>
    `;

  const featureChipsHtml = bf.features.map(f => {
    const rule = TERRAIN_RULE_MAP[f.type];
    const isSel = f.id === s.selectedFeatureId;
    return `
      <button type="button" class="terrain-feature-chip${isSel ? ' active' : ''}" data-terrain-action="select-feature" data-feature-id="${escapeHtml(f.id)}">
        <span class="terrain-dot" style="background:${rule?.color || '#888'};"></span>
        <span class="terrain-chip-name">${escapeHtml(f.name)}</span>
        <span class="terrain-chip-meta">${escapeHtml(f.sector)} · ${escapeHtml(f.isRiver || f.isRoad ? (f.isRiver ? `${f.widthBw}bw` : '≤1bw') : f.dimText)}</span>
      </button>
    `;
  }).join('');

  return `
    <div class="terrain-gen-root${controlsOpenCls}">
      <!-- Compact 1-Row Mobile Action Bar (visible <= 768px) -->
      <div class="terrain-mobile-bar">
        <button type="button" class="btn btn-sm btn-primary terrain-mobile-gen-btn" data-terrain-action="reroll">
          🎲 Generate
        </button>
        <button type="button" class="btn btn-sm terrain-mobile-opt-btn" data-terrain-action="toggle-mobile-controls" aria-expanded="${String(mobileControlsOpen)}">
          <span>${s.tableSize === '20x20' ? '20×20' : '30×20'} · ${escapeHtml(bf.biome.name)}</span>
          <span>${mobileControlsOpen ? '▴' : '▾'}</span>
        </button>
      </div>

      <div class="terrain-controls-bar">
        <div class="terrain-control-group">
          <label class="terrain-ctrl-label">Table Size</label>
          <div class="segmented">
            <button type="button" class="${s.tableSize === '30x20' ? 'active' : ''}" data-terrain-action="set-size" data-value="30x20">30×20 bw</button>
            <button type="button" class="${s.tableSize === '20x20' ? 'active' : ''}" data-terrain-action="set-size" data-value="20x20">20×20 bw</button>
          </div>
        </div>

        <div class="terrain-control-group">
          <label class="terrain-ctrl-label" for="terrainBiomeSelect">Region / Biome</label>
          <select id="terrainBiomeSelect" class="select terrain-select" data-terrain-select="biome">
            ${BIOMES.map(b => `<option value="${b.id}" ${s.biome === b.id ? 'selected' : ''}>${escapeHtml(b.name)}</option>`).join('')}
          </select>
        </div>

        <div class="terrain-control-group">
          <label class="terrain-ctrl-label" for="terrainDensitySelect">Density</label>
          <select id="terrainDensitySelect" class="select terrain-select" data-terrain-select="density">
            <option value="sparse" ${s.density === 'sparse' ? 'selected' : ''}>Sparse (1–2/sq)</option>
            <option value="standard" ${s.density === 'standard' ? 'selected' : ''}>Standard (1–3/sq)</option>
            <option value="dense" ${s.density === 'dense' ? 'selected' : ''}>Dense (2–3/sq)</option>
          </select>
        </div>

        <div class="terrain-control-group">
          <label class="terrain-ctrl-label" for="terrainRiverSelect">River</label>
          <select id="terrainRiverSelect" class="select terrain-select" data-terrain-select="riverMode">
            <option value="auto" ${s.riverMode === 'auto' ? 'selected' : ''}>Auto</option>
            <option value="yes" ${s.riverMode === 'yes' ? 'selected' : ''}>Yes</option>
            <option value="no" ${s.riverMode === 'no' ? 'selected' : ''}>No</option>
          </select>
        </div>

        <div class="terrain-control-group">
          <label class="terrain-ctrl-label" for="terrainRoadSelect">Road</label>
          <select id="terrainRoadSelect" class="select terrain-select" data-terrain-select="roadMode">
            <option value="auto" ${s.roadMode === 'auto' ? 'selected' : ''}>Auto</option>
            <option value="yes" ${s.roadMode === 'yes' ? 'selected' : ''}>Yes</option>
            <option value="no" ${s.roadMode === 'no' ? 'selected' : ''}>No</option>
          </select>
        </div>

        <div class="terrain-control-actions">
          <button type="button" class="btn btn-primary" data-terrain-action="reroll">
            🎲 Generate Map
          </button>
        </div>
      </div>

      <div class="terrain-meta-strip">
        <div class="terrain-badges">
          <span class="terrain-stat-pill ${openOk ? 'ok' : 'warn'}" title="Rulebook recommends at least 50% open ground">
            ${openOk ? '✓' : '!'} ${bf.openPct}% Open<span class="hide-xs"> Ground</span>
          </span>
          <span class="terrain-stat-pill">
            ${countedFeatures} Feat.<span class="hide-xs"> (${bf.cols * bf.rows} sectors)</span>
          </span>
          <span class="terrain-stat-pill mono hide-xs">Seed #${s.seed}</span>
        </div>
        <div class="terrain-toggles">
          <label class="terrain-chk terrain-chk-secondary">
            <input type="checkbox" data-terrain-toggle="showGrid" ${s.showGrid ? 'checked' : ''} />
            <span>Grid</span>
          </label>
          <label class="terrain-chk">
            <input type="checkbox" data-terrain-toggle="showDeployment" ${s.showDeployment ? 'checked' : ''} />
            <span>Zones</span>
          </label>
          <label class="terrain-chk terrain-chk-secondary">
            <input type="checkbox" data-terrain-toggle="showLabels" ${s.showLabels ? 'checked' : ''} />
            <span>Labels</span>
          </label>
        </div>
      </div>

      <div class="terrain-workspace">
        <div class="terrain-map-frame">
          <div class="terrain-ruler-top">${bf.width}bw &times; ${bf.height}bw Tabletop (${escapeHtml(bf.biome.name)})</div>
          ${renderBattlefieldSvg(bf, s)}
          <div class="terrain-legend">
            ${['hill', 'wood', 'rough', 'water', 'settlement', 'impassable', 'linear', 'road'].map(id => {
              const r = TERRAIN_RULE_MAP[id];
              return `<span class="terrain-legend-item"><span class="terrain-dot" style="background:${r.color};"></span>${escapeHtml(r.name.replace(' Features', '').replace(' Terrain', ''))}</span>`;
            }).join('')}
          </div>
        </div>

        <div class="terrain-side-panel">
          ${inspectorHtml}

          <div class="terrain-feature-list-wrap">
            <div class="terrain-feature-list-head">
              <strong>Placed Features (${bf.features.length})</strong>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="btn btn-sm" data-terrain-action="copy-layout">Copy Text</button>
                <button type="button" class="btn btn-sm" data-terrain-action="open-terrain-rules">Terrain Rules</button>
              </div>
            </div>
            <div class="terrain-feature-chips">${featureChipsHtml}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function exportTerrainLayoutText() {
  const s = getTerrainState();
  const bf = generateBattlefield(s);
  const lines = [
    `Fantastic Battles — Battlefield Terrain Setup`,
    `Table: ${bf.width}×${bf.height}bw (${bf.biome.name}, ${s.density}) | Open Ground: ${bf.openPct}% | Seed #${s.seed}`,
    `--------------------------------------------------`
  ];
  for (const f of bf.features) {
    const rule = TERRAIN_RULE_MAP[f.type];
    lines.push(`• [${f.sector}] ${f.name} (${rule?.name || f.type}) — ${f.dimText}`);
  }
  return lines.join('\n');
}

export function handleTerrainClick(target) {
  const s = getTerrainState();

  // SVG feature click
  const svgFeat = target.closest('.map-feature[data-feature-id]');
  if (svgFeat) {
    const fid = svgFeat.dataset.featureId;
    s.selectedFeatureId = s.selectedFeatureId === fid ? null : fid;
    saveTerrainState();
    return { rerender: true };
  }

  const btn = target.closest('[data-terrain-action]');
  if (!btn) return { rerender: false };

  const action = btn.dataset.terrainAction;
  if (action === 'toggle-mobile-controls') {
    mobileControlsOpen = !mobileControlsOpen;
    return { rerender: true };
  }
  if (action === 'reroll') {
    s.seed = Math.floor(Math.random() * 900000) + 100000;
    s.selectedFeatureId = null;
    saveTerrainState();
    return { rerender: true };
  }
  if (action === 'set-size') {
    s.tableSize = btn.dataset.value === '20x20' ? '20x20' : '30x20';
    s.selectedFeatureId = null;
    saveTerrainState();
    return { rerender: true };
  }
  if (action === 'select-feature') {
    const fid = btn.dataset.featureId;
    s.selectedFeatureId = s.selectedFeatureId === fid ? null : fid;
    saveTerrainState();
    return { rerender: true };
  }
  if (action === 'copy-layout') {
    return { rerender: false, copyText: exportTerrainLayoutText() };
  }
  if (action === 'open-terrain-rules') {
    return { rerender: false, openTerrainRules: true };
  }
  return { rerender: false };
}

export function handleTerrainChange(target) {
  const s = getTerrainState();
  if (target.dataset.terrainSelect) {
    const key = target.dataset.terrainSelect;
    s[key] = target.value;
    s.selectedFeatureId = null;
    saveTerrainState();
    return true;
  }
  if (target.dataset.terrainToggle) {
    const key = target.dataset.terrainToggle;
    s[key] = Boolean(target.checked);
    saveTerrainState();
    return true;
  }
  return false;
}
