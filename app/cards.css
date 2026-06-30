/* =============================================================================
   ELITE CALL — TRADING CARDS · CARD STYLES
   Theming is layered:  .ec-card[data-variant][data-tier]  -> CSS variables
   ============================================================================= */

:root {
  --navy-900: #0b1f3a;
  --navy-800: #122a4d;
  --navy-700: #1b3a63;
  --gold:     #d8a72a;
  --gold-lt:  #f2cf6b;
  --red:      #c2402f;
  --cream:    #f3ead4;
  --paper:    #efe6cf;
  --ink:      #1c2740;
}

/* ---- Card shell ---------------------------------------------------------- */
.ec-card {
  position: relative;
  width: 320px;
  aspect-ratio: 320 / 446;
  border-radius: 16px;
  font-family: 'Oswald', sans-serif;
  color: var(--c-ink);
  user-select: none;
  perspective: 1400px;
  --c-bg: var(--cream);
  --c-ink: var(--ink);
  --c-frame: var(--navy-800);
  --c-accent: var(--gold);
  --c-band: var(--navy-800);
  --c-foil: none;
}
.ec-flip {
  position: absolute; inset: 0;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(.2,.8,.25,1);
}
.ec-card[data-flipped="true"] .ec-flip { transform: rotateY(180deg); }
.ec-face {
  position: absolute; inset: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
  background: var(--c-bg);
  box-shadow: 0 18px 40px -12px rgba(5,12,28,.65), 0 2px 0 rgba(255,255,255,.25) inset;
  border: 1px solid rgba(0,0,0,.15);
}
.ec-face--back { transform: rotateY(180deg); }

/* foil/holo overlay layer */
.ec-foil {
  position: absolute; inset: 0; border-radius: 16px;
  pointer-events: none; mix-blend-mode: screen; opacity: var(--foil-strength, 0);
  background: var(--c-foil);
}

/* ---- Inner padding frame -------------------------------------------------- */
.ec-inner {
  position: absolute; inset: 10px;
  border: 2px solid var(--c-frame);
  border-radius: 10px;
  padding: 11px 12px 12px;
  display: flex; flex-direction: column;
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(0,0,0,.04));
}

/* ---- Top row -------------------------------------------------------------- */
.ec-top { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.ec-stars { display: flex; gap: 2px; font-size: 13px; color: var(--c-accent); letter-spacing: 1px;
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.35)); }
.ec-star-empty { opacity: .22; }
.ec-setbadge {
  font-family: 'Anton', sans-serif; font-size: 14px; letter-spacing: .5px;
  text-transform: uppercase; color: var(--navy-900);
  background: linear-gradient(180deg, var(--gold-lt), var(--gold));
  padding: 3px 12px; border-radius: 999px;
  border: 1.5px solid rgba(0,0,0,.28);
  box-shadow: 0 1px 0 rgba(255,255,255,.6) inset, 0 2px 3px rgba(0,0,0,.25);
  white-space: nowrap;
}
.ec-cardno { font-size: 12px; font-weight: 600; opacity: .72; letter-spacing: .5px; }

/* ---- Portrait ------------------------------------------------------------- */
.ec-portrait {
  position: relative; margin-top: 9px;
  aspect-ratio: 1 / 1; border-radius: 8px; overflow: hidden;
  border: 2px solid var(--c-frame);
  background:
    radial-gradient(120% 120% at 50% 12%, rgba(255,255,255,.18), transparent 60%),
    var(--c-portrait, linear-gradient(160deg, var(--navy-700), var(--navy-900)));
}
.ec-portrait img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ec-halftone {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,.16) 1.4px, transparent 1.5px);
  background-size: 9px 9px; opacity: .5;
}
.ec-monogram {
  position: absolute; inset: 0; display: grid; place-items: center;
  font-family: 'Anton', sans-serif; font-size: 92px; line-height: 1;
  color: rgba(255,255,255,.92);
  text-shadow: 0 4px 14px rgba(0,0,0,.45);
}
.ec-teamtag {
  position: absolute; left: 8px; bottom: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;
  color: #fff; background: rgba(0,0,0,.42); backdrop-filter: blur(2px);
  padding: 2px 8px; border-radius: 4px;
}

