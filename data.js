// Fantastic Battles — Complete Ruleset Data & Faction Presets
// Based on Fantastic Battles & Mike Wilson's Army Builder Spreadsheet (2020)

export const BASE_PROFILES = [
  // Standalone Characters
  {
    id: 'Warlord',
    name: 'Warlord',
    category: 'character',
    characterRole: 'Lord',
    res: 2, mov: 4, mel: 2, shtShort: 0, shtLong: 0, def: 6, com: 3,
    cost: 60,
    allowTraits: false,
    allowRelic: true,
    isMage: false,
    limitNote: 'Max 1 Warlord or Mage-lord per army'
  },
  {
    id: 'Mage-lord',
    name: 'Mage-lord',
    category: 'character',
    characterRole: 'Lord',
    res: 2, mov: 4, mel: 1, shtShort: 0, shtLong: 0, def: 6, com: 3,
    cost: 75,
    allowTraits: false,
    allowRelic: true,
    isMage: true,
    limitNote: 'Max 1 Warlord or Mage-lord per army'
  },
  {
    id: 'Captain',
    name: 'Captain',
    category: 'character',
    characterRole: 'Captain',
    res: 1, mov: 4, mel: 1, shtShort: 0, shtLong: 0, def: 5, com: 2,
    cost: 25,
    allowTraits: false,
    allowRelic: true,
    isMage: false,
    limitNote: 'Up to 3 per 500 points'
  },
  {
    id: 'Magic-user',
    name: 'Magic-user',
    category: 'character',
    characterRole: 'Magic-user',
    res: 1, mov: 4, mel: 1, shtShort: 0, shtLong: 0, def: 5, com: 0,
    cost: 40,
    allowTraits: false,
    allowRelic: true,
    isMage: true,
    limitNote: 'Up to 1 per 500 points'
  },
  {
    id: 'Rogue',
    name: 'Rogue',
    category: 'character',
    characterRole: 'Rogue',
    res: 1, mov: 4, mel: 1, shtShort: 0, shtLong: 0, def: 6, com: 0,
    cost: 25,
    allowTraits: false,
    allowRelic: true,
    isMage: false,
    limitNote: '0–1 (or 0–2 with Cloaks and Daggers)'
  },
  // Companies
  {
    id: 'Elite company',
    name: 'Elite company',
    category: 'company',
    res: 5, mov: 2, mel: 4, shtShort: 0, shtLong: 0, def: 5, com: 0,
    cost: 36,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Veteran or heavily trained troops'
  },
  {
    id: 'Formed company',
    name: 'Formed company',
    category: 'company',
    res: 4, mov: 2, mel: 3, shtShort: 0, shtLong: 0, def: 5, com: 0,
    cost: 30,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Core ranked infantry or cavalry'
  },
  {
    id: 'Irregular company',
    name: 'Irregular company',
    category: 'company',
    res: 3, mov: 3, mel: 3, shtShort: 1, shtLong: 0, def: 4, com: 0,
    cost: 22,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Fast, loose-order warbands & scouts'
  },
  {
    id: 'Fantastic beast',
    name: 'Fantastic beast',
    category: 'company',
    res: 5, mov: 3, mel: 4, shtShort: 0, shtLong: 0, def: 4, com: 0,
    cost: 31,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Monsters, warhounds, eagles, beasts'
  },
  {
    id: 'Dragon',
    name: 'Dragon',
    category: 'company',
    res: 6, mov: 4, mel: 4, shtShort: 0, shtLong: 0, def: 5, com: 0,
    cost: 42,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Apex monsters & colossal creatures'
  },
  {
    id: 'Ordnance battery',
    name: 'Ordnance battery',
    category: 'company',
    res: 3, mov: 1, mel: 1, shtShort: 0, shtLong: 2, def: 4, com: 0,
    cost: 21,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Warmachines, cannons, catapults'
  },
  {
    id: 'Vehicle',
    name: 'Vehicle',
    category: 'company',
    res: 5, mov: 4, mel: 3, shtShort: 0, shtLong: 0, def: 5, com: 0,
    cost: 36,
    allowTraits: true,
    allowRelic: false,
    isMage: false,
    limitNote: 'Chariots, war wagons, steam engines'
  }
];

