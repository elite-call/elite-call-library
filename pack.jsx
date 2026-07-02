/* Open-a-Pack ceremony.
   Stages: sealed -> reveal (one card at a time) -> summary fan. */

const PK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "chrome",
  "setName": "Elite Call",
  "drama": "medium"
}/*EDITMODE-END*/;

const TIER_FX = {
  rookie:  { color: '#8a929e', glow: 'rgba(138,146,158,.5)', word: 'Rookie',      chase: false },
  starter: { color: '#b07b3e', glow: 'rgba(176,123,62,.5)',  word: 'Starter',     chase: false },
  allstar: { color: '#cdd6e6', glow: 'rgba(205,214,230,.6)', word: 'All-Star!',   chase: false },
  mvp:     { color: '#f2cf6b', glow: 'rgba(242,207,107,.7)', word: 'MVP Pull!',   chase: true  },
  hof:     { color: '#ff7ab0', glow: 'rgba(255,122,176,.7)', word: 'Hall of Fame!', chase: true },
};
// Base-set rarity FX (Skill/Human/Field/Item cards).
const RARITY_FX = {
  C:  { color: '#9aa6b8', glow: 'rgba(154,166,184,.45)', word: 'Common',      chase: false },
  R:  { color: '#6fa8dc', glow: 'rgba(111,168,220,.55)', word: 'Rare!',       chase: false },
  SR: { color: '#f2cf6b', glow: 'rgba(242,207,107,.7)',  word: 'Super Rare!', chase: true  },
  UR: { color: '#ff7ab0', glow: 'rgba(255,122,176,.75)', word: 'Ultra Rare!', chase: true  },
};
const CONFETTI = ['#f3cf6b', '#d8a72a', '#ff7ab0', '#7ad8ff', '#9affc0', '#ffffff'];

// FX + rank lookups that work for both agent cards and base-set cards.
function fxFor(card) { return card.kind === 'static' ? RARITY_FX[card.rarity] : TIER_FX[card.tier]; }
function rankFor(card) {
  if (card.kind === 'static') return ({ C: 30, R: 55, SR: 80, UR: 100 })[card.rarity] || 0;
  return card.composite;
}

// Pack pool = current-month agents + the Base Set, drawn together for variety.
function weightedPack(roster, n) {
  const baseSet = (window.EliteBaseSet && window.EliteBaseSet.BASE_SET) || [];
  const AW = { rookie: 46, starter: 30, allstar: 15, mvp: 6, hof: 2 };
  const RW = window.EliteBaseSet ? window.EliteBaseSet.RARITY : {};
  const weight = (c) => c.kind === 'static' ? ((RW[c.rarity] || {}).weight || 8) : (AW[c.tier] || 1);
  const pool = roster.concat(baseSet);
  const out = [];
  while (out.length < n && pool.length) {
    const total = pool.reduce((s, a) => s + weight(a), 0);
    let r = Math.random() * total, idx = 0;
    for (let i = 0; i < pool.length; i++) { r -= weight(pool[i]); if (r <= 0) { idx = i; break; } }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function Confetti({ color }) {
  const bits = React.useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1.6 + Math.random() * 1.6,
    col: color === 'rainbow' ? CONFETTI[i % CONFETTI.length] : CONFETTI[i % CONFETTI.length],
    rot: Math.random() * 360,
  })), [color]);
  return (
    <div className="pk-particles">
      {bits.map((b, i) => (
        <i key={i} style={{ left: b.left + '%', background: b.col,
          animationDelay: b.delay + 's', animationDuration: b.dur + 's', transform: `rotate(${b.rot}deg)` }} />
      ))}
    </div>
  );
}

function MysteryCard({ onReveal }) {
  return (
    <div onClick={onReveal} title="Click to reveal"
      style={{ width: 320, aspectRatio: '320 / 446', borderRadius: 16, cursor: 'pointer', position: 'relative',
        overflow: 'hidden', border: '2px solid rgba(255,255,255,.25)',
        boxShadow: '0 22px 50px -14px rgba(0,0,0,.7)',
        background: 'repeating-linear-gradient(115deg,#163a6b 0 16px,#1d4a85 16px 32px)',
        display: 'grid', placeItems: 'center', animation: 'pk-bob 3s ease-in-out infinite' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg,transparent 38%,rgba(255,255,255,.5) 50%,transparent 62%)',
        backgroundSize: '250% 250%', animation: 'ec-sheen 3.5s ease-in-out infinite', mixBlendMode: 'screen' }} />
      <div style={{ position: 'relative', display: 'grid', justifyItems: 'center', gap: 14 }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%,#fff,#1b3a63 65%)', boxShadow: '0 0 0 4px var(--gold)' }} />
        <div style={{ fontFamily: 'Anton', fontSize: 64, color: 'rgba(255,255,255,.9)', textShadow: '0 4px 14px rgba(0,0,0,.5)' }}>?</div>
        <div style={{ fontFamily: 'Anton', letterSpacing: 2, fontSize: 13, color: '#cdd9f5', textTransform: 'uppercase' }}>Tap to reveal</div>
      </div>
    </div>
  );
}

