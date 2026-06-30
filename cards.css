/* =============================================================================
   BASE SET  ·  static collectible cards (Skill / Human / Field / Item)
   -----------------------------------------------------------------------------
   These are hand-authored game cards from "Static Cards - Base Set". They are
   structurally different from agent cards: no stats, no flip side. They exist to
   add variety to the Open-a-Pack experience and are browsable in the Vault under
   the "Base Set" tab. Edit/extend by appending to BASE_SET below (or re-import
   the sheet through EliteData.parseCsv + the same field names).
   ============================================================================= */
(function () {
  'use strict';

  // Rarity ladder shared with the pack weighting. Higher = rarer.
  const RARITY = {
    C:  { name: 'Common',     foil: false, weight: 46, color: '#9aa6b8' },
    R:  { name: 'Rare',       foil: false, weight: 26, color: '#6fa8dc' },
    SR: { name: 'Super Rare', foil: true,  weight: 10, color: '#f2cf6b' },
    UR: { name: 'Ultra Rare', foil: true,  weight: 3,  color: '#ff7ab0' },
  };

  // Per-type accent + glyph (glyph is a plain typographic mark, not an emoji).
  const TYPE_META = {
    Skill: { accent: '#5aa0e6', glyph: '✦', tint: '#13243d' },
    Human: { accent: '#e0b24a', glyph: '★', tint: '#2b2410' },
    Field: { accent: '#5fd29a', glyph: '◈', tint: '#0f2a20' },
    Item:  { accent: '#b08ce6', glyph: '◆', tint: '#241a33' },
  };

  const RAW = [
    ['Trouble In Paradise','R','Skill','Customer objects to scheduling, using their spouse as a scapegoat','Strike while the iron is hot!','Book out a couple weeks','When this rebuttal is activated, prompt the customer to decide if the offer is actually important to them and end your turn. If the customer is stubborn-type, this skill rebounds and the agent will have to offer a callback.'],
    ['Decoy Duck','R','Skill','Customer objects to offer stating they would rather receive an email or text','What do you mean by that?','Confrontation','When this rebuttal is activated, prompt the customer to decide if the offer is actually important to them and end your turn. If the customer is stubborn-type, this skill rebounds and the agent will have to offer a callback.'],
    ['Founder JP','UR','Human','Unique Jack Pinsel founder card','get off my bus','Challenge','Destroys all comfort zones on the floor'],
    ['Jack Pinsel','SR','Human','Executive team card','WOOO','Inspire','Boosts morale +50% per turn'],
    ['Bill Kerth','SR','Human','Executive team card','the whole nine','Push','Activates one hour of productive outbounding'],
    ['Lesli Lara-Rojas','SR','Human','Executive team card','boss mama!','Zoom','Onboards a new client, can be re-cast up to 50 times per day.'],
    ['CRM','C','Field','Client CRM','where is the batphone','Login','Activate this field to see Capacity. Can only be played if the user has Batphone equipped.'],
    ['Batphone','SR','Item','','cross-platform interdisciplinary multi-factor authentication','239033','Grants access to CRM field. After using this item, the user has a 20% chance to forget where they put it.'],
    ['Triage Network','C','Field','','are you still there?','Warm Transfer','Activate this field to make the client become impressed with Elite Call'],
    ['Logitech Zone Wireless II','C','Item','','with noise cancelling','Wear','While wearing this item, the user automatically smiles'],
    ['Coffee','C','Item','','good morning','Drink','Draw cards until Focus is in your hand'],
    ['Final Push','R','Skill','','almost there!','Intentional Effort','When this skill is used, the agent can no longer miss rebuttal opportunities. Can also be cast onto campaigns.'],
    ['Focus','R','Skill','','find balance','Call Control','When this skill is used, the agent automatically converts the record through active listening and call control.'],
    ['Power Hour','R','Field','','gold rush','Lock In','Activate this field to scatter money across the floor. Prevents agents from leaving their desk while card is active.'],
    ['Summer Bash','SR','Field','','suns out funds out','Go Outside','Activate this field to sacrifice 80% production for one day. Boosts morale by 200%'],
    ['Manifest Script','C','Skill','','a failure to plan is a plan to fail','Write down your goal','When this skill is used, adds a buff to the user boosting all stats. Makes the day go faster.'],
    ['Dry Spell','R','Skill','When an agent is struggling to convert at the expected rate','when the going gets tough...','Evaluate Options','When this skill is used, the agent reflects on their past calls and creates a new perspective.'],
    ['Hot Streak','R','Skill','When an agent is going above and beyond conversion expectations','...the tough get going','Dig Deep','When this skill is used, the agent eliminates all distractions'],
  ];

  const BASE_SET = RAW.map((r, i) => ({
    kind: 'static',
    id: 'B' + String(i + 1).padStart(3, '0'),
    cardNo: i + 1,
    title: r[0],
    rarity: r[1],
    rarityName: RARITY[r[1]].name,
    type: r[2],
    description: r[3],
    flavor: r[4],
    action: r[5],
    behavior: r[6],
  }));

  window.EliteBaseSet = { BASE_SET, RARITY, TYPE_META };
})();