export const TRAITS = [
  {
    id: 'Amphibious',
    name: 'Amphibious',
    cost: 2,
    mods: {},
    incompatible: [],
    description: 'They treat all water features and watery rough terrain as open terrain for movement, melee and shooting purposes.'
  },
  {
    id: 'Artillery',
    name: 'Artillery',
    cost: 15,
    mods: {},
    incompatible: ['Artillery (indirect)', 'Shieldwall'],
    description: 'Units with the artillery trait extend the long range of their shooting capacity to 10bw. It could be used for heavier weapons like bombards, ballistae or torsion catapults with a low trajectory, whether fixed in a static frame or mounted on a more mobile platform. Artillery may choose to target any eligible target rather than always shooting the nearest unit. If a unit of artillery becomes impetuous, they will remain stationary – defaulting to the "Let’s not be too hasty…" result rather than rolling for impetuous actions.'
  },
  {
    id: 'Artillery (indirect)',
    name: 'Artillery (indirect)',
    cost: 20,
    mods: {},
    incompatible: ['Artillery', 'Shieldwall'],
    description: 'Indirect artillery represents catapults, trebuchets, and mortars with the capacity to lob high trajectory missiles. Units with the artillery (indirect) trait extend the long-range of their shooting capacity to 10bw. When determining eligible targets, indirect artillery may fire over the heads of intervening units which are not treated as blocking their line of sight. Indirect artillery may choose to target any eligible target rather than always shooting the nearest unit. If a unit of indirect artillery becomes impetuous, they will remain stationary – defaulting to the "Let’s not be too hasty…" result rather than rolling for impetuous actions.'
  },
  {
    id: 'Barrage',
    name: 'Barrage',
    cost: 3,
    mods: { shtMode: 'setShort', shtShort: 3 },
    incompatible: ['Shooting', 'Shooting (mixed)', 'Shooting (skilled)', 'Thrown weapons'],
    description: 'Representing all devastating short-range attacks such as dragon breath or grenades, companies with the barrage trait adjust their short-range shooting capacity to 3. Barrage does not change a unit’s long-range shooting capacity.'
  },
  {
    id: 'Belligerent',
    name: 'Belligerent',
    cost: -3,
    mods: {},
    incompatible: ['Character (Warlord)', 'Character (Mage-lord)', 'Character (Captain)', 'Character (Magic-user)'],
    description: 'Belligerent units need little excuse to pick a fight, even with allies. A result of "Over there" on the Impetuous Actions table will cause them to wheel (or turn, whichever is most appropriate) to face the nearest friendly unit and move to attack them if they can. Once engaged in melee they will remain so, fighting each melee phase until they or their opponent have scattered or disengaged. A belligerent unit may only attempt to disengage from melee if it has an attached character.'
  },
  {
    id: 'Berserk',
    name: 'Berserk',
    cost: 3,
    mods: {},
    incompatible: ['Drilled'],
    description: 'Berserk units get into a frenzy during melee. Each Melee attack roll of 6 "explodes", allowing the company to roll an additional attack dice. If the exploding dice roll 6s, they do not generate further die rolls.'
  },
  {
    id: 'Character (Warlord)',
    name: 'Character (Warlord)',
    cost: 65,
    mods: { res: 2, mel: 2, com: 3 },
    characterRole: 'Lord',
    isMage: false,
    incompatible: ['Mounted', 'Passenger', 'Character (Mage-lord)', 'Character (Captain)', 'Character (Magic-user)', 'Belligerent', 'Emerge'],
    description: 'The company becomes a Warlord character-company. In addition to the +5 points cost for the trait, adds the Warlord’s 60 pts cost and increases Resolve (+2), Melee (+2), and Command (+3).'
  },
  {
    id: 'Character (Mage-lord)',
    name: 'Character (Mage-lord)',
    cost: 80,
    mods: { res: 2, mel: 1, com: 3 },
    characterRole: 'Lord',
    isMage: true,
    incompatible: ['Mounted', 'Passenger', 'Character (Warlord)', 'Character (Captain)', 'Character (Magic-user)', 'Belligerent', 'Emerge'],
    description: 'The company becomes a Mage-lord character-company. In addition to the +5 points cost for the trait, adds the Mage-lord’s 75 pts cost and increases Resolve (+2), Melee (+1), and Command (+3).'
  },
  {
    id: 'Character (Captain)',
    name: 'Character (Captain)',
    cost: 30,
    mods: { res: 1, mel: 1, com: 2 },
    characterRole: 'Captain',
    isMage: false,
    incompatible: ['Mounted', 'Passenger', 'Character (Warlord)', 'Character (Mage-lord)', 'Character (Magic-user)', 'Belligerent', 'Emerge'],
    description: 'The company becomes a Captain character-company. In addition to the +5 points cost for the trait, adds the Captain’s 25 pts cost and increases Resolve (+1), Melee (+1), and Command (+2).'
  },
  {
    id: 'Character (Magic-user)',
    name: 'Character (Magic-user)',
    cost: 45,
    mods: { res: 1, mel: 1, com: 0 },
    characterRole: 'Magic-user',
    isMage: true,
    incompatible: ['Mounted', 'Passenger', 'Character (Warlord)', 'Character (Mage-lord)', 'Character (Captain)', 'Belligerent', 'Emerge'],
    description: 'The company becomes a Magic-user character-company. In addition to the +5 points cost for the trait, adds the Magic-user’s 40 pts cost and increases Resolve (+1) and Melee (+1).'
  },
  {
    id: 'Drilled',
    name: 'Drilled',
    cost: 2,
    mods: {},
    incompatible: ['Berserk', 'Stimulants', 'Impulsive'],
    description: 'Groups composed of drilled companies may make formation changes during the Action Phase at the start or end of an advance move at the cost of half their regular movement (rounding down).'
  },
  {
    id: 'Doughty',
    name: 'Doughty',
    cost: 4,
    mods: { res: 1 },
    incompatible: ['Rabble', 'Reckless'],
    description: 'Doughty units are particularly brave or resolute, represented by conferring a +1 Resolve bonus.'
  },
  {
    id: 'Emerge',
    name: 'Emerge',
    cost: 12,
    mods: {},
    incompatible: ['Character (Warlord)', 'Character (Mage-lord)', 'Character (Captain)', 'Character (Magic-user)'],
    description: 'Burrowing underground, hovering amid the clouds, or hidden in plain sight, a unit with the emerge trait is not placed on the table during deployment. Characters may not be attached to emerging units until they are placed on the table. When any character is activated, they may call forth the unit onto the table within 2bw and roll 1d6: 1–2) opposing player moves it 1d3bw; 3–4) owning player moves it 1d3bw; 5+) emerges exactly where intended. Counts as activated on the turn it arrives; units emerging into combat count as charging.'
  },
  {
    id: 'Ephemeral',
    name: 'Ephemeral',
    cost: 10,
    mods: {},
    incompatible: ['Mundane'],
    description: 'Ephemeral units are able to pass through all terrain like ghosts, ignoring all terrain movement and melee modifiers. Ephemeral units may pass through – or be passed through by any friendly unit if there is space to do so. Their shadowy nature also makes them difficult to target, increasing their Defence to 6+ against all shooting – even from heavy or powerful missile weapons.'
  },
  {
    id: 'Expendable',
    name: 'Expendable',
    cost: 3,
    mods: {},
    incompatible: ['Swarm'],
    description: 'Expendable units are either looked down on by the rest of the army, like thralls or subject auxiliaries, or designed to be destroyed during combat like scythed chariots. When expendable units scatter, they are ignored by others and do not cause a ripple of Resolve loss. Expendable units are not included in the starting company count used to determine army Break Point.'
  },
  {
    id: 'Fast',
    name: 'Fast',
    cost: 1,
    mods: { mov: 1 },
    incompatible: ['Slow'],
    description: 'Units with the fast trait gain a +1 to their Movement value.'
  },
  {
    id: 'Feast',
    name: 'Feast',
    cost: 4,
    mods: {},
    incompatible: [],
    description: 'The feast trait represents any unit invigorated after destroying (and eating) its enemies, such as werewolves, vampires, ghouls, or giants. If a foe engaged in melee scatters, a unit with the feast trait immediately restores 1 lost Resolve per company in the scattering unit.'
  },
  {
    id: 'Flying',
    name: 'Flying',
    cost: 10,
    mods: { mov: 2 },
    incompatible: [],
    description: 'Flying units such as manticores, giant eagles and ornithopters gain +2 to their Movement value and ignore all movement modifiers caused by terrain. They are treated as slightly elevated during the Shooting Phase, so can shoot (and be targeted) over the heads of intervening troops and terrain. Flying units may choose to evade as a charge reaction.'
  },
  {
    id: 'Foresters',
    name: 'Foresters',
    cost: 3,
    mods: {},
    incompatible: [],
    description: 'Representing units adept at moving and fighting in woodland or forests such as wood elves, giant spiders and pygmies, foresters ignore the movement and melee modifiers of rough terrain and woods.'
  },
  {
    id: 'Furious charge',
    name: 'Furious charge',
    cost: 3,
    mods: {},
    incompatible: ['Skirmishers'],
    description: 'The furious charge trait represents the impact of chariots or knights with lances, or the howling charge of wildmen, beastmen or goblins. The unit gains a +2 modifier to their Melee value when they charge – in addition to the regular +1 charge modifier.'
  },
  {
    id: 'Giant',
    name: 'Giant',
    cost: 12,
    mods: { res: 2, mel: 2 },
    incompatible: ['Monstrous', 'Swarm', 'Long spears', 'Shieldwall', 'Pikes'],
    description: 'Giants are large, lumbering and powerful; they gain +2 to their Resolve and +2 to their Melee values. Companies of giants cannot form groups. Giants tower over other units and can shoot (and be targeted) over intervening troops and terrain. When a giant’s Resolve drops to 0 it causes a normal Resolve ripple and falls in a random direction (1: left, 2: rear, 3: right, 4+: front), causing two additional attacks against any unit within 1bw.'
  },
  {
    id: 'Heavy melee weapons',
    name: 'Heavy melee weapons',
    cost: 3,
    mods: {},
    incompatible: ['Pikes'],
    description: 'Units armed with two-handed weapons such as greatswords, polearms, or crushing weapons that reduce enemy armour effectiveness. The Defence value of all melee opponents is treated as 4+.'
  },
  {
    id: 'Heavy missile weapons',
    name: 'Heavy missile weapons',
    cost: 1,
    mods: {},
    incompatible: ['Powerful missile weapons'],
    description: 'Represents weapons like crossbows or light artillery pieces with improved armour penetration but slower reload. The Defence value of all shooting targets is treated as 4+ but, after shooting, the unit must reload during an Action Phase before shooting again.'
  },
  {
    id: 'Highlanders',
    name: 'Highlanders',
    cost: 3,
    mods: {},
    incompatible: [],
    description: 'Highlanders move and fight freely through high country, moors and bogs. They suffer no movement or melee modifiers in rough terrain and each company gains +1 Melee if at least 50% of their base is within a hill terrain feature.'
  },
  {
    id: 'Impulsive',
    name: 'Impulsive',
    cost: 1,
    mods: {},
    incompatible: ['Drilled'],
    description: 'Prone to dashing forward when others hold back. When rolling for Mishaps, treat all results of Late as Enthusiastic. If not engaged in melee after completing activation each turn, they must move 1d3-1bw directly forward (ignoring terrain Movement modifiers). Contacting a conformable enemy counts as charging; otherwise stop ½bw short.'
  },
  {
    id: 'Long spears',
    name: 'Long spears',
    cost: 2,
    mods: {},
    incompatible: ['Mounted', 'Giant', 'Pikes'],
    description: 'Units with long spears gain +2 to their Melee value when charged by an enemy to their front, or if fighting to their front against units with the flying, giant, mounted, or monstrous traits.'
  },
  {
    id: 'Malodorous',
    name: 'Malodorous',
    cost: 4,
    mods: {},
    incompatible: [],
    description: 'Malodorous units exude a foul stench or fell aura that impedes all units nearby. All companies, friend and foe alike, within 1bw suffer -1 Melee; mounted units suffer -2 Melee. Other malodorous units with identical profiles and mindless units ignore this effect.'
  },
  {
    id: 'Militia',
    name: 'Militia',
    cost: -2,
    mods: { mel: -1 },
    incompatible: ['Reckless', 'Terrifying'],
    description: 'Represents hastily raised, part-time or poorly equipped fighting units. Units with the militia trait suffer -1 to their Melee value.'
  },
  {
    id: 'Mindless',
    name: 'Mindless',
    cost: 0,
    mods: { mel: -1 },
    incompatible: ['Reliable', 'Unreliable', 'Proud'],
    description: 'Undead hordes, golems, elementals and automatons. Mindless units suffer -1 to Melee (spreadsheet profile; rules text also notes -1 Move). They do not suffer Resolve loss when friendly units scatter and default to "Let’s not be too hasty…" if impetuous. Only a Mage-lord may rally mindless units (or a Bless spell). If the Warlord/Mage-lord is killed or scatters, all mindless units suffer an immediate -5 Resolve.'
  },
  {
    id: 'Monstrous',
    name: 'Monstrous',
    cost: 12,
    mods: { res: 2, mel: 2 },
    incompatible: ['Giant', 'Swarm'],
    description: 'Represents creatures larger and more powerful than usual such as ogres, trolls, minotaurs or treefolk. Monstrous units gain +2 to their Resolve and +2 to their Melee value.'
  },
  {
    id: 'Mounted',
    name: 'Mounted',
    cost: 8,
    mods: { res: 1, mov: 2, mel: 1 },
    incompatible: ['Long spears', 'Shieldwall', 'Pikes', 'Character (Warlord)', 'Character (Mage-lord)', 'Character (Captain)', 'Character (Magic-user)'],
    description: 'Units mounted on creatures such as warhorses, wolves or boars gain +1 to their Resolve, +2 to their Movement, and +1 to their Melee values.'
  },
  {
    id: 'Mundane',
    name: 'Mundane',
    cost: 5,
    mods: {},
    incompatible: ['Ephemeral', 'Terrifying'],
    description: 'There is nothing magical, or even imaginative about mundane units. All magic rolls for spells affecting the mundane unit, or any units in base contact with them, suffer a -1 modifier. Mundane units gain +1 Defence against magic missile spells (up to max 6+); prophecy dice may not be used to affect a mundane unit’s dice.'
  },
  {
    id: 'Passenger',
    name: 'Passenger',
    cost: 4,
    mods: {},
    incompatible: ['Character (Warlord)', 'Character (Mage-lord)', 'Character (Captain)', 'Character (Magic-user)'],
    description: 'Units with the passenger trait can carry a character but operate independently from them. Characters attached to the unit can rally or cast in the same Action Phase that the unengaged unit carries out an action of their own (except charging or reacting to being charged).'
  },
  {
    id: 'Pikes',
    name: 'Pikes',
    cost: 3,
    mods: {},
    incompatible: ['Giant', 'Mounted', 'Shieldwall', 'Swarm', 'Long spears', 'Heavy melee weapons'],
    description: 'Units with two-handed pikes gain +3 to their Melee value when charged by an enemy to their front, or if fighting to their front against units with the flying, giant, mounted, or monstrous traits. Enemies engaged in melee against the flanks or rear of a unit with pikes receive an additional +1 Melee modifier.'
  },
  {
    id: 'Poison',
    name: 'Poison',
    cost: 3,
    mods: {},
    incompatible: [],
    description: 'Whether equipped with a venomous bite or sting, coating blades and arrows with poison, or breathing noxious fumes, units with the poison trait may reroll all 1s rolled on attack dice in both the Shooting and Melee Phases.'
  },
  {
    id: 'Powerful missile weapons',
    name: 'Powerful missile weapons',
    cost: 5,
    mods: {},
    incompatible: ['Heavy missile weapons'],
    description: 'Represents huge artillery pieces, black powder weapons and similar armour-piercing weaponry. The Defence value of all shooting targets is treated as 3+ but, after shooting, the unit must reload their weapons during an Action Phase before shooting again.'
  },
  {
    id: 'Proud',
    name: 'Proud',
    cost: 8,
    mods: {},
    incompatible: ['Mindless'],
    description: 'Holding themselves aloof from other, lesser beings, a proud unit does not suffer Resolve loss when friendly units scatter.'
  },
  {
    id: 'Rabble',
    name: 'Rabble',
    cost: -6,
    mods: { res: -1 },
    incompatible: ['Doughty', 'Terrifying', 'Warbeasts'],
    description: 'Gibbering and disorderly, units with the rabble trait suffer a -1 modifier to their Resolve.'
  },
  {
    id: 'Reckless',
    name: 'Reckless',
    cost: -1,
    mods: { res: -1, mov: 1, mel: 1 },
    incompatible: ['Doughty', 'Militia'],
    description: 'Reckless units prioritise speed and aggression over staying power (Resolve -1, Move +1, Melee +1).'
  },
  {
    id: 'Regenerate',
    name: 'Regenerate',
    cost: 5,
    mods: {},
    incompatible: [],
    description: 'Whether possessing an innate ability to regenerate like trolls and saurians or another restorative boon, units with regenerate may roll 1d6 during the Action Phase (even when engaged) for each point of lost Resolve; any score of 6 immediately restores 1 point of Resolve.'
  },
  {
    id: 'Reliable',
    name: 'Reliable',
    cost: 3,
    mods: {},
    incompatible: ['Unreliable', 'Mindless', 'Stimulants'],
    description: 'Reliable units gain +1 when rolling for Mishaps at the start of the battle, and whenever they need to roll for impetuous actions.'
  },
  {
    id: 'Shieldwall',
    name: 'Shieldwall',
    cost: 8,
    mods: {},
    incompatible: ['Skirmishers', 'Mounted', 'Artillery', 'Artillery (indirect)', 'Giant', 'Pikes'],
    description: 'The unit gains a +1 modifier to their Defence value against shooting and melee attacks to the unit’s front edge.'
  },
  {
    id: 'Shooting',
    name: 'Shooting',
    cost: 5,
    mods: { mel: -1, shtMode: 'setBoth', shtShort: 3, shtLong: 2 },
    incompatible: ['Barrage', 'Thrown weapons', 'Shooting (mixed)', 'Shooting (skilled)'],
    description: 'The unit’s Melee factor suffers a -1 modifier and the unit’s Shooting capacity is fixed at 3/2.'
  },
  {
    id: 'Shooting (mixed)',
    name: 'Shooting (mixed)',
    cost: 4,
    mods: { shtMode: 'setBoth', shtShort: 2, shtLong: 1 },
    incompatible: ['Barrage', 'Thrown weapons', 'Shooting', 'Shooting (skilled)'],
    description: 'Some, but not all, warriors in units with the shooting (mixed) trait are equipped with missile weapons. The unit’s limited Shooting capacity is adjusted to 2/1, and its Melee factor is not impacted.'
  },
  {
    id: 'Shooting (skilled)',
    name: 'Shooting (skilled)',
    cost: 7,
    mods: { mel: -1, shtMode: 'setBoth', shtShort: 3, shtLong: 3 },
    incompatible: ['Barrage', 'Thrown weapons', 'Shooting', 'Shooting (mixed)'],
    description: 'The unit’s Melee factor suffers a -1 modifier and the unit’s Shooting capacity is fixed at 3/3.'
  },
  {
    id: 'Slow',
    name: 'Slow',
    cost: -1,
    mods: { mov: -1 },
    incompatible: ['Fast'],
    description: 'Slow units suffer a -1 modifier to their Movement value.'
  },
  {
    id: 'Skirmishers',
    name: 'Skirmishers',
    cost: 4,
    mods: {},
    incompatible: ['Shieldwall', 'Furious charge'],
    description: 'Skirmishers may pass through – or be passed through by – any friendly unit if there is space. They ignore movement and melee penalties in rough terrain and woods unless also mounted. Enemies suffer -1 Shooting when shooting at skirmishers. When unengaged skirmishers are charged from the front, they may evade. When engaged in open terrain, skirmishers suffer -1 Melee and opponents gain +1 Melee.'
  },
  {
    id: 'Stimulants',
    name: 'Stimulants',
    cost: 4,
    mods: {},
    incompatible: ['Reliable', 'Drilled'],
    description: 'Warriors have partaken in stimulants such as alcohol, magic mushrooms, or hallucinogenic warpaint. Roll 1d6 after rolling for Mishaps and apply throughout the battle: 1) Ignores all orders and becomes impetuous; 2–4) +1 Move, +1 Melee; 5–6) Gains the Berserk and Proud traits.'
  },
  {
    id: 'Swarm',
    name: 'Swarm',
    cost: -1,
    mods: { res: -1, mov: -1, mel: -1 },
    incompatible: ['Expendable', 'Monstrous', 'Giant', 'Pikes', 'Warbeasts'],
    description: 'Swarms suffer -1 Resolve, -1 Movement, and -1 Melee. They never block line of sight and enemies suffer -1 Shooting against swarms. When swarm units scatter they do not cause a Resolve ripple and are not included in the starting company count for army Break Point.'
  },
  {
    id: 'Terrifying',
    name: 'Terrifying',
    cost: 25,
    mods: {},
    incompatible: ['Militia', 'Mundane', 'Rabble'],
    description: 'Enemies wishing to charge a terrifying unit must roll below their own starting Resolve on 1d6 (+1 to target number per attached character). On failure, the charge stops ½bw away. All enemies attacking the front of a terrifying unit suffer -2 Melee. Mindless and terrifying units ignore the terrifying trait of others.'
  },
  {
    id: 'Thrown weapons',
    name: 'Thrown weapons',
    cost: 1,
    mods: { shtMode: 'addShort', shtShort: 1 },
    incompatible: ['Barrage', 'Shooting', 'Shooting (mixed)', 'Shooting (skilled)'],
    description: 'Bearing throwing weapons such as javelins, franciscas, or shurikens, units with thrown weapons gain +1/+0 to their Shooting value.'
  },
  {
    id: 'Unreliable',
    name: 'Unreliable',
    cost: -4,
    mods: {},
    incompatible: ['Reliable', 'Mindless'],
    description: 'They suffer a -1 modifier when rolling for Mishaps at the start of the battle, and for all impetuous actions.'
  },
  {
    id: 'Warbeasts',
    name: 'Warbeasts',
    cost: 4,
    mods: {},
    incompatible: ['Rabble', 'Swarm'],
    description: 'Deploys with a complement of savage warbeasts, crazed fanatics, or single-use explosive weapons used to break enemy lines on first impact. The unit can reroll all unsuccessful attack dice in its first round of melee each game.'
  }
];