function Pack() {
  const [t, setTweak] = useTweaks(PK_DEFAULTS);
  const roster = window.EliteData.ROSTER;
  const [stage, setStage] = React.useState('sealed');   // sealed | ripping | reveal | done
  const [cards, setCards] = React.useState([]);
  const [shown, setShown] = React.useState(0);          // how many cards have dealt in
  const [flash, setFlash] = React.useState(null);
  const [confetti, setConfetti] = React.useState(null);
  const timers = React.useRef([]);
  const ripping = React.useRef(false);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  // Dwell time per card; medium sits between full + quick. Chase pulls linger.
  const dwellFor = (card) => {
    const chase = fxFor(card).chase;
    if (t.drama === 'quick')  return chase ? 1200 : 850;
    if (t.drama === 'medium') return chase ? 2100 : 1450;
    return chase ? 3400 : 2100; // full
  };

  const runSequence = (deck) => {
    let delay = 450; // beat after the pack tears open
    deck.forEach((c, i) => {
      at(delay, () => {
        setShown(i + 1);
        const fx = fxFor(c);
        if (t.drama !== 'quick' && fx.chase) {
          setFlash(i);
          setConfetti((c.kind === 'static' ? c.rarity === 'UR' : c.tier === 'hof') ? 'rainbow' : 'gold');
          const f1 = setTimeout(() => setFlash(null), 1500); timers.current.push(f1);
          const f2 = setTimeout(() => setConfetti(null), 3200); timers.current.push(f2);
        }
      });
      delay += dwellFor(c);
    });
    at(delay, () => setStage('done'));
  };

  const startRip = () => {
    if (ripping.current) return;
    ripping.current = true;
    const deck = weightedPack(roster, 5);
    setCards(deck); setShown(0);
    setStage('ripping');
    at(560, () => { setStage('reveal'); ripping.current = false; runSequence(deck); });
  };

  // Skip the long animation -> jump straight to the pulls summary.
  const skip = () => { clearTimers(); setFlash(null); setConfetti(null); setShown(cards.length); setStage('done'); };

  const reset = () => { clearTimers(); setStage('sealed'); setCards([]); setShown(0); setFlash(null); setConfetti(null); };

  // keyboard: space/enter rips when sealed, skips while revealing
  React.useEffect(() => {
    const h = (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (stage === 'sealed') startRip();
      else if (stage === 'reveal') skip();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });
  React.useEffect(() => () => clearTimers(), []);

  const best = cards.length ? cards.reduce((a, b) => (rankFor(b) > rankFor(a) ? b : a)) : null;
  const bestFx = best && fxFor(best);
  const bestLabel = best && (best.kind === 'static' ? best.title : best.nameFirstLast);
  const bestSub = best && (best.kind === 'static' ? best.rarityName : (window.EliteData.TIERS.find((x) => x.key === best.tier).name + ' · ' + best.composite + ' OVR'));

  return (
    <div className="pk-stage">
      {(stage === 'sealed' || stage === 'ripping') && (
        <div className="pk-sealed">
          <h2>Rip a <em>Fresh Pack</em></h2>
          <p>Five random reps from the roster. Hit rip and watch them reveal one by one — or skip ahead any time. Chase the MVPs and Hall of Famers.</p>
          <div className={'pk-pack' + (stage === 'ripping' ? ' ripping' : '')} onClick={startRip}>
            <div className="tear"></div>
            <div className="pk-pack-logo">
              <div className="pk-pack-plate"><img src={(window.__resources && window.__resources.elitecallLogo) || "app/img/elitecall-logo.png"} alt="Elite Call" /></div>
              <div className="sub">5-CARD PACK</div>
            </div>
          </div>
          {stage === 'sealed' && <button className="pk-btn" onClick={startRip}>★ Rip Pack</button>}
        </div>
      )}

      {stage === 'reveal' && (
        <div className="pk-reveal">
          <div className="pk-counter">Revealing · <b>{Math.min(shown, cards.length)}</b> of {cards.length}</div>
          <div className="pk-cardwrap">
            {shown > 0 && (
              <div key={'c' + (shown - 1)} style={{ animation: 'pk-deal .45s cubic-bezier(.2,.9,.3,1)' }}>
                <AnyCard agent={cards[shown - 1]} card={cards[shown - 1]} variant={t.variant} setName={t.setName} />
              </div>
            )}
          </div>
          <div className="pk-dots">
            {cards.map((c, i) => (
              <span key={i} className="pk-dot"
                data-state={i < shown - 1 ? 'done' : i === shown - 1 ? 'current' : 'upcoming'}
                data-tier={i <= shown - 1 ? (c.kind === 'static' ? '' : c.tier) : ''} />
            ))}
          </div>
          <button className="pk-btn ghost" onClick={skip}>Skip to My Pulls ⯈</button>
        </div>
      )}

      {stage === 'done' && (
        <div className="pk-summary">
          <h2>Your <em>Pulls</em></h2>
          <div className="pk-best">Best pull: <b>{bestLabel}</b> · {bestSub}</div>
          <div className="pk-fan">
            {cards.map((c) => <AnyCard key={c.id} agent={c} card={c} variant={t.variant} setName={t.setName} />)}
          </div>
          <div className="pk-actions">
            <button className="pk-btn" onClick={reset}>★ Open Another</button>
            <a href="index.html" style={{ textDecoration: 'none' }}><button className="pk-btn ghost">Back to Vault</button></a>
          </div>
        </div>
      )}

      {flash !== null && cards[flash] && (
        <div className={'pk-flash show'}>
          <div className="glow" style={{ background: `radial-gradient(circle at 50% 45%, ${fxFor(cards[flash]).glow}, transparent 60%)` }} />
          <div className="banner" style={{ color: fxFor(cards[flash]).color }}>{fxFor(cards[flash]).word}</div>
        </div>
      )}
      {confetti && <Confetti color={confetti} />}

      <TweaksPanel>
        <TweakSection label="Card Style" />
        <TweakRadio label="Look" value={t.variant} options={['vintage', 'chrome', 'arcade']}
          onChange={(v) => setTweak('variant', v)} />
        <TweakSection label="Pack Drama" />
        <TweakRadio label="Reveal" value={t.drama} options={['full', 'medium', 'quick']}
          onChange={(v) => setTweak('drama', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Pack />);