/* ---- Name banner ---------------------------------------------------------- */
.ec-namebar {
  margin-top: 10px; text-align: center;
  background: linear-gradient(180deg, var(--c-band), color-mix(in srgb, var(--c-band) 70%, #000));
  border-radius: 7px; padding: 7px 8px;
  border: 1.5px solid rgba(0,0,0,.3);
  box-shadow: 0 1px 0 rgba(255,255,255,.18) inset;
}
.ec-name {
  font-family: 'Anton', sans-serif; color: #fff;
  font-size: 24px; line-height: 1; letter-spacing: .5px; text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0,0,0,.4);
}

/* ---- Stat grid ------------------------------------------------------------ */
.ec-stats { margin-top: 10px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.ec-stat {
  background: linear-gradient(180deg, var(--c-band), color-mix(in srgb, var(--c-band) 75%, #000));
  border-radius: 7px; padding: 7px 4px 5px; text-align: center; color: #fff;
  border: 1px solid rgba(0,0,0,.25);
}
.ec-stat-val { font-family: 'Anton', sans-serif; font-size: 21px; line-height: 1; }
.ec-stat-val small { font-size: 11px; opacity: .8; }
.ec-stat-lbl { font-size: 9.5px; letter-spacing: .8px; text-transform: uppercase; opacity: .72; margin-top: 3px; }

/* ---- Flavor + footer ------------------------------------------------------ */
.ec-flavor {
  margin-top: auto; padding-top: 9px;
  font-family: 'Roboto Slab', Georgia, serif; font-style: italic;
  font-size: 11.5px; line-height: 1.35; text-align: center; color: var(--c-ink);
  opacity: .82; text-wrap: pretty;
}
.ec-footer {
  margin-top: 8px; display: flex; align-items: center; justify-content: space-between;
  border-top: 1px solid rgba(0,0,0,.18); padding-top: 7px;
}
.ec-logo { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700;
  letter-spacing: .5px; text-transform: uppercase; color: var(--c-ink); opacity: .8; }
.ec-logo-dot { width: 13px; height: 13px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff, var(--navy-700) 60%);
  box-shadow: 0 0 0 1.5px var(--gold); }
.ec-season { font-size: 10px; opacity: .6; border: 1px solid rgba(0,0,0,.25);
  border-radius: 4px; padding: 2px 7px; }

/* ---- Back face ------------------------------------------------------------ */
.ec-back-inner { position: absolute; inset: 10px; border: 2px solid var(--c-frame);
  border-radius: 10px; padding: 12px 13px; display: flex; flex-direction: column;
  overflow-y: auto; overflow-x: hidden; scrollbar-width: thin;
  background: linear-gradient(180deg, rgba(255,255,255,.10), rgba(0,0,0,.05)); }
.ec-back-inner::-webkit-scrollbar { width: 6px; }
.ec-back-inner::-webkit-scrollbar-thumb { background: rgba(127,127,127,.35); border-radius: 3px; }

/* Call player */
.ec-call { display: flex; gap: 8px; align-items: flex-start; margin: 6px 0;
  padding: 6px; border-radius: 8px; background: rgba(127,127,127,.10);
  border: 1px solid rgba(127,127,127,.18); }
.ec-play { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
  border: none; color: #fff; font-size: 11px; line-height: 1; display: grid; place-items: center;
  background: var(--c-band); box-shadow: 0 2px 5px rgba(0,0,0,.3); }
.ec-play.on { background: var(--c-accent); color: #10182a; }
.ec-call-body { flex: 1; min-width: 0; }
.ec-call-top { display: flex; justify-content: space-between; gap: 6px; align-items: baseline; }
.ec-call-title { font-size: 11px; font-weight: 600; letter-spacing: .3px; cursor: pointer;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ec-call-dur { font-size: 10px; opacity: .6; font-variant-numeric: tabular-nums; }
.ec-wave { display: flex; align-items: center; gap: 1.5px; height: 16px; margin: 3px 0; color: var(--c-ink); }
.ec-wave span { flex: 1; border-radius: 1px; min-height: 2px; transition: opacity .1s, background .1s; }
.ec-call-meta { display: flex; justify-content: space-between; align-items: center; }
.ec-sent { font-size: 9.5px; letter-spacing: .3px; }
.ec-call-links { display: flex; align-items: center; gap: 8px; }
.ec-demo { font-size: 8.5px; letter-spacing: 1px; text-transform: uppercase; opacity: .5; }
.ec-trellus-link { font-size: 8.5px; letter-spacing: .5px; text-transform: uppercase; color: var(--c-accent);
  text-decoration: none; border: 1px solid rgba(127,127,127,.3); border-radius: 4px; padding: 1px 5px; }
.ec-trellus-link:hover { background: rgba(127,127,127,.15); }
.ec-cobadge { position: absolute; right: 8px; bottom: 8px; background: #fff; border-radius: 4px;
  padding: 2px 4px; box-shadow: 0 1px 4px rgba(0,0,0,.3); display: grid; place-items: center; }
.ec-cobadge img { height: 13px; width: auto; display: block; }
.ec-transcript { font-family: 'Roboto Slab', Georgia, serif; font-style: italic; font-size: 10.5px;
  line-height: 1.35; opacity: .8; margin-top: 5px; }
.ec-back-head { display: flex; justify-content: space-between; align-items: baseline; }
.ec-back-name { font-family: 'Anton', sans-serif; font-size: 19px; text-transform: uppercase; }
.ec-back-ovr { font-family: 'Anton', sans-serif; font-size: 30px; color: var(--c-accent); line-height: 1; }
.ec-back-ovr small { display: block; font-size: 9px; letter-spacing: 1px; color: var(--c-ink); opacity: .6; }
.ec-section-t { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--c-accent); margin: 12px 0 6px; font-weight: 700;
  border-bottom: 1px solid rgba(0,0,0,.15); padding-bottom: 3px; }
.ec-bar-row { display: flex; align-items: center; gap: 8px; margin: 5px 0; }
.ec-bar-lbl { font-size: 10px; width: 64px; text-transform: uppercase; letter-spacing: .5px; opacity: .8; }
.ec-bar-track { flex: 1; height: 7px; border-radius: 4px; background: rgba(0,0,0,.14); overflow: hidden; }
.ec-bar-fill { height: 100%; border-radius: 4px; background: var(--c-band); }
.ec-bar-num { font-size: 11px; font-weight: 700; width: 26px; text-align: right; }
.ec-sg { font-size: 11px; line-height: 1.4; margin: 3px 0; display: flex; gap: 6px; }
.ec-sg-mark { color: var(--c-accent); font-weight: 700; }
.ec-spark { display: flex; align-items: flex-end; gap: 3px; height: 34px; margin-top: 4px; }
.ec-spark span { flex: 1; background: var(--c-band); border-radius: 2px 2px 0 0; opacity: .85; }

/* =============================================================================
   VARIANTS
   ============================================================================= */
/* Vintage cardstock (default) */
.ec-card[data-variant="vintage"] .ec-face {
  background:
    radial-gradient(120% 90% at 50% 0%, #fbf4e2, var(--cream)),
    var(--cream);
}
.ec-card[data-variant="vintage"] .ec-face::after {
  content:''; position:absolute; inset:0; pointer-events:none; opacity:.5;
  background-image: radial-gradient(rgba(120,90,40,.07) 1px, transparent 1.3px);
  background-size: 4px 4px;
}

/* Chrome / holo — dark premium */
.ec-card[data-variant="chrome"] {
  --c-bg: #0e1626; --c-ink: #e8eefc; --c-frame: #34507f; --c-band: #1b2c4d;
}
.ec-card[data-variant="chrome"] .ec-face {
  background: linear-gradient(160deg, #15233d, #0a1120 70%);
}
.ec-card[data-variant="chrome"] .ec-flavor { color: #c2d2f0; }
.ec-card[data-variant="chrome"] .ec-season,
.ec-card[data-variant="chrome"] .ec-footer { border-color: rgba(255,255,255,.14); }
.ec-card[data-variant="chrome"] .ec-bar-track { background: rgba(255,255,255,.12); }
.ec-card[data-variant="chrome"] .ec-section-t { border-color: rgba(255,255,255,.14); }

/* Retro arcade — high-key blocky */
.ec-card[data-variant="arcade"] {
  --c-bg: #fff5e6; --c-ink: #20232e; --c-frame: #20232e; --c-accent: #e0452f; --c-band: #20232e;
}
.ec-card[data-variant="arcade"] .ec-face {
  background: repeating-linear-gradient(135deg, #fff5e6 0 22px, #fdeccf 22px 44px);
}
.ec-card[data-variant="arcade"] .ec-inner,
.ec-card[data-variant="arcade"] .ec-back-inner { border-width: 3px; border-radius: 6px; }
.ec-card[data-variant="arcade"] .ec-setbadge {
  background: var(--red); color: #fff; border-radius: 4px;
}
.ec-card[data-variant="arcade"] .ec-namebar,
.ec-card[data-variant="arcade"] .ec-stat,
.ec-card[data-variant="arcade"] .ec-name { border-radius: 4px; }

/* =============================================================================
   TIERS — accent + frame + foil per rarity (override variant accents)
   ============================================================================= */
.ec-card[data-tier="rookie"]   { --c-accent: #8a929e; }
.ec-card[data-tier="starter"]  { --c-accent: #b07b3e; --foil-strength: 0; }
.ec-card[data-tier="allstar"]  { --c-accent: #9aa6b8;
  --c-foil: linear-gradient(125deg, transparent 30%, rgba(220,230,245,.5) 50%, transparent 70%);
  --foil-strength: .55; }
.ec-card[data-tier="mvp"] {
  --c-accent: var(--gold);
  --c-foil: linear-gradient(125deg, transparent 25%, rgba(255,225,140,.65) 48%, rgba(255,255,255,.4) 54%, transparent 75%);
  --foil-strength: .8;
}
.ec-card[data-tier="hof"] {
  --c-accent: var(--gold-lt);
  --c-foil: linear-gradient(120deg,
     rgba(255,80,120,.5), rgba(255,210,90,.5), rgba(120,255,170,.5),
     rgba(90,200,255,.5), rgba(190,120,255,.5));
  --foil-strength: .85;
}
.ec-card[data-tier="hof"] .ec-face,
.ec-card[data-tier="mvp"] .ec-face { border-color: var(--c-accent); }

/* animated sheen sweep for foil cards */
.ec-card[data-foil="true"] .ec-foil { animation: ec-sheen 5.5s ease-in-out infinite; background-size: 250% 250%; }
@keyframes ec-sheen {
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .ec-card[data-foil="true"] .ec-foil { animation: none; }
}

/* rarity ribbon corner */
.ec-rarity-ribbon {
  position: absolute; top: 9px; left: -34px; transform: rotate(-45deg);
  background: var(--c-accent); color: #10182a; font-family:'Anton',sans-serif;
  font-size: 9px; letter-spacing: 1px; padding: 3px 36px; z-index: 3;
  box-shadow: 0 1px 3px rgba(0,0,0,.4); text-transform: uppercase;
  opacity: 0; transition: opacity .2s;
}
.ec-card[data-tier="mvp"] .ec-rarity-ribbon,
.ec-card[data-tier="hof"] .ec-rarity-ribbon { opacity: 1; }

/* =============================================================================
   STATIC / BASE-SET CARDS  (Skill / Human / Field / Item — flat, no back)
   ============================================================================= */
.sc-card {
  position: relative; width: 320px; aspect-ratio: 320 / 446; border-radius: 16px;
  font-family: 'Oswald', sans-serif; color: #e8eefc; user-select: none; overflow: hidden;
  background: linear-gradient(165deg, var(--sc-tint), #0a1120 78%);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 18px 40px -12px rgba(5,12,28,.65);
}
.sc-foil { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen; opacity: 0;
  background-size: 250% 250%; border-radius: 16px; }
.sc-card[data-foil="true"][data-rarity="SR"] .sc-foil { opacity: .8;
  background: linear-gradient(125deg, transparent 25%, rgba(255,225,140,.55) 48%, rgba(255,255,255,.35) 54%, transparent 75%);
  animation: ec-sheen 5.5s ease-in-out infinite; }
.sc-card[data-foil="true"][data-rarity="UR"] .sc-foil { opacity: .85;
  background: linear-gradient(120deg, rgba(255,80,120,.5), rgba(255,210,90,.5), rgba(120,255,170,.5), rgba(90,200,255,.5), rgba(190,120,255,.5));
  animation: ec-sheen 5s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .sc-foil { animation: none !important; } }

.sc-inner { position: absolute; inset: 9px; border: 2px solid var(--sc-accent);
  border-radius: 11px; padding: 11px 12px; display: flex; flex-direction: column;
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.10)); }
.sc-top { display: flex; align-items: center; gap: 8px; }
.sc-title { flex: 1; font-family: 'Anton', sans-serif; font-size: 21px; line-height: 1;
  text-transform: uppercase; letter-spacing: .3px; text-wrap: balance; }
.sc-rargem { flex: 0 0 auto; font-family: 'Anton', sans-serif; font-size: 13px; color: #10182a;
  background: var(--sc-rarcol); border-radius: 6px; padding: 4px 8px;
  box-shadow: 0 0 10px -1px var(--sc-rarcol); }
.sc-typebar { margin-top: 8px; display: inline-flex; align-items: center; gap: 6px; align-self: flex-start;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; color: #0a1120;
  background: var(--sc-accent); padding: 3px 12px; border-radius: 5px; }
.sc-glyph { font-size: 12px; }
.sc-art { position: relative; margin-top: 9px; aspect-ratio: 16 / 10; border-radius: 8px; overflow: hidden;
  border: 1.5px solid var(--sc-accent);
  background: radial-gradient(120% 120% at 50% 10%, rgba(255,255,255,.10), transparent 60%),
    linear-gradient(160deg, color-mix(in srgb, var(--sc-accent) 30%, #0a1120), #0a1120); }
.sc-halftone { position: absolute; inset: 0; opacity: .4;
  background-image: radial-gradient(rgba(255,255,255,.18) 1.3px, transparent 1.4px); background-size: 9px 9px; }
.sc-bigglyph { position: absolute; inset: 0; display: grid; place-items: center;
  font-size: 86px; color: var(--sc-accent); opacity: .9; text-shadow: 0 4px 18px rgba(0,0,0,.5); }
.sc-monogram { position: absolute; inset: 0; display: grid; place-items: center;
  font-family: 'Anton', sans-serif; font-size: 64px; color: #fff; text-shadow: 0 4px 14px rgba(0,0,0,.5); }
.sc-trigger { position: absolute; left: 0; right: 0; bottom: 0; font-size: 10px; line-height: 1.3;
  font-style: italic; padding: 6px 9px; color: #dbe5fb; background: linear-gradient(0deg, rgba(0,0,0,.78), transparent); }
.sc-action { margin-top: 9px; font-family: 'Anton', sans-serif; font-size: 16px; text-transform: uppercase;
  letter-spacing: .5px; color: var(--sc-accent); display: flex; align-items: baseline; gap: 8px; }
.sc-action-lbl { font-family: 'Oswald', sans-serif; font-size: 9px; letter-spacing: 2px; color: #8fa0c2;
  border: 1px solid rgba(255,255,255,.2); border-radius: 4px; padding: 1px 5px; }
.sc-rules { margin-top: 7px; font-size: 11.5px; line-height: 1.4; color: #cdd9f5;
  background: rgba(0,0,0,.25); border-left: 2px solid var(--sc-accent); border-radius: 4px; padding: 7px 9px; }
.sc-flavor { margin-top: auto; padding-top: 8px; font-family: 'Roboto Slab', Georgia, serif; font-style: italic;
  font-size: 11px; line-height: 1.35; color: #aebcdc; text-wrap: pretty; }
.sc-footer { margin-top: 8px; display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid rgba(255,255,255,.12); padding-top: 7px; }
.sc-set { font-size: 10px; letter-spacing: .5px; text-transform: uppercase; color: #8fa0c2; }
.sc-no { font-size: 10px; opacity: .6; }

/* =============================================================================
   HAIL911 CARD VARIANT — deep crimson, distinct from Elite Call navy / gold
   ============================================================================= */
.ec-card[data-company="hail911"][data-variant="chrome"] {
  --c-bg:    #1a0c0c;
  --c-ink:   #f5e8e8;
  --c-frame: #7a2626;
  --c-band:  #4a1212;
  --c-accent: #e04040;
}
.ec-card[data-company="hail911"][data-variant="chrome"] .ec-face {
  background: linear-gradient(160deg, #2a0e0e, #0e0707 70%);
}
.ec-card[data-company="hail911"][data-variant="chrome"] .ec-setbadge {
  background: linear-gradient(180deg, #e86060, #b02020);
  color: #fff; border-color: rgba(0,0,0,.4);
}
.ec-card[data-company="hail911"] .ec-logo-dot {
  background: radial-gradient(circle at 35% 30%, #fff, #7a1a1a 65%);
  box-shadow: 0 0 0 1.5px #e04040;
}
.ec-card[data-company="hail911"] .ec-bar-fill { background: #c42a2a; }
.ec-card[data-company="hail911"] .ec-spark span { background: #c42a2a; }
.ec-card[data-company="hail911"] .ec-play { background: #4a1010; }
.ec-card[data-company="hail911"] .ec-play.on { background: #e04040; color: #fff; }

/* =============================================================================
   MOUSE-REACTIVE FOIL  —  JS sets --mx / --my on mousemove; CSS follows cursor
   When mouse is over the card, the static animation pauses and the radial
   gradient tracks the pointer for a real holographic feel.
   ============================================================================= */
.ec-card[data-foil="true"][data-mouse-active="true"] .ec-foil { animation: none; }

.ec-card[data-tier="hof"][data-mouse-active="true"] .ec-foil {
  background: radial-gradient(
    ellipse 90% 70% at calc(var(--mx,.5) * 100%) calc(var(--my,.5) * 100%),
    rgba(255,80,120,.65), rgba(255,210,90,.55), rgba(120,255,170,.5),
    rgba(90,200,255,.45), rgba(190,120,255,.55), transparent 72%);
  opacity: .92;
}
.ec-card[data-tier="mvp"][data-mouse-active="true"] .ec-foil {
  background: radial-gradient(
    ellipse 80% 60% at calc(var(--mx,.5) * 100%) calc(var(--my,.5) * 100%),
    rgba(255,240,150,.80), rgba(255,195,60,.52), transparent 65%);
  opacity: .88;
}
.ec-card[data-tier="allstar"][data-mouse-active="true"] .ec-foil {
  background: radial-gradient(
    ellipse 80% 60% at calc(var(--mx,.5) * 100%) calc(var(--my,.5) * 100%),
    rgba(220,235,255,.62), rgba(180,200,230,.42), transparent 65%);
  opacity: .72;
}

/* =============================================================================
   TREND TOGGLE  —  Leads / ACC switcher on card back
   ============================================================================= */
.ec-trend-toggle {
  display: flex;
  background: rgba(0,0,0,.28);
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.16);
  overflow: hidden;
}
.ec-tt-btn {
  font-family: 'Oswald', sans-serif;
  font-size: 9px; font-weight: 600; letter-spacing: 1px;
  text-transform: uppercase; padding: 3px 10px;
  background: transparent; border: none;
  color: rgba(255,255,255,.45); cursor: pointer;
  transition: background .15s, color .15s;
}
.ec-tt-btn[data-on="true"] { background: var(--c-accent); color: #0a1120; }
.ec-tt-btn:not([data-on="true"]):hover { color: rgba(255,255,255,.82); }
.ec-trend-label { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; opacity: .5; align-self: center; }

/* =============================================================================
   GRADE BADGE — PSA-inspired quality score, overlaid on card portrait corner
   ============================================================================= */
.ec-grade {
  position: absolute; bottom: 8px; right: 8px; z-index: 4;
  background: rgba(8,14,30,.88); backdrop-filter: blur(4px);
  border: 2px solid var(--grade-c, var(--c-accent));
  border-radius: 7px; padding: 3px 8px; text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,.6);
}
.ec-grade[data-grade-level="gem"]  { --grade-c: #f3cf6b; }
.ec-grade[data-grade-level="mint"] { --grade-c: #c0cfe0; }
.ec-grade[data-grade-level="fine"] { --grade-c: #b07b3e; }
.ec-grade[data-grade-level="good"] { --grade-c: #8a929e; }
.ec-grade-num {
  font-family: 'Anton', sans-serif; font-size: 20px; line-height: 1;
  color: var(--grade-c, var(--c-accent));
}
.ec-grade-lbl {
  font-size: 7px; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--grade-c, var(--c-accent)); opacity: .8;
}

/* Grade on card back header */
.ec-back-grade {
  font-family: 'Anton', sans-serif; font-size: 28px;
  color: var(--c-accent); line-height: 1; text-align: right;
}
.ec-back-grade[data-grade-level="gem"]  { color: var(--gold-lt); }
.ec-back-grade[data-grade-level="mint"] { color: #c0cfe0; }
.ec-back-grade[data-grade-level="fine"] { color: #b07b3e; }
.ec-back-grade[data-grade-level="good"] { color: #8a929e; }
.ec-back-grade small { display: block; font-size: 9px; letter-spacing: 1px; opacity: .6; color: var(--c-ink); }