export const RELICS = [
  {
    id: 'Billowing Banner of Encouragement',
    name: 'Billowing Banner of Encouragement',
    cost: 8,
    mods: {},
    mageOnly: false,
    description: 'The character may reroll one failed rally die per turn.'
  },
  {
    id: 'Blade of Unsurpassable Power',
    name: 'Blade of Unsurpassable Power',
    cost: 5,
    mods: { mel: 1 },
    mageOnly: false,
    description: 'The character (and any unit they are attached to) receives +1 attack die in melee. If carried by a Rogue, the character still rolls three dice when duelling, but chooses any two of the results as its attack.'
  },
  {
    id: 'Drab Cloak of Expediency',
    name: 'Drab Cloak of Expediency',
    cost: 10,
    mods: {},
    mageOnly: false,
    description: 'If the character is killed or scatters, the owning player rolls 1d6. On a 4+ they managed to disguise themselves and escape. The character must be moved 2bw away from the site of the melee immediately.'
  },
  {
    id: 'Familiar',
    name: 'Familiar',
    cost: 20,
    mods: {},
    mageOnly: true,
    description: 'A Mage-lord or Magic-user with a familiar may cast a spell and carry out another eligible action during the activation phase. The spell and action may be made in any order, however, the spell will suffer a -1 modifier against the difficulty roll/s.'
  },
  {
    id: 'Haughty Helm of Reassurance',
    name: 'Haughty Helm of Reassurance',
    cost: 12,
    mods: {},
    mageOnly: false,
    description: 'Any unit the character attaches to gains the Proud trait.'
  },
  {
    id: "Lion's Roar Talisman",
    name: "Lion's Roar Talisman",
    cost: 8,
    mods: { com: 1 },
    mageOnly: false,
    description: 'The character gains +1bw command radius.'
  },
  {
    id: "Martyr's Ring of Retribution",
    name: "Martyr's Ring of Retribution",
    cost: 10,
    mods: {},
    mageOnly: false,
    description: 'If the character is killed or scatters in melee, one randomly determined enemy character within 1bw is automatically killed on a 1d6 roll of 4+.'
  },
  {
    id: 'Mystical Tome of Revelation',
    name: 'Mystical Tome of Revelation',
    cost: 12,
    mods: {},
    mageOnly: true,
    description: 'A Mage-lord or Magic-user gains one additional spell choice.'
  },
  {
    id: "Navigator's Map of Wayfinding",
    name: "Navigator's Map of Wayfinding",
    cost: 8,
    mods: {},
    mageOnly: false,
    description: 'Any unit the character is attached to may ignore all Movement penalties conferred by terrain.'
  },
  {
    id: 'Phoenix Bow of Precision',
    name: 'Phoenix Bow of Precision',
    cost: 15,
    mods: {},
    mageOnly: false,
    description: 'The character receives a shooting attack with a 5bw range which can only be used against other characters. Requires line of sight to the target (or host company). Normal targeting priority rules do not apply. Any unmodified roll of 6 causes the character to lose 1 Resolve.'
  },
  {
    id: 'Shadowy Cloak of Stealth',
    name: 'Shadowy Cloak of Stealth',
    cost: 5,
    mods: {},
    mageOnly: false,
    description: 'When unattached, the character may never be targeted during shooting.'
  },
  {
    id: 'Titanic Diadem of Foresight',
    name: 'Titanic Diadem of Foresight',
    cost: 12,
    mods: {},
    mageOnly: false,
    description: 'If the character, or unit they are attached to, is charged, they may interrupt the opponent’s turn and take their action first if they have not already activated this turn. The same character may still be activated normally later in the Action Phase.'
  },
  {
    id: 'Wicked Blade of Piercing',
    name: 'Wicked Blade of Piercing',
    cost: 8,
    mods: {},
    mageOnly: false,
    description: 'If the character fights a duel, their opponent’s Defence is fixed at 5+.'
  },
  {
    id: 'Winged Boots of Alacrity',
    name: 'Winged Boots of Alacrity',
    cost: 5,
    mods: { mov: 2 },
    mageOnly: false,
    description: 'The character’s Move value is increased to 6bw (+2 Move).'
  }
];

export const STRATEGIES = [
  {
    id: 'Agent',
    name: 'Agent',
    cost: 10,
    extraRogues: 0,
    description: 'Sowing discord in the enemy ranks, an agent causes one enemy unit to start the game with -1 Resolve – apply before rolling for Mishaps.'
  },
  {
    id: 'Ambush',
    name: 'Ambush',
    cost: 15,
    extraRogues: 0,
    description: 'One unit and one attached character may be deployed within any terrain feature outside of the opponent’s deployment zone (must be on the reverse slope of a hill from the enemy). Ambushes are placed after all non-ambushing units, before rolling for Mishaps.'
  },
  {
    id: 'Cloaks and Daggers',
    name: 'Cloaks and Daggers',
    cost: 10,
    extraRogues: 1,
    description: 'The army may include a second Rogue (raises Rogue limit from 1 to 2).'
  },
  {
    id: 'Drillmaster',
    name: 'Drillmaster',
    cost: 5,
    extraRogues: 0,
    description: 'One Captain is a fanatical drillmaster. Any unit they attach to automatically receives the Drilled trait.'
  },
  {
    id: 'Master of the Horse',
    name: 'Master of the Horse',
    cost: 15,
    extraRogues: 0,
    description: 'The army includes a master of the horse responsible for the upkeep and training of its mounts. All mounted units receive an additional +1 attack dice when charging.'
  },
  {
    id: 'Night March',
    name: 'Night March',
    cost: 15,
    extraRogues: 0,
    description: 'The Warlord issues instructions for the entire army to advance under the shadow of darkness. The army’s deployment zone depth is increased by 3bw.'
  },
  {
    id: 'Quartermaster',
    name: 'Quartermaster',
    cost: 25,
    extraRogues: 0,
    description: 'The army includes a quartermaster responsible for maintaining supplies and regulating the baggage train. Add +1 for all units when rolling for pregame Mishaps.'
  },
  {
    id: 'Scouts',
    name: 'Scouts',
    cost: 10,
    extraRogues: 0,
    description: 'The army has wide-ranging scouts who report back on the enemy’s movements. Add +2 when rolling to determine attacker/defender.'
  }
];

export const SPELLS = [
  {
    id: 'Bless',
    name: 'Bless',
    difficulty: '3+',
    range: '5 bw',
    description: 'Restores lost Resolve to a unit. Roll 1d6 per spell level (Lvl 1: 1d6, Lvl 2: 2d6, Lvl 3: 3d6); each roll of 3+ restores 1 Resolve. Usable on Mindless units.'
  },
  {
    id: 'Blink',
    name: 'Blink',
    difficulty: '4+',
    range: '5 bw',
    description: 'Teleport a single friendly or enemy unit 1d3+1bw in an indicated direction, maintaining its current facing. Roll 1d6 per level; a single 4+ is needed. Units blinked into combat count as charging.'
  },
  {
    id: 'Confusion',
    name: 'Confusion',
    difficulty: '3+',
    range: '5 bw',
    description: 'Forces a target unit to immediately roll for impetuous actions (-1 modifier), interrupting the turn. A confused unit may not activate again in the same turn unless targeted by Haste. Roll 1d6 per level; a single 3+ is required.'
  },
  {
    id: 'Curse',
    name: 'Curse',
    difficulty: '4+',
    range: '5 bw',
    description: 'Lowers the melee effectiveness of a target unit. Roll 1d6 per spell level (Lvl 1: 1d6, Lvl 2: 2d6, Lvl 3: 3d6). For every roll of 4+, each company in the target unit suffers -1 Melee this turn.'
  },
  {
    id: 'Empower',
    name: 'Empower',
    difficulty: '3+',
    range: '5 bw',
    description: 'Increases the fighting capacity of a chosen unit. Roll 1d6 per spell level (Lvl 1: 1d6, Lvl 2: 2d6, Lvl 3: 3d6). The unit gains +1 Melee per company for the current turn for each roll of 3+.'
  },
  {
    id: 'Entangle',
    name: 'Entangle',
    difficulty: '4+',
    range: '5 bw',
    description: 'Restrains one target unit, ensuring that it cannot move in the current Action Phase. Roll 1d6 per spell level; a single 4+ is required to successfully cast.'
  },
  {
    id: 'Haste',
    name: 'Haste',
    difficulty: '4+',
    range: '5 bw',
    description: 'Allows one unit (even impetuous units) to conduct an additional optional action this turn. Roll 1d6 per spell level; a single 4+ is required.'
  },
  {
    id: 'Magic Missiles',
    name: 'Magic Missiles',
    difficulty: 'Auto',
    range: '5 bw',
    description: 'Grants the Magic-user a shooting attack during the Shooting Phase: Lvl 1 = 1/1, Lvl 2 = 2/2, Lvl 3 = 3/3. Magic-users who shoot Magic Missiles may not cast another spell in the Action Phase of the same turn.'
  },
  {
    id: 'Prophesy',
    name: 'Prophesy',
    difficulty: 'Pre-game',
    range: 'Table',
    description: 'After rolling for Mishaps at the start of the game, roll 1d6/2d6/3d6 (per level) prophecy dice and set them aside. At any point during the game, replace any die roll (by either player) with one prophecy die (once per die). Cannot be used if the caster is on a flank march, fled, or killed.'
  },
  {
    id: 'Summon',
    name: 'Summon',
    difficulty: '3+',
    range: '2 bw',
    description: 'Adds 1 summoning point per success to the caster’s summoning pool (Lvl 1 = 10 pts/point, Lvl 2 = 20 pts/point, Lvl 3 = 30 pts/point). Spend points to deploy a 1–4 company unit within 2bw (cannot act that turn; contacting an enemy’s front counts as charging).'
  }
];

export const BANNER_COLORS = [
  { id: 'gold', name: 'Royal Gold', hex: '#decb01' },
  { id: 'goblin', name: 'Emerald Green', hex: '#00bd18' },
  { id: 'crimson', name: 'War Crimson', hex: '#d93829' },
  { id: 'royal', name: 'Imperial Blue', hex: '#2e7dd1' },
  { id: 'purple', name: 'Arcane Violet', hex: '#9b5de5' },
  { id: 'ivory', name: 'Ivory White', hex: '#fefefe' }
];

// Build lookup maps & symmetric incompatibility map
export const PROFILE_MAP = Object.fromEntries(BASE_PROFILES.map(p => [p.id, p]));
export const TRAIT_MAP = Object.fromEntries(TRAITS.map(t => [t.id, t]));
export const RELIC_MAP = Object.fromEntries(RELICS.map(r => [r.id, r]));
export const STRATEGY_MAP = Object.fromEntries(STRATEGIES.map(s => [s.id, s]));
export const SPELL_MAP = Object.fromEntries(SPELLS.map(s => [s.id, s]));

export const INCOMPATIBILITY_MAP = (() => {
  const map = {};
  for (const t of TRAITS) map[t.id] = new Set();
  for (const t of TRAITS) {
    for (const other of t.incompatible) {
      if (map[t.id] && map[other]) {
        map[t.id].add(other);
        map[other].add(t.id);
      }
    }
  }
  return map;
})();

// 38 Generic Fantasy & Historical Faction Preset Rosters
export const PRESET_ARMIES = [
  {
    id: 'high-elves',
    name: 'High Elves',
    tagline: 'Swift, disciplined elites & soaring dragons',
    defaultRacial: 'Fast',
    units: [
      { name: 'Prince', company: 'Warlord' },
      { name: 'Archmage', company: 'Mage-lord' },
      { name: 'Noble', company: 'Captain' },
      { name: 'Mage', company: 'Magic-user' },
      { name: 'Shadow Scout', company: 'Rogue' },
      { name: 'Archers', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Shooting (skilled)'] },
      { name: 'Spearmen', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Shieldwall'] },
      { name: 'Blademasters', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Heavy melee weapons', 'Furious charge'] },
      { name: 'Lion Guard', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Heavy melee weapons', 'Foresters'] },
      { name: 'Noble Lancers', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Mounted', 'Furious charge'] },
      { name: 'Outrider Cavalry', company: 'Irregular company', racial: 'Fast', traits: ['Mounted', 'Skirmishers', 'Shooting'] },
      { name: 'Elven War Chariots', company: 'Vehicle', racial: 'Fast', traits: ['Furious charge', 'Passenger', 'Shooting (mixed)'] },
      { name: 'Dragon Knights', company: 'Elite company', racial: 'Fast', traits: ['Furious charge', 'Mounted', 'Proud'] },
      { name: 'Shadow Rangers', company: 'Elite company', racial: 'Fast', traits: ['Skirmishers', 'Shooting (skilled)'] },
      { name: 'Bolt Thrower', company: 'Ordnance battery', racial: 'Fast', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Great Eagles', company: 'Fantastic beast', racial: 'Fast', traits: ['Flying', 'Proud'] },
      { name: 'Dragon', company: 'Dragon', racial: '', traits: ['Barrage', 'Flying', 'Passenger'] },
      { name: 'Temple Guard', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Heavy melee weapons', 'Long spears'] }
    ]
  },
  {
    id: 'human-empire',
    name: 'Human Empire',
    tagline: 'Combined arms: drilled infantry, knights & black powder',
    defaultRacial: '',
    units: [
      { name: 'General', company: 'Warlord' },
      { name: 'Battle Wizard', company: 'Magic-user' },
      { name: 'Captain', company: 'Captain' },
      { name: 'Inquisitor', company: 'Rogue' },
      { name: 'Halberdiers', company: 'Formed company', traits: ['Drilled', 'Heavy melee weapons'] },
      { name: 'Swordsmen', company: 'Formed company', traits: ['Drilled'] },
      { name: 'Spearmen', company: 'Formed company', traits: ['Drilled', 'Long spears'] },
      { name: 'Crossbowmen', company: 'Formed company', traits: ['Heavy missile weapons', 'Shooting'] },
      { name: 'Archers', company: 'Formed company', traits: ['Skirmishers', 'Shooting'] },
      { name: 'Hand Gunners', company: 'Formed company', traits: ['Powerful missile weapons', 'Shooting'] },
      { name: 'Greatswords', company: 'Formed company', traits: ['Doughty', 'Heavy melee weapons'] },
      { name: 'Flagellants', company: 'Irregular company', traits: ['Doughty', 'Furious charge', 'Stimulants'] },
      { name: 'Knightly Orders', company: 'Elite company', traits: ['Doughty', 'Furious charge', 'Mounted'] },
      { name: 'Gryphon Knights', company: 'Elite company', traits: ['Monstrous', 'Furious charge', 'Mounted'] },
      { name: 'Mounted Pistoleers', company: 'Formed company', traits: ['Barrage', 'Mounted', 'Skirmishers'] },
      { name: 'Great Cannon', company: 'Ordnance battery', traits: ['Artillery', 'Heavy missile weapons', 'Thrown weapons'] },
      { name: 'Mortar', company: 'Ordnance battery', traits: ['Artillery (indirect)', 'Powerful missile weapons'] },
      { name: 'Armored Steam Engine', company: 'Vehicle', traits: ['Artillery', 'Powerful missile weapons', 'Shooting (mixed)'] },
      { name: 'Volley Gun', company: 'Ordnance battery', traits: ['Artillery', 'Barrage', 'Heavy missile weapons'] },
      { name: 'Gryphon', company: 'Fantastic beast', traits: ['Flying', 'Doughty'] },
      { name: 'Pegasus', company: 'Fantastic beast', traits: ['Flying', 'Fast', 'Passenger'] }
    ]
  },
  {
    id: 'infernal-dwarfs',
    name: 'Infernal Dwarfs',
    tagline: 'Doughty infernal legions, fire engines & captive auxiliaries',
    defaultRacial: 'Doughty',
    units: [
      { name: 'Overlord', company: 'Warlord' },
      { name: 'Fire Prophet', company: 'Mage-lord' },
      { name: 'Forge-Mage', company: 'Magic-user' },
      { name: 'Despot', company: 'Captain' },
      { name: 'Backstabber', company: 'Rogue' },
      { name: 'Infernal Dwarf Warriors', company: 'Formed company', racial: 'Doughty', traits: ['Shieldwall'] },
      { name: 'Blunderbuss Guard', company: 'Formed company', racial: 'Doughty', traits: ['Shooting', 'Powerful missile weapons'] },
      { name: 'Obsidian Guard', company: 'Elite company', racial: 'Doughty', traits: ['Drilled', 'Shieldwall'] },
      { name: 'Taur-Centaurs', company: 'Fantastic beast', racial: 'Doughty', traits: ['Fast', 'Furious charge'] },
      { name: 'Hobgoblins', company: 'Irregular company', racial: 'Unreliable', traits: ['Furious charge', 'Expendable'] },
      { name: 'Hobgoblin Wolf Riders', company: 'Irregular company', racial: 'Unreliable', traits: ['Berserk', 'Shooting (mixed)', 'Mounted'] },
      { name: 'Captive Orcs', company: 'Formed company', racial: 'Belligerent', traits: ['Berserk', 'Expendable'] },
      { name: 'Fireborn Elementals', company: 'Fantastic beast', racial: '', traits: ['Monstrous', 'Malodorous', 'Furious charge'] },
      { name: 'Infernal Cannon', company: 'Ordnance battery', racial: 'Doughty', traits: ['Artillery (indirect)', 'Powerful missile weapons'] },
      { name: 'Iron War Engine', company: 'Vehicle', racial: 'Doughty', traits: ['Berserk', 'Terrifying'] },
      { name: 'Lammasu', company: 'Fantastic beast', racial: 'Doughty', traits: ['Flying', 'Character (Magic-user)', 'Barrage'] },
      { name: 'Heavy Orcs', company: 'Elite company', racial: 'Belligerent', traits: ['Doughty', 'Drilled', 'Heavy melee weapons'] },
      { name: 'Rocket Battery', company: 'Ordnance battery', racial: 'Doughty', traits: ['Artillery (indirect)', 'Heavy missile weapons'] },
      { name: 'Winged Fire-Bull', company: 'Fantastic beast', racial: 'Doughty', traits: ['Flying', 'Furious charge', 'Passenger'] }
    ]
  },
  {
    id: 'undead',
    name: 'Undead',
    tagline: 'Mindless hordes, spectral hosts & vampire lords',
    defaultRacial: 'Mindless',
    units: [
      { name: 'Vampire Lord', company: 'Mage-lord' },
      { name: 'Vampire', company: 'Captain' },
      { name: 'Necromancer', company: 'Magic-user' },
      { name: 'Revenant', company: 'Rogue' },
      { name: 'Zombies', company: 'Formed company', racial: 'Mindless', traits: ['Malodorous', 'Expendable'] },
      { name: 'Skeleton Spearmen', company: 'Formed company', racial: 'Mindless', traits: ['Expendable', 'Long spears'] },
      { name: 'Skeleton Warriors', company: 'Formed company', racial: 'Mindless', traits: ['Expendable'] },
      { name: 'Barrow Guard', company: 'Elite company', racial: 'Mindless', traits: ['Heavy melee weapons', 'Shieldwall'] },
      { name: 'Skeleton Riders', company: 'Formed company', racial: 'Mindless', traits: ['Expendable', 'Mounted'] },
      { name: 'Vampire Knights', company: 'Elite company', racial: '', traits: ['Mounted', 'Furious charge', 'Feast'] },
      { name: 'Ghosts', company: 'Irregular company', racial: 'Mindless', traits: ['Ephemeral', 'Heavy melee weapons'] },
      { name: 'Dire Wolves', company: 'Fantastic beast', racial: '', traits: ['Fast', 'Furious charge'] },
      { name: 'Ghouls', company: 'Irregular company', racial: '', traits: ['Fast', 'Poison', 'Skirmishers'] },
      { name: 'Giant Bats', company: 'Fantastic beast', racial: '', traits: ['Flying', 'Feast', 'Fast'] },
      { name: 'Death Coach', company: 'Vehicle', racial: 'Mindless', traits: ['Furious charge', 'Terrifying', 'Passenger'] },
      { name: 'Zombie Dragon', company: 'Dragon', racial: 'Mindless', traits: ['Terrifying', 'Flying'] }
    ]
  },
  {
    id: 'orcs',
    name: 'Orcs',
    tagline: 'Belligerent green tide of warriors, boars & war machines',
    defaultRacial: 'Belligerent',
    units: [
      { name: 'Orc Warlord', company: 'Warlord' },
      { name: 'Shaman', company: 'Magic-user' },
      { name: 'Orc Chieftain', company: 'Captain' },
      { name: 'Orc Assassin', company: 'Rogue' },
      { name: 'Orc Warriors', company: 'Formed company', racial: 'Belligerent', traits: ['Berserk', 'Fast'] },
      { name: 'Orc Archers', company: 'Formed company', racial: 'Belligerent', traits: ['Shooting'] },
      { name: 'Great Orcs', company: 'Formed company', racial: 'Belligerent', traits: ['Berserk', 'Furious charge', 'Heavy melee weapons'] },
      { name: 'Orc Boar Riders', company: 'Formed company', racial: 'Belligerent', traits: ['Doughty', 'Furious charge', 'Mounted'] },
      { name: 'Orc Boar Chariot', company: 'Vehicle', racial: 'Belligerent', traits: ['Berserk', 'Furious charge', 'Reckless'] },
      { name: 'Feral Orcs', company: 'Irregular company', racial: 'Belligerent', traits: ['Doughty', 'Foresters', 'Poison'] },
      { name: 'Iron Orcs', company: 'Elite company', racial: 'Belligerent', traits: ['Doughty', 'Proud', 'Heavy melee weapons'] },
      { name: 'Orc Catapult', company: 'Ordnance battery', racial: '', traits: ['Artillery (indirect)', 'Heavy missile weapons'] },
      { name: 'Orc Bolt Thrower', company: 'Ordnance battery', racial: '', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Wyvern', company: 'Fantastic beast', racial: '', traits: ['Flying', 'Poison', 'Passenger'] },
      { name: 'Giant', company: 'Fantastic beast', racial: '', traits: ['Giant', 'Heavy melee weapons', 'Feast'] },
      { name: 'Trolls', company: 'Irregular company', racial: '', traits: ['Monstrous', 'Regenerate'] }
    ]
  },
  {
    id: 'goblins',
    name: 'Goblins',
    tagline: 'Chaotic swarms, wolf riders, cave beasts & contraptions',
    defaultRacial: 'Unreliable',
    units: [
      { name: 'Goblin King', company: 'Warlord' },
      { name: 'Shaman', company: 'Magic-user' },
      { name: 'Goblin Chieftain', company: 'Captain' },
      { name: 'Goblin Cutthroat', company: 'Rogue' },
      { name: 'Goblin Warriors', company: 'Irregular company', racial: 'Unreliable', traits: ['Furious charge', 'Shooting (mixed)'] },
      { name: 'Wolf Riders', company: 'Irregular company', racial: 'Unreliable', traits: ['Berserk', 'Shooting (mixed)', 'Mounted'] },
      { name: 'Cave Goblins', company: 'Irregular company', racial: 'Unreliable', traits: ['Furious charge', 'Shooting (mixed)', 'Stimulants'] },
      { name: 'Goblin Spider Riders', company: 'Irregular company', racial: 'Unreliable', traits: ['Fast', 'Foresters', 'Poison'] },
      { name: 'Goblin Wolf Chariot', company: 'Vehicle', racial: 'Unreliable', traits: ['Furious charge', 'Shooting (mixed)'] },
      { name: 'Trolls', company: 'Irregular company', racial: '', traits: ['Monstrous', 'Regenerate'] },
      { name: 'Glider Catapult', company: 'Ordnance battery', racial: 'Unreliable', traits: ['Artillery (indirect)'] },
      { name: 'Giant', company: 'Fantastic beast', racial: '', traits: ['Giant', 'Heavy melee weapons', 'Feast'] },
      { name: 'Battlewagon', company: 'Vehicle', racial: 'Unreliable', traits: ['Furious charge', 'Heavy melee weapons'] },
      { name: 'Forest Goblins', company: 'Irregular company', racial: 'Unreliable', traits: ['Foresters'] },
      { name: 'Goblin Bolt Thrower', company: 'Ordnance battery', racial: 'Unreliable', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Goblin Catapult', company: 'Ordnance battery', racial: 'Unreliable', traits: ['Artillery (indirect)'] },
      { name: 'Cave Beast Herd', company: 'Fantastic beast', racial: 'Unreliable', traits: ['Proud'] },
      { name: 'Colossal Spider', company: 'Fantastic beast', racial: 'Unreliable', traits: ['Giant', 'Shooting (mixed)', 'Foresters'] }
    ]
  },
  {
    id: 'ogres',
    name: 'Ogres',
    tagline: 'Monstrous shock infantry, cannoneers & tundra beasts',
    defaultRacial: 'Monstrous',
    units: [
      { name: 'Ogre Tyrant', company: 'Warlord' },
      { name: 'Ogre Captain', company: 'Captain' },
      { name: 'Flame Shaman', company: 'Magic-user' },
      { name: 'Ogre Hunter', company: 'Rogue' },
      { name: 'Ogre Warriors', company: 'Formed company', racial: 'Monstrous', traits: ['Doughty'] },
      { name: 'Ogre Heavy Guard', company: 'Elite company', racial: 'Monstrous', traits: ['Doughty', 'Heavy melee weapons'] },
      { name: 'Ogre Cannoneers', company: 'Formed company', racial: 'Monstrous', traits: ['Shooting', 'Powerful missile weapons', 'Doughty'] },
      { name: 'Goblin Lackeys', company: 'Irregular company', racial: '', traits: ['Unreliable'] },
      { name: 'Yetis', company: 'Fantastic beast', racial: 'Monstrous', traits: ['Fast', 'Heavy melee weapons', 'Highlanders'] },
      { name: 'Cave Stalkers', company: 'Fantastic beast', racial: 'Monstrous', traits: ['Furious charge', 'Feast'] },
      { name: 'Woolly Rhino Riders', company: 'Formed company', racial: 'Monstrous', traits: ['Mounted', 'Furious charge'] },
      { name: 'Beast Catapults', company: 'Ordnance battery', racial: 'Artillery (indirect)', traits: ['Heavy missile weapons', 'Mounted'] },
      { name: 'Sabretooths', company: 'Fantastic beast', racial: 'Ephemeral', traits: ['Fast', 'Furious charge'] },
      { name: 'Ogre Veterans', company: 'Formed company', racial: 'Monstrous', traits: ['Doughty', 'Proud'] },
      { name: 'Captive Giant', company: 'Fantastic beast', racial: 'Giant', traits: ['Heavy melee weapons', 'Feast'] }
    ]
  },
  {
    id: 'saurian-legions',
    name: 'Saurian Legions',
    tagline: 'Regenerating temple legions, swift scouts & ancient reptiles',
    defaultRacial: 'Regenerate',
    units: [
      { name: 'Elder Mage-Priest', company: 'Mage-lord' },
      { name: 'Saurian Veteran', company: 'Captain' },
      { name: 'Gecko Priest', company: 'Magic-user' },
      { name: 'Saurian Stalker', company: 'Rogue' },
      { name: 'Saurian Warriors', company: 'Formed company', racial: 'Regenerate', traits: ['Furious charge'] },
      { name: 'Gecko Skirmishers', company: 'Irregular company', racial: 'Regenerate', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Temple Guard', company: 'Elite company', racial: 'Regenerate', traits: ['Berserk', 'Proud'] },
      { name: 'Raptor Riders', company: 'Formed company', racial: 'Regenerate', traits: ['Monstrous', 'Mounted'] },
      { name: 'Crocodilian Brutes', company: 'Formed company', racial: 'Regenerate', traits: ['Monstrous', 'Heavy melee weapons'] },
      { name: 'Chameleon Scouts', company: 'Irregular company', racial: 'Regenerate', traits: ['Shooting', 'Ephemeral'] },
      { name: 'Pterosaur Riders', company: 'Formed company', racial: 'Regenerate', traits: ['Flying', 'Thrown weapons'] },
      { name: 'Fire Salamander', company: 'Fantastic beast', racial: 'Regenerate', traits: ['Shooting', 'Powerful missile weapons'] },
      { name: 'Armored Stegosaur', company: 'Dragon', racial: '', traits: ['Giant', 'Shooting (mixed)', 'Slow'] },
      { name: 'Armored Ankylosaur', company: 'Dragon', racial: '', traits: ['Artillery', 'Heavy missile weapons'] }
    ]
  },
  {
    id: 'dark-elves',
    name: 'Dark Elves',
    tagline: 'Swift raiders, murderous elites & monstrous beasts',
    defaultRacial: 'Fast',
    units: [
      { name: 'Dark Lord', company: 'Warlord' },
      { name: 'Supreme Sorceress', company: 'Mage-lord' },
      { name: 'Master', company: 'Captain' },
      { name: 'Sorceress', company: 'Magic-user' },
      { name: 'Assassin', company: 'Rogue' },
      { name: 'Dark Spearmen', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Long spears'] },
      { name: 'Dark Crossbowmen', company: 'Elite company', racial: 'Fast', traits: ['Shooting', 'Heavy missile weapons'] },
      { name: 'Corsair Raiders', company: 'Irregular company', racial: 'Fast', traits: ['Amphibious', 'Doughty'] },
      { name: 'Shadow Riders', company: 'Elite company', racial: 'Fast', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Obsidian Tower Guard', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Long spears', 'Heavy melee weapons'] },
      { name: 'Greatsword Executioners', company: 'Elite company', racial: 'Fast', traits: ['Drilled', 'Heavy melee weapons', 'Furious charge'] },
      { name: 'Shadow Stalkers', company: 'Elite company', racial: 'Fast', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Raptor Knights', company: 'Elite company', racial: 'Fast', traits: ['Monstrous', 'Mounted'] },
      { name: 'Blood Acolytes', company: 'Irregular company', racial: 'Fast', traits: ['Doughty', 'Furious charge', 'Stimulants'] },
      { name: 'Repeater Bolt Thrower', company: 'Ordnance battery', racial: '', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Hydra', company: 'Dragon', racial: '', traits: ['Regenerate', 'Monstrous'] },
      { name: 'Manticore', company: 'Fantastic beast', racial: '', traits: ['Flying', 'Poison', 'Passenger'] },
      { name: 'Blood Shrine Chariot', company: 'Vehicle', racial: '', traits: ['Furious charge', 'Stimulants'] }
    ]
  },
  {
    id: 'eastern-shogunate',
    name: 'Eastern Shogunate',
    tagline: 'Samurai retinues, ashigaru levies, shinobi & oni',
    defaultRacial: '',
    units: [
      { name: 'Shogun', company: 'Warlord' },
      { name: 'Daimyo', company: 'Captain' },
      { name: 'Shugenja', company: 'Magic-user' },
      { name: 'Kensai', company: 'Rogue' },
      { name: 'Yari Ashigaru', company: 'Irregular company', traits: ['Long spears'] },
      { name: 'Naginata Ashigaru', company: 'Formed company', traits: ['Heavy melee weapons'] },
      { name: 'Yumi Ashigaru', company: 'Formed company', traits: ['Shooting (skilled)'] },
      { name: 'Teppo Ashigaru', company: 'Formed company', traits: ['Shooting', 'Heavy missile weapons'] },
      { name: 'Warrior Monks', company: 'Irregular company', traits: ['Berserk', 'Doughty', 'Reliable'] },
      { name: 'Samurai Warriors', company: 'Elite company', traits: ['Fast', 'Reliable', 'Shooting'] },
      { name: 'Naginata Samurai', company: 'Elite company', traits: ['Reliable', 'Heavy melee weapons'] },
      { name: 'Yari Samurai', company: 'Elite company', traits: ['Reliable', 'Long spears'] },
      { name: 'Samurai Cavalry', company: 'Elite company', traits: ['Furious charge', 'Mounted', 'Shooting'] },
      { name: 'Komainu Riders', company: 'Elite company', traits: ['Furious charge', 'Monstrous', 'Mounted'] },
      { name: 'Shinobi', company: 'Irregular company', traits: ['Doughty', 'Emerge', 'Poison'] },
      { name: 'Oni', company: 'Elite company', traits: ['Monstrous', 'Doughty', 'Heavy melee weapons'] },
      { name: 'Cannon', company: 'Ordnance battery', traits: ['Artillery', 'Barrage', 'Powerful missile weapons'] }
    ]
  },
  {
    id: 'mongols',
    name: 'Mongols',
    tagline: 'Horse-archer tumens, siege engines & steppe legends',
    defaultRacial: 'Mounted',
    units: [
      { name: 'Khan', company: 'Warlord' },
      { name: 'Mongol Commander', company: 'Captain' },
      { name: 'Khishigten', company: 'Rogue' },
      { name: 'Shaman', company: 'Magic-user' },
      { name: 'Unarmed Driven Civilians', company: 'Irregular company', traits: ['Rabble', 'Expendable'] },
      { name: 'Other Nomadic Cavalry', company: 'Irregular company', traits: ['Mounted', 'Shooting', 'Skirmishers'] },
      { name: 'Tumen Cavalry', company: 'Irregular company', racial: 'Mounted', traits: ['Fast', 'Shooting (skilled)', 'Skirmishers'] },
      { name: 'Armored Tumen Cavalry', company: 'Formed company', racial: 'Mounted', traits: ['Fast', 'Furious charge', 'Shooting (skilled)'] },
      { name: "Khan's Guard", company: 'Elite company', racial: 'Mounted', traits: ['Fast', 'Furious charge', 'Shooting (skilled)'] },
      { name: 'Trebuchet', company: 'Ordnance battery', traits: ['Artillery (indirect)', 'Heavy missile weapons'] },
      { name: 'Death Worm', company: 'Dragon', traits: ['Emerge', 'Monstrous', 'Malodorous'] },
      { name: 'Almas', company: 'Fantastic beast', racial: 'Monstrous', traits: ['Furious charge', 'Feast'] }
    ]
  },
  {
    id: 'free-company',
    name: 'Free Company Mercenaries',
    tagline: 'Battle-hardened mercenary company & allied regiments',
    defaultRacial: '',
    units: [
      { name: 'Mercenary Commander', company: 'Warlord' },
      { name: 'Bright Battle-Mage', company: 'Magic-user' },
      { name: 'Scout Captain', company: 'Captain' },
      { name: 'Cavalry Captain', company: 'Captain' },
      { name: 'Artillery Officer', company: 'Rogue' },
      { name: 'Veteran Mercenary Cavalry', company: 'Elite company', traits: ['Drilled', 'Furious charge', 'Mounted'] },
      { name: 'Veteran Mercenary Infantry', company: 'Elite company', traits: ['Drilled', 'Shieldwall'] },
      { name: 'Veteran Crossbowmen', company: 'Elite company', traits: ['Drilled', 'Shooting', 'Heavy missile weapons'] },
      { name: 'Mercenary Field Cannon', company: 'Ordnance battery', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Heavy Mercenary Horse', company: 'Formed company', traits: ['Furious charge', 'Mounted'] },
      { name: 'Borderland Bowmen', company: 'Formed company', traits: ['Skirmishers', 'Shooting'] },
      { name: 'Noble Retinue Guard', company: 'Formed company', traits: ['Drilled', 'Heavy melee weapons'] },
      { name: 'Dwarf Warriors', company: 'Formed company', racial: 'Doughty', traits: ['Drilled', 'Shieldwall', 'Proud'] },
      { name: 'Flagellants', company: 'Irregular company', traits: ['Furious charge', 'Heavy melee weapons', 'Stimulants'] },
      { name: 'Heavy Greatswords', company: 'Elite company', traits: ['Drilled', 'Heavy melee weapons'] },
      { name: 'Heavy Field Cannon', company: 'Ordnance battery', traits: ['Artillery', 'Thrown weapons', 'Powerful missile weapons'] },
      { name: 'Siege Mortar', company: 'Ordnance battery', traits: ['Artillery (indirect)', 'Powerful missile weapons'] },
      { name: 'Armored Steam Engine', company: 'Vehicle', traits: ['Artillery', 'Heavy missile weapons', 'Shooting (mixed)'] },
      { name: 'Outlaw Infantry', company: 'Formed company', racial: 'Unreliable', traits: ['Reckless'] },
      { name: 'Mercenary Ogres', company: 'Formed company', racial: 'Monstrous', traits: ['Doughty'] },
      { name: 'Northern Berserker Cavalry', company: 'Formed company', traits: ['Berserk', 'Heavy melee weapons', 'Mounted'] },
      { name: 'Woodland Elf Scouts', company: 'Elite company', racial: 'Fast', traits: ['Foresters', 'Long spears', 'Shieldwall'] },
      { name: 'Elf Archers', company: 'Elite company', racial: 'Fast', traits: ['Foresters', 'Shooting (skilled)', 'Skirmishers'] }
    ]
  },

  // ========================================================================
  // Additional Fantasy Example Army Lists (Fantastic Battles v1.2)
  // ========================================================================
  {
    id: 'free-men',
    name: 'Free Men',
    category: 'fantasy',
    tagline: 'Brutal, swift steppe & highland warbands led by sworn warriors',
    defaultRacial: '',
    units: [
      { name: 'Warlord', company: 'Warlord' },
      { name: 'Seer', company: 'Magic-user' },
      { name: 'Chieftain', company: 'Captain' },
      { name: 'Champion', company: 'Rogue' },
      { name: 'Sworn Warriors', company: 'Elite company', traits: ['Fast', 'Furious charge', 'Mounted'] },
      { name: 'Mounted Raiders', company: 'Irregular company', traits: ['Furious charge', 'Mounted'] },
      { name: 'Outriders', company: 'Irregular company', traits: ['Mounted', 'Shooting (mixed)'] },
      { name: 'Horse Archers', company: 'Irregular company', traits: ['Mounted', 'Shooting', 'Skirmishers'] },
      { name: 'Light Chariots', company: 'Vehicle', traits: ['Barrage', 'Fast', 'Skirmishers'] },
      { name: 'Chosen Warriors', company: 'Irregular company', traits: ['Berserk', 'Doughty', 'Furious charge'] },
      { name: 'Berserkers', company: 'Irregular company', traits: ['Berserk', 'Furious charge', 'Stimulants'] },
      { name: 'Archers', company: 'Irregular company', traits: ['Foresters', 'Shooting'] },
      { name: 'Scouts', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Wardogs', company: 'Irregular company', traits: ['Expendable', 'Furious charge', 'Warbeasts'] },
      { name: 'War Mammoth', company: 'Fantastic beast', traits: ['Furious charge', 'Giant'] }
    ]
  },
  {
    id: 'inquisitors-true-faith',
    name: 'Inquisitors of the True Faith',
    category: 'fantasy',
    tagline: 'Magic-resistant zealots, paladins, witch hunters & angels',
    defaultRacial: 'Mundane',
    units: [
      { name: 'Grand Inquisitor', company: 'Mage-lord' },
      { name: 'Inquisitor', company: 'Captain' },
      { name: 'Witch-Smeller', company: 'Rogue' },
      { name: 'Paladins', company: 'Elite company', racial: 'Mundane', traits: ['Furious charge', 'Mounted', 'Proud'] },
      { name: 'Dismounted Paladins', company: 'Elite company', racial: 'Mundane', traits: ['Heavy melee weapons', 'Proud'] },
      { name: 'Templar Sisters', company: 'Formed company', racial: 'Mundane', traits: ['Doughty'] },
      { name: 'Brethren', company: 'Formed company', racial: 'Mundane', traits: ['Thrown weapons'] },
      { name: 'Brethren Spearmen', company: 'Formed company', racial: 'Mundane', traits: ['Long spears'] },
      { name: 'Brethren Crossbows', company: 'Formed company', racial: 'Mundane', traits: ['Heavy missile weapons', 'Shooting'] },
      { name: 'Flagellants', company: 'Irregular company', racial: 'Mundane', traits: ['Doughty', 'Furious charge', 'Stimulants'] },
      { name: 'Witch Hunters', company: 'Elite company', racial: 'Mundane', traits: ['Emerge', 'Fast'] },
      { name: 'Angry Mob', company: 'Irregular company', racial: 'Mundane', traits: ['Expendable', 'Malodorous'] },
      { name: 'War-Wagon', company: 'Vehicle', racial: 'Mundane', traits: ['Doughty', 'Shooting (mixed)'] },
      { name: 'Angel', company: 'Dragon', racial: '', traits: ['Ephemeral', 'Flying'] }
    ]
  },
  {
    id: 'infernal-legions',
    name: 'Infernal Legions',
    category: 'fantasy',
    tagline: 'Abyssal horrors, arch-fiends, hell hounds & cultists',
    defaultRacial: '',
    units: [
      { name: 'Sorcerer', company: 'Magic-user' },
      { name: 'Captain of Hell', company: 'Captain' },
      { name: 'Torturer', company: 'Rogue' },
      { name: 'Arch-Fiend', company: 'Dragon', traits: ['Character (Mage-lord)', 'Giant', 'Terrifying'] },
      { name: 'Plague Fiend', company: 'Dragon', traits: ['Giant', 'Malodorous', 'Poison'] },
      { name: 'Wrath Fiend', company: 'Dragon', traits: ['Berserk', 'Giant', 'Heavy melee weapons'] },
      { name: 'Lesser Fiends', company: 'Formed company', traits: ['Fast', 'Furious charge', 'Monstrous'] },
      { name: 'Venom Fiends', company: 'Fantastic beast', traits: ['Barrage', 'Fast', 'Powerful missile weapons'] },
      { name: 'Succubi', company: 'Elite company', traits: ['Fast', 'Flying', 'Reckless'] },
      { name: 'Hell Hounds', company: 'Fantastic beast', traits: ['Berserk', 'Feast', 'Reckless'] },
      { name: 'Sworn Warriors', company: 'Elite company', traits: ['Furious charge', 'Heavy melee weapons', 'Shieldwall'] },
      { name: 'Ruinous Marauders', company: 'Formed company', traits: ['Furious charge', 'Reckless', 'Warbeasts'] },
      { name: 'Cultists', company: 'Irregular company', traits: ['Doughty', 'Furious charge', 'Stimulants'] }
    ]
  },
  {
    id: 'pastoral-halflings',
    name: 'Pastoral Halflings',
    category: 'fantasy',
    tagline: 'Stout rural militia, poultry scouts, treefolk & cockatrices',
    defaultRacial: 'Militia',
    units: [
      { name: 'Halfling Sheriff', company: 'Warlord' },
      { name: 'Halfling Librarian', company: 'Magic-user' },
      { name: 'Halfling Squire', company: 'Captain' },
      { name: 'Halfling Adventurer', company: 'Rogue' },
      { name: 'Halfling Yeomanry', company: 'Formed company', racial: 'Militia', traits: ['Mounted'] },
      { name: 'Halfling Poultry Scouts', company: 'Irregular company', racial: 'Militia', traits: ['Barrage', 'Fast', 'Skirmishers'] },
      { name: 'Halfling Hearthguard', company: 'Elite company', racial: 'Militia', traits: ['Long spears'] },
      { name: 'Halfling Militia Archers', company: 'Formed company', racial: 'Militia', traits: ['Shooting'] },
      { name: 'Halfling Kitchen Militia', company: 'Formed company', racial: 'Militia', traits: ['Regenerate'] },
      { name: 'Halfling Truffle-Hunters', company: 'Irregular company', racial: 'Militia', traits: ['Foresters'] },
      { name: 'Halfling Game Wardens', company: 'Irregular company', racial: 'Militia', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Halfling Catapults', company: 'Ordnance battery', racial: '', traits: ['Artillery (indirect)'] },
      { name: 'Treefolk', company: 'Formed company', racial: '', traits: ['Foresters', 'Monstrous'] },
      { name: 'Cockatrice', company: 'Fantastic beast', racial: '', traits: ['Barrage', 'Flying'] }
    ]
  },
  {
    id: 'burgher-halflings',
    name: 'Burgher Halflings',
    category: 'fantasy',
    tagline: 'Mercantile city-republic guilds, hackbuts & mercenary giants',
    defaultRacial: 'Militia',
    units: [
      { name: 'Burgher-Meister', company: 'Warlord' },
      { name: 'Troubadour', company: 'Magic-user' },
      { name: 'Meister', company: 'Captain' },
      { name: 'Merchant Adventurer', company: 'Rogue' },
      { name: 'Mounted Burghers', company: 'Elite company', racial: 'Militia', traits: ['Doughty', 'Furious charge', 'Mounted'] },
      { name: 'Burghers-at-Arms', company: 'Elite company', racial: 'Militia', traits: ['Doughty', 'Heavy melee weapons'] },
      { name: 'Guild Man-Catchers', company: 'Formed company', racial: 'Militia', traits: ['Doughty', 'Pikes'] },
      { name: 'Guild Spearmen', company: 'Formed company', racial: 'Militia', traits: ['Long spears'] },
      { name: 'Guild Swordsmen', company: 'Formed company', racial: 'Militia', traits: ['Fast'] },
      { name: 'Guild Halberdiers', company: 'Formed company', racial: 'Militia', traits: ['Heavy melee weapons'] },
      { name: 'Guild Archers', company: 'Formed company', racial: 'Militia', traits: ['Shooting (skilled)'] },
      { name: 'Guild Mounted Archers', company: 'Formed company', racial: 'Militia', traits: ['Mounted', 'Shooting', 'Skirmishers'] },
      { name: 'Guild Hackbuts', company: 'Ordnance battery', racial: '', traits: ['Artillery', 'Heavy missile weapons'] },
      { name: 'Urchin Slingers', company: 'Irregular company', racial: 'Militia', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Rat Swarms', company: 'Irregular company', racial: '', traits: ['Emerge', 'Poison', 'Swarm'] },
      { name: 'Mercenary Giant', company: 'Fantastic beast', racial: '', traits: ['Belligerent', 'Giant', 'Heavy melee weapons'] }
    ]
  },
  {
    id: 'dwarven-kingdoms',
    name: 'Dwarven Kingdoms',
    category: 'fantasy',
    tagline: 'Doughty mountain holds, huscarls, bear-riders & siege engines',
    defaultRacial: 'Doughty',
    units: [
      { name: 'Dwarven King', company: 'Warlord' },
      { name: 'Dwarven Rune-Caster', company: 'Magic-user' },
      { name: 'Dwarven Jarl', company: 'Captain' },
      { name: 'Dwarven Oath-Breaker', company: 'Rogue' },
      { name: 'Dwarven Huscarls', company: 'Elite company', racial: 'Doughty', traits: ['Heavy melee weapons', 'Reliable'] },
      { name: 'Dwarven Shieldwall', company: 'Formed company', racial: 'Doughty', traits: ['Shieldwall'] },
      { name: 'Dwarven Crossbowmen', company: 'Formed company', racial: 'Doughty', traits: ['Shooting', 'Heavy missile weapons'] },
      { name: 'Dwarven Bear-Riders', company: 'Formed company', racial: 'Doughty', traits: ['Berserk', 'Monstrous', 'Mounted'] },
      { name: 'Dwarven Miners', company: 'Irregular company', racial: 'Doughty', traits: ['Emerge', 'Heavy melee weapons'] },
      { name: 'Dwarven Outcasts', company: 'Irregular company', racial: 'Doughty', traits: ['Expendable', 'Furious charge', 'Stimulants'] },
      { name: 'Ballistae', company: 'Ordnance battery', racial: 'Doughty', traits: ['Artillery', 'Heavy missile weapons', 'Thrown weapons'] },
      { name: 'Catapult', company: 'Ordnance battery', racial: 'Doughty', traits: ['Artillery (indirect)', 'Powerful missile weapons'] },
      { name: 'Murder of Ravens', company: 'Irregular company', racial: '', traits: ['Feast', 'Flying', 'Swarm'] }
    ]
  },
  {
    id: 'ziggurat-dwarves',
    name: 'Ziggurat Dwarves',
    category: 'fantasy',
    tagline: 'Desert city-states with djinn, flying carpets & lion chariots',
    defaultRacial: 'Doughty',
    units: [
      { name: 'Dwarven Shepherd-King', company: 'Warlord' },
      { name: 'Dwarven Magi', company: 'Magic-user' },
      { name: 'Dwarven Captain', company: 'Captain' },
      { name: 'Djinn', company: 'Fantastic beast', racial: '', traits: ['Character (Magic-user)', 'Monstrous', 'Ephemeral'] },
      { name: 'Lammasu', company: 'Fantastic beast', racial: 'Doughty', traits: ['Flying', 'Passenger'] },
      { name: 'Acolytes on Flying Carpets', company: 'Irregular company', racial: 'Doughty', traits: ['Fast', 'Flying', 'Shooting'] },
      { name: 'Lion-Drawn Chariots', company: 'Vehicle', racial: 'Doughty', traits: ['Berserk', 'Feast', 'Passenger'] },
      { name: 'Ziggurat Guard', company: 'Elite company', racial: 'Doughty', traits: ['Drilled', 'Heavy melee weapons'] },
      { name: 'Shield-Bearers', company: 'Formed company', racial: 'Doughty', traits: ['Drilled', 'Long spears', 'Shieldwall'] },
      { name: 'Ballistae', company: 'Ordnance battery', racial: 'Doughty', traits: ['Artillery', 'Heavy missile weapons', 'Thrown weapons'] },
      { name: 'Dwarven Highlanders', company: 'Irregular company', racial: 'Doughty', traits: ['Berserk', 'Furious charge'] }
    ]
  },
  {
    id: 'wyld-elves',
    name: 'Wyld Elves',
    category: 'fantasy',
    tagline: 'Northern woodland hunters, stag-riders, the Wyld Hunt & treefolk',
    defaultRacial: 'Fast',
    units: [
      { name: 'Queen of the Wood', company: 'Warlord' },
      { name: 'Huldra', company: 'Magic-user' },
      { name: 'Forest Pathfinder', company: 'Captain' },
      { name: 'Sylvan Dancer', company: 'Rogue' },
      { name: 'Wyld Elf Stag-Riders', company: 'Elite company', racial: 'Fast', traits: ['Foresters', 'Furious charge', 'Mounted'] },
      { name: 'Wyld Elf Guardians', company: 'Elite company', racial: 'Fast', traits: ['Foresters', 'Long spears', 'Shieldwall'] },
      { name: 'Wyld Elf Rangers', company: 'Elite company', racial: 'Fast', traits: ['Poison', 'Shooting (skilled)', 'Skirmishers'] },
      { name: 'The Wyld Hunt', company: 'Fantastic beast', racial: 'Fast', traits: ['Feast', 'Ephemeral', 'Furious charge'] },
      { name: 'Giant Eagle', company: 'Fantastic beast', racial: 'Fast', traits: ['Flying', 'Proud'] },
      { name: 'Great Bear', company: 'Fantastic beast', racial: '', traits: ['Foresters', 'Berserk'] },
      { name: 'Tree Shepherd', company: 'Dragon', racial: '', traits: ['Foresters', 'Giant', 'Slow'] },
      { name: 'Treefolk', company: 'Formed company', racial: '', traits: ['Foresters', 'Monstrous'] }
    ]
  },
  {
    id: 'beastfolk',
    name: 'Beastfolk',
    category: 'fantasy',
    tagline: 'Mountain-keep raiders, thegns, moohemoths, bog trolls & shroomlings',
    defaultRacial: 'Highlanders',
    units: [
      { name: 'The Red King', company: 'Warlord' },
      { name: 'Wyrd Sister', company: 'Magic-user' },
      { name: 'Chieftain', company: 'Captain' },
      { name: 'Beastfolk Chariots', company: 'Vehicle', racial: 'Highlanders', traits: ['Berserk', 'Furious charge'] },
      { name: 'Beastfolk Thegns', company: 'Formed company', racial: 'Highlanders', traits: ['Furious charge', 'Heavy melee weapons', 'Warbeasts'] },
      { name: 'Beastling Levy', company: 'Irregular company', racial: 'Highlanders', traits: ['Long spears', 'Shieldwall', 'Shooting'] },
      { name: 'Beastling Skirmishers', company: 'Irregular company', racial: 'Highlanders', traits: ['Fast', 'Skirmishers', 'Shooting'] },
      { name: 'Moohemoths', company: 'Fantastic beast', racial: 'Highlanders', traits: ['Doughty', 'Heavy melee weapons', 'Passenger'] },
      { name: 'Bog Trolls', company: 'Fantastic beast', racial: 'Highlanders', traits: ['Monstrous', 'Powerful missile weapons', 'Shooting'] },
      { name: 'Mjowls', company: 'Fantastic beast', racial: 'Highlanders', traits: ['Fast', 'Flying', 'Militia'] },
      { name: 'Shroomlings', company: 'Irregular company', racial: '', traits: ['Foresters', 'Mindless', 'Poison'] }
    ]
  },
  {
    id: 'ratkin-hordes',
    name: 'Ratkin Hordes',
    category: 'fantasy',
    tagline: 'Subterranean ratkin hordes, volatile contraptions & swarms',
    defaultRacial: '',
    units: [
      { name: 'Ratkin Seer', company: 'Mage-lord' },
      { name: 'Alchemist', company: 'Magic-user' },
      { name: 'Chieftain', company: 'Captain' },
      { name: 'Master Assassin', company: 'Rogue' },
      { name: 'Ratkin Guard', company: 'Elite company', traits: ['Fast', 'Heavy melee weapons'] },
      { name: 'Ratkin', company: 'Irregular company', traits: ['Expendable', 'Rabble'] },
      { name: 'Assassins', company: 'Irregular company', traits: ['Ephemeral', 'Poison'] },
      { name: 'Plague Acolytes', company: 'Irregular company', traits: ['Heavy melee weapons', 'Malodorous', 'Stimulants'] },
      { name: 'Poison Globadiers', company: 'Irregular company', traits: ['Barrage', 'Poison', 'Skirmishers'] },
      { name: 'Flame-Thrower Teams', company: 'Irregular company', traits: ['Powerful missile weapons', 'Shooting', 'Skirmishers'] },
      { name: 'Long-Rifle Teams', company: 'Ordnance battery', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Rat Swarms', company: 'Irregular company', traits: ['Emerge', 'Poison', 'Swarm'] },
      { name: 'Spiked War-Wheel', company: 'Vehicle', traits: ['Berserk', 'Furious charge', 'Impulsive'] },
      { name: 'Screaming War-Bell', company: 'Vehicle', traits: ['Malodorous', 'Passenger', 'Slow'] },
      { name: 'Giant Rat Horror', company: 'Dragon', traits: ['Giant', 'Terrifying'] }
    ]
  },
  {
    id: 'shadow-legions',
    name: 'Shadow Legions',
    category: 'fantasy',
    tagline: 'The Dark Sovereign, winged shadow beasts & expendable hordes',
    defaultRacial: 'Expendable',
    units: [
      { name: 'Sorcerer', company: 'Magic-user' },
      { name: 'Cursed Captain', company: 'Captain' },
      { name: 'Dark Lieutenant', company: 'Rogue' },
      { name: 'The Dark Sovereign', company: 'Dragon', racial: '', traits: ['Character (Mage-lord)', 'Giant', 'Terrifying'] },
      { name: 'Winged Shadow Beast', company: 'Dragon', racial: '', traits: ['Barrage', 'Flying', 'Giant'] },
      { name: 'Oath-Breakers', company: 'Elite company', racial: 'Expendable', traits: ['Furious charge', 'Heavy melee weapons', 'Reckless'] },
      { name: 'Fallen Men', company: 'Formed company', racial: 'Expendable', traits: ['Fast'] },
      { name: 'Fallen Spearmen', company: 'Formed company', racial: 'Expendable', traits: ['Long spears'] },
      { name: 'Fallen Crossbowmen', company: 'Formed company', racial: 'Expendable', traits: ['Heavy missile weapons', 'Shooting'] },
      { name: 'Goblin Minions', company: 'Irregular company', racial: 'Expendable', traits: ['Furious charge', 'Unreliable'] },
      { name: 'Goblin Minion Archers', company: 'Irregular company', racial: 'Expendable', traits: ['Poison', 'Shooting', 'Unreliable'] },
      { name: 'Orc Minions', company: 'Formed company', racial: 'Expendable', traits: ['Belligerent', 'Berserk', 'Fast'] },
      { name: 'Troll Minions', company: 'Irregular company', racial: 'Expendable', traits: ['Monstrous', 'Regenerate', 'Thrown weapons'] }
    ]
  },
  {
    id: 'the-bacchae',
    name: 'The Bacchae',
    category: 'fantasy',
    tagline: 'Greco-Roman mythic host of Bacchus, satyrs, maenads & centaurs',
    defaultRacial: 'Berserk',
    units: [
      { name: 'Bacchus', company: 'Mage-lord', relic: "Lion's Roar Talisman" },
      { name: 'Pan', company: 'Magic-user', relic: 'Blade of Unsurpassable Power' },
      { name: 'Silenos', company: 'Captain', relic: 'Billowing Banner of Encouragement' },
      { name: 'Eros', company: 'Captain', relic: 'Phoenix Bow of Precision' },
      { name: 'Nymphs', company: 'Fantastic beast', racial: 'Berserk', traits: ['Character (Magic-user)', 'Skirmishers', 'Poison'] },
      { name: 'Satyrs', company: 'Irregular company', racial: 'Berserk', traits: ['Highlanders', 'Shooting (mixed)'] },
      { name: 'Maenads', company: 'Irregular company', racial: 'Berserk', traits: ['Furious charge', 'Heavy melee weapons', 'Stimulants'] },
      { name: 'Centaurs', company: 'Formed company', racial: 'Berserk', traits: ['Mounted', 'Reckless', 'Shooting'] },
      { name: 'Leopards', company: 'Fantastic beast', racial: 'Berserk', traits: ['Ephemeral', 'Fast', 'Feast'] },
      { name: 'Erotes Chariots', company: 'Vehicle', racial: 'Berserk', traits: ['Fast'] },
      { name: 'Yakshi Maiden Guard', company: 'Elite company', racial: 'Berserk', traits: ['Doughty', 'Fast', 'Proud'] },
      { name: 'Elephant', company: 'Fantastic beast', racial: 'Berserk', traits: ['Giant', 'Furious charge', 'Heavy melee weapons'] }
    ]
  },
  {
    id: 'children-of-the-mist',
    name: 'Children of the Mist',
    category: 'fantasy',
    tagline: 'Irish myth & folklore: Fianna, Tuatha Dé Danann, banshees & formorians',
    defaultRacial: 'Belligerent',
    units: [
      { name: 'Ard-Ri', company: 'Warlord' },
      { name: 'Druid', company: 'Magic-user' },
      { name: 'Ri', company: 'Captain' },
      { name: 'Champion', company: 'Rogue' },
      { name: 'Light Chariot', company: 'Vehicle', racial: 'Belligerent', traits: ['Barrage', 'Fast', 'Skirmishers'] },
      { name: 'Fianna', company: 'Elite company', racial: 'Belligerent', traits: ['Foresters', 'Reckless', 'Thrown weapons'] },
      { name: 'Tribal Warriors', company: 'Irregular company', racial: 'Belligerent', traits: ['Doughty', 'Foresters', 'Thrown weapons'] },
      { name: 'Slingers', company: 'Irregular company', racial: 'Belligerent', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Wolves', company: 'Fantastic beast', racial: 'Belligerent', traits: ['Berserk', 'Fast', 'Foresters'] },
      { name: 'Tuatha Dé Danann', company: 'Elite company', racial: 'Belligerent', traits: ['Ephemeral', 'Mounted', 'Proud'] },
      { name: 'Banshees', company: 'Formed company', racial: 'Belligerent', traits: ['Ephemeral', 'Fast', 'Heavy melee weapons'] },
      { name: 'Formorians', company: 'Irregular company', racial: 'Belligerent', traits: ['Berserk', 'Heavy melee weapons', 'Monstrous'] },
      { name: 'Fir Bolg', company: 'Irregular company', racial: 'Belligerent', traits: ['Emerge'] },
      { name: 'Water Horse', company: 'Fantastic beast', racial: 'Belligerent', traits: ['Amphibious', 'Monstrous'] }
    ]
  },

  // ========================================================================
  // Historical Example Army Lists (Fantastic Battles v1.2)
  // ========================================================================
  {
    id: 'homeric-greeks',
    name: 'Homeric Greeks (c.1150 BC)',
    category: 'historical',
    tagline: 'Late Bronze Age Achaeans: Agamemnon, Odysseus, Achilles & Myrmidons',
    defaultRacial: '',
    units: [
      { name: 'Wide Ruling Agamemnon', company: 'Warlord' },
      { name: 'Cunning Odysseus', company: 'Magic-user', relic: "Navigator's Map of Wayfinding" },
      { name: 'Achaean Kings and Princes', company: 'Captain' },
      { name: 'Swift-Footed Achilles', company: 'Rogue', relic: 'Winged Boots of Alacrity' },
      { name: 'Nobles in Chariots', company: 'Vehicle', traits: ['Furious charge', 'Passenger'] },
      { name: 'Achaean Warriors', company: 'Formed company', traits: ['Long spears', 'Shieldwall', 'Shooting (mixed)'] },
      { name: 'Chariot Runners', company: 'Irregular company', traits: ['Fast', 'Thrown weapons'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Myrmidons', company: 'Elite company', traits: ['Berserk', 'Furious charge', 'Reckless'] }
    ]
  },
  {
    id: 'trojans',
    name: 'Trojans (c.1150 BC)',
    category: 'historical',
    tagline: 'Hector, Trojan spearmen, Lycians, Thracians & Amazons',
    defaultRacial: '',
    units: [
      { name: 'Horse-Taming Hector', company: 'Warlord' },
      { name: 'Laocoon or Cassandra', company: 'Magic-user' },
      { name: 'Trojan and Allied Princes', company: 'Captain' },
      { name: 'Man-Killing Penthesileia', company: 'Rogue' },
      { name: 'Nobles in Chariots', company: 'Vehicle', traits: ['Furious charge', 'Passenger'] },
      { name: 'Trojan Spearmen', company: 'Formed company', traits: ['Long spears', 'Shieldwall', 'Shooting (mixed)'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Lycians', company: 'Formed company', traits: ['Doughty', 'Fast', 'Thrown weapons'] },
      { name: 'Paeonians', company: 'Irregular company', traits: ['Highlanders', 'Long spears', 'Shooting'] },
      { name: 'Thracians', company: 'Irregular company', traits: ['Berserk', 'Foresters', 'Thrown weapons'] },
      { name: 'Amazons', company: 'Irregular company', traits: ['Mounted', 'Shooting', 'Skirmishers'] },
      { name: 'Ethiopian Chariots', company: 'Vehicle', traits: ['Fast', 'Shooting'] },
      { name: 'Ethiopian Archers', company: 'Irregular company', traits: ['Doughty', 'Shooting'] }
    ]
  },
  {
    id: 'classical-greeks',
    name: 'Classical Greeks (700–280 BC)',
    category: 'historical',
    tagline: 'Greek poleis, Spartiate hoplites, peltasts & Macedonian hetairoi',
    defaultRacial: '',
    units: [
      { name: 'Strategos', company: 'Warlord' },
      { name: 'Mantis', company: 'Magic-user' },
      { name: 'Polemarch', company: 'Captain' },
      { name: 'Hippeis', company: 'Formed company', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Thessalian Hippeis', company: 'Formed company', traits: ['Doughty', 'Mounted', 'Thrown weapons'] },
      { name: 'Hippokontistai', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Spartiate Hoplites', company: 'Elite company', traits: ['Long spears', 'Proud', 'Shieldwall'] },
      { name: 'Epilektoi Hoplites', company: 'Formed company', traits: ['Doughty', 'Long spears', 'Shieldwall'] },
      { name: 'Hoplites', company: 'Formed company', traits: ['Long spears', 'Shieldwall'] },
      { name: 'Militia or Mercenary Hoplites', company: 'Formed company', traits: ['Long spears', 'Shieldwall', 'Unreliable'] },
      { name: 'Ekdromoi Hoplites', company: 'Irregular company', traits: ['Doughty', 'Long spears', 'Shieldwall'] },
      { name: 'Peltasts', company: 'Irregular company', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Cretan Archers', company: 'Irregular company', traits: ['Doughty', 'Shooting', 'Skirmishers'] },
      { name: 'Thracian Rhomphaioi', company: 'Irregular company', traits: ['Foresters', 'Heavy melee weapons'] },
      { name: 'Illyrian Warriors', company: 'Irregular company', traits: ['Berserk', 'Foresters'] },
      { name: 'Macedonian Hetairoi', company: 'Elite company', traits: ['Furious charge', 'Mounted'] },
      { name: 'Macedonian Tribal Levies', company: 'Irregular company', traits: ['Highlanders', 'Unreliable'] }
    ]
  },
  {
    id: 'achaemenid-persian',
    name: 'Achaemenid Persians (550–329 BC)',
    category: 'historical',
    tagline: 'Great King, Immortals, Sparabara, scythed chariots & satrapal horse',
    defaultRacial: '',
    units: [
      { name: 'Great King', company: 'Warlord' },
      { name: 'Chaldian Magi', company: 'Magic-user' },
      { name: 'Satrap', company: 'Captain' },
      { name: 'Persian Satrapal Guard', company: 'Formed company', traits: ['Doughty', 'Mounted', 'Thrown weapons'] },
      { name: 'Persian Horse', company: 'Formed company', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Hippokontistai', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Hippotoxotai', company: 'Irregular company', traits: ['Mounted', 'Shooting', 'Skirmishers'] },
      { name: 'Persian Scythed Chariot', company: 'Irregular company', traits: ['Expendable', 'Furious charge', 'Reckless'] },
      { name: 'Persian Immortals', company: 'Formed company', traits: ['Proud', 'Shieldwall', 'Shooting'] },
      { name: 'Persian Sparabara', company: 'Irregular company', traits: ['Shieldwall', 'Shooting'] },
      { name: 'Mercenary Hoplites', company: 'Formed company', traits: ['Long spears', 'Shieldwall', 'Unreliable'] },
      { name: 'Subject Spearmen', company: 'Formed company', traits: ['Long spears', 'Militia'] },
      { name: 'Peltasts', company: 'Irregular company', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Hill Tribes', company: 'Irregular company', traits: ['Berserk', 'Highlanders'] },
      { name: 'Conscript Levies', company: 'Irregular company', traits: ['Unreliable'] },
      { name: 'Conscript Archers', company: 'Irregular company', traits: ['Shooting', 'Unreliable'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] }
    ]
  },
  {
    id: 'mid-republican-romans',
    name: 'Mid-Republican Romans (275–105 BC)',
    category: 'historical',
    tagline: 'Manipular legions: velites, hastati, principes, triarii & scorpions',
    defaultRacial: '',
    units: [
      { name: 'Consul', company: 'Warlord' },
      { name: 'Tribune', company: 'Captain' },
      { name: 'Velites', company: 'Irregular company', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Hastati and Principes', company: 'Formed company', traits: ['Drilled', 'Shieldwall', 'Thrown weapons'] },
      { name: 'Levy Hastati and Principes', company: 'Formed company', traits: ['Shieldwall', 'Thrown weapons'] },
      { name: 'Veteran Hastati and Principes', company: 'Elite company', traits: ['Drilled', 'Shieldwall', 'Thrown weapons'] },
      { name: 'Triarii', company: 'Elite company', traits: ['Drilled', 'Long spears', 'Shieldwall'] },
      { name: 'Equites', company: 'Formed company', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Oscans or Samnites', company: 'Irregular company', traits: ['Berserk', 'Highlanders', 'Thrown weapons'] },
      { name: 'Campanian Cavalry', company: 'Formed company', traits: ['Doughty', 'Mounted', 'Thrown weapons'] },
      { name: 'Italiote Greeks', company: 'Formed company', traits: ['Long spears', 'Shieldwall', 'Unreliable'] },
      { name: 'Tarantine Cavalry', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Balearic Slingers', company: 'Irregular company', traits: ['Poison', 'Shooting', 'Skirmishers'] },
      { name: 'Scorpions', company: 'Ordnance battery', traits: ['Artillery', 'Thrown weapons'] }
    ]
  },
  {
    id: 'later-carthaginians',
    name: 'Later Carthaginians (275–146 BC)',
    category: 'historical',
    tagline: 'Hannibalic mercenary armies: war elephants, Sacred Band & Numidians',
    defaultRacial: '',
    units: [
      { name: 'Rb Mhnt', company: 'Warlord' },
      { name: 'Rb Šlšy', company: 'Captain' },
      { name: 'Elephants', company: 'Fantastic beast', traits: ['Furious charge', 'Giant', 'Terrifying'] },
      { name: 'Punic Cavalry', company: 'Formed company', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Gallic Cavalry', company: 'Formed company', traits: ['Furious charge', 'Mounted'] },
      { name: 'Spanish Cavalry', company: 'Irregular company', traits: ['Doughty', 'Mounted'] },
      { name: 'Numidian Cavalry', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Sacred Band', company: 'Formed company', traits: ['Doughty', 'Long spears', 'Shieldwall'] },
      { name: 'Punic Infantry', company: 'Formed company', traits: ['Long spears', 'Shieldwall'] },
      { name: 'Veteran Punic Infantry', company: 'Formed company', traits: ['Reliable', 'Shieldwall', 'Thrown weapons'] },
      { name: 'Gallic Warriors', company: 'Formed company', traits: ['Furious charge', 'Reckless', 'Thrown weapons'] },
      { name: 'Spanish Scutarii', company: 'Irregular company', traits: ['Furious charge', 'Shieldwall', 'Thrown weapons'] },
      { name: 'Spanish Caetrati', company: 'Irregular company', traits: ['Berserk', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Libyan or Numidian Foot', company: 'Irregular company', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Oscans or Samnites', company: 'Irregular company', traits: ['Berserk', 'Highlanders', 'Thrown weapons'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Balearic Slingers', company: 'Irregular company', traits: ['Poison', 'Shooting', 'Skirmishers'] }
    ]
  },
  {
    id: 'early-byzantine',
    name: 'Early Byzantine (AD 583–668)',
    category: 'historical',
    tagline: 'Boukellarioi cataphracts, skoutatoi & Roman artillery of Maurice',
    defaultRacial: '',
    units: [
      { name: 'Magister', company: 'Warlord' },
      { name: 'Tribune', company: 'Captain' },
      { name: 'Boukellarioi Cataphracts', company: 'Elite company', traits: ['Doughty', 'Mounted', 'Shooting (mixed)'] },
      { name: 'Defensores Cavalry', company: 'Formed company', traits: ['Mounted', 'Shooting (mixed)'] },
      { name: 'Optimates Cavalry', company: 'Formed company', traits: ['Furious charge', 'Mounted'] },
      { name: 'Cursores Cavalry', company: 'Irregular company', traits: ['Mounted', 'Shooting', 'Skirmishers'] },
      { name: 'Skoutatoi', company: 'Formed company', traits: ['Long spears', 'Shieldwall', 'Shooting (mixed)'] },
      { name: 'Archers', company: 'Formed company', traits: ['Shooting'] },
      { name: 'Hillmen', company: 'Irregular company', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Ballistae', company: 'Ordnance battery', traits: ['Artillery', 'Thrown weapons'] },
      { name: 'Catapults', company: 'Ordnance battery', traits: ['Artillery (indirect)', 'Powerful missile weapons'] }
    ]
  },
  {
    id: 'sassanians',
    name: 'Sassanians (AD 224–651)',
    category: 'historical',
    tagline: 'Asavaran cataphracts, war elephants, horse archers & Dailami',
    defaultRacial: '',
    units: [
      { name: 'Spahbed', company: 'Warlord' },
      { name: 'Framandar', company: 'Captain' },
      { name: 'Elephants', company: 'Fantastic beast', traits: ['Giant', 'Shooting', 'Terrifying'] },
      { name: 'Asavaran Cavalry', company: 'Elite company', traits: ['Mounted', 'Shooting (mixed)'] },
      { name: 'Asavaran Cataphracts', company: 'Elite company', traits: ['Doughty', 'Mounted', 'Shooting (mixed)'] },
      { name: 'Horse Archers', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Shooting'] },
      { name: 'Arab Cavalry', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Dailami', company: 'Formed company', traits: ['Doughty', 'Furious charge', 'Thrown weapons'] },
      { name: 'Levy Spearmen', company: 'Formed company', traits: ['Long spears', 'Militia'] },
      { name: 'Levy Archers', company: 'Irregular company', traits: ['Shooting', 'Unreliable'] },
      { name: 'Hillmen', company: 'Irregular company', traits: ['Skirmishers', 'Thrown weapons'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] }
    ]
  },
  {
    id: 'anglo-normans',
    name: 'Anglo-Normans (AD 1066–1181)',
    category: 'historical',
    tagline: 'Norman milites, Genoese crossbowmen, Flemish pikemen & archers',
    defaultRacial: '',
    units: [
      { name: 'Count', company: 'Warlord' },
      { name: 'Baron', company: 'Captain' },
      { name: 'Milites', company: 'Elite company', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Bretons or Gascons', company: 'Irregular company', traits: ['Mounted', 'Skirmishers', 'Thrown weapons'] },
      { name: 'Welsh Cavalry', company: 'Formed company', traits: ['Mounted', 'Thrown weapons'] },
      { name: 'Spearmen', company: 'Formed company', traits: ['Long spears', 'Shieldwall'] },
      { name: 'Welsh Spearmen', company: 'Irregular company', traits: ['Foresters', 'Long spears'] },
      { name: 'Flemish Pikemen', company: 'Formed company', traits: ['Doughty', 'Long spears', 'Militia'] },
      { name: 'Crossbowmen', company: 'Irregular company', traits: ['Heavy missile weapons', 'Shooting'] },
      { name: 'Genoese Crossbowmen', company: 'Formed company', traits: ['Heavy missile weapons', 'Shieldwall', 'Shooting'] },
      { name: 'English or Welsh Archers', company: 'Irregular company', traits: ['Shooting (skilled)'] }
    ]
  },
  {
    id: 'hiberno-norse',
    name: 'Hiberno-Norse (AD 795–1300)',
    category: 'historical',
    tagline: 'Irish & Norse-Irish hosts: Fianna, kern, huscarls & berserkers',
    defaultRacial: '',
    units: [
      { name: 'King', company: 'Warlord' },
      { name: 'Sub-King or Chieftain', company: 'Captain' },
      { name: 'Fianna', company: 'Elite company', traits: ['Fast', 'Furious charge', 'Thrown weapons'] },
      { name: 'Mounted Fianna', company: 'Irregular company', traits: ['Doughty', 'Furious charge', 'Mounted'] },
      { name: 'Bonnachts', company: 'Irregular company', traits: ['Foresters', 'Furious charge'] },
      { name: 'Kern', company: 'Irregular company', traits: ['Foresters', 'Shooting (mixed)'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Norse Huscarls', company: 'Elite company', traits: ['Heavy melee weapons', 'Reliable'] },
      { name: 'Ostmen', company: 'Formed company', traits: ['Doughty', 'Shieldwall'] },
      { name: 'Norse Berserkers', company: 'Irregular company', traits: ['Doughty', 'Furious charge', 'Stimulants'] },
      { name: 'Gall-Gaedhil', company: 'Irregular company', traits: ['Berserk', 'Furious charge', 'Expendable'] }
    ]
  },
  {
    id: 'ikko-ikki',
    name: 'Ikko-Ikki (AD 1486–1586)',
    category: 'historical',
    tagline: 'Buddhist peasant rebellions: Monshu, escorted shrines, monks & ronin',
    defaultRacial: '',
    units: [
      { name: 'Monshu', company: 'Mage-lord' },
      { name: 'Ikki Captain', company: 'Captain' },
      { name: 'Escorted Shrine', company: 'Vehicle', traits: ['Character (Magic-user)', 'Reliable', 'Slow'] },
      { name: 'Jodo Shinshu Monks', company: 'Irregular company', traits: ['Berserk', 'Doughty', 'Reliable'] },
      { name: 'Ikko Peasants', company: 'Irregular company', traits: ['Expendable', 'Furious charge'] },
      { name: 'Naginata Ikko', company: 'Irregular company', traits: ['Doughty', 'Heavy melee weapons'] },
      { name: 'Ikko Archers', company: 'Irregular company', traits: ['Doughty', 'Shooting'] },
      { name: 'Ikko Shot', company: 'Irregular company', traits: ['Doughty', 'Powerful missile weapons', 'Shooting'] },
      { name: 'Ronin', company: 'Elite company', traits: ['Reckless', 'Shooting (mixed)'] },
      { name: 'Shinobi', company: 'Irregular company', traits: ['Doughty', 'Emerge', 'Poison'] }
    ]
  },
  {
    id: 'mesoamericans',
    name: 'Mesoamericans (AD 1300–1550)',
    category: 'historical',
    tagline: 'Aztec, Tlaxcalan & Mayan hosts: Huey Tlatoani, suited warriors & priests',
    defaultRacial: '',
    units: [
      { name: 'Huey Tlatoani', company: 'Warlord' },
      { name: 'Cuauhtlahtoh', company: 'Captain' },
      { name: 'Warrior Priests', company: 'Formed company', traits: ['Character (Magic-user)', 'Feast', 'Foresters'] },
      { name: 'Suited Warriors', company: 'Elite company', traits: ['Fast', 'Foresters', 'Furious charge'] },
      { name: 'Cuachic', company: 'Irregular company', traits: ['Doughty', 'Foresters', 'Furious charge'] },
      { name: 'Otomi Warriors', company: 'Irregular company', traits: ['Foresters', 'Furious charge', 'Reliable'] },
      { name: 'Spearmen', company: 'Irregular company', traits: ['Foresters', 'Long spears'] },
      { name: 'Warriors', company: 'Irregular company', traits: ['Foresters', 'Furious charge'] },
      { name: 'Archers or Slingers', company: 'Irregular company', traits: ['Shooting', 'Skirmishers'] },
      { name: 'Chichimec Archers', company: 'Irregular company', traits: ['Furious charge', 'Highlanders', 'Shooting'] }
    ]
  },
  {
    id: 'conquistadors',
    name: 'Conquistadors (AD 1492–1580)',
    category: 'historical',
    tagline: 'Spanish expeditionary forces: hidalgos, harquebusiers, war dogs & allies',
    defaultRacial: '',
    units: [
      { name: 'Adelantado', company: 'Warlord' },
      { name: 'Priest', company: 'Magic-user' },
      { name: 'Capitán', company: 'Captain' },
      { name: 'Conquistadors', company: 'Elite company', traits: ['Drilled', 'Furious charge', 'Mounted'] },
      { name: 'Hidalgos', company: 'Formed company', traits: ['Mounted'] },
      { name: 'Harquebusiers', company: 'Formed company', traits: ['Mounted', 'Powerful missile weapons', 'Shooting'] },
      { name: 'Rodeleros', company: 'Formed company', traits: ['Doughty', 'Drilled', 'Fast'] },
      { name: 'Crossbowmen', company: 'Irregular company', traits: ['Heavy missile weapons', 'Skirmishers', 'Shooting'] },
      { name: 'Pikemen', company: 'Formed company', traits: ['Doughty', 'Pikes'] },
      { name: 'Shot', company: 'Irregular company', traits: ['Powerful missile weapons', 'Shooting'] },
      { name: 'Pike and Shot Militia', company: 'Formed company', traits: ['Pikes', 'Powerful missile weapons', 'Shooting (mixed)'] },
      { name: 'War Dogs', company: 'Irregular company', traits: ['Berserk', 'Furious charge', 'Warbeasts'] },
      { name: 'Cannon', company: 'Ordnance battery', traits: ['Artillery', 'Barrage', 'Powerful missile weapons'] },
      { name: 'Native Warriors', company: 'Irregular company', traits: ['Expendable', 'Foresters', 'Furious charge'] },
      { name: 'Native Archers', company: 'Irregular company', traits: ['Expendable', 'Shooting', 'Skirmishers'] }
    ]
  }
];
