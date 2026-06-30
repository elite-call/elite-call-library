/* TradingCard component — shared by gallery + pack pages.
   Exposes: window.TradingCard, window.formatStat, window.Stars */

const ECTiers = () => window.EliteData.TIERS;
const ECStats = () => window.EliteData.STATS;

// Format a stat for display. Handles null → "—", seconds, floats, etc.
function formatStat(stat, raw) {
  if (raw == null || (typeof raw === 'number' && isNaN(raw))) {
    return { val: '—', unit: '' };
  }
  if (stat.isSec) {
    const s = Math.round(Number(raw));
    if (s >= 60) return { val: `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, unit: '' };
    return { val: s, unit: 's' };
  }
  if (stat.key === 'lph')  return { val: Number(raw).toFixed(1), unit: '' };
  if (stat.key === 'dials') {
    const n = Math.round(Number(raw));
    return { val: n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n), unit: '' };
  }
  if (stat.unit === '%') return { val: parseFloat(raw).toFixed(1), unit: '%' };
  return { val: Math.round(Number(raw)), unit: stat.unit };
}
window.formatStat = formatStat;

function fmtDur(sec) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Shared WebAudio context for demo playback
let _ecAudioCtx = null;
function demoTone() {
  try {
    _ecAudioCtx = _ecAudioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx  = _ecAudioCtx;
    const osc  = ctx.createOscillator(), gain = ctx.createGain();
    const lfo  = ctx.createOscillator(), lfoG = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = 220;
    lfo.type = 'sine'; lfo.frequency.value = 3.5; lfoG.gain.value = 40;
    lfo.connect(lfoG); lfoG.connect(osc.frequency);
    gain.gain.value = 0.04;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); lfo.start();
    return () => { try { osc.stop(); lfo.stop(); } catch (e) {} };
  } catch (e) { return () => {}; }
}

// ── CallPlayer ────────────────────────────────────────────────────────────────
function CallPlayer({ call }) {
  const [playing, setPlaying] = React.useState(false);
  const [prog,    setProg]    = React.useState(0);
  const [open,    setOpen]    = React.useState(false);
  const raf      = React.useRef(null);
  const stopTone = React.useRef(null);
  const audioRef = React.useRef(null);
  const liveSrc  = window.Trellus ? window.Trellus.recordingUrl(call) : (call.src || null);

  const stop = () => {
    setPlaying(false);
    if (raf.current) cancelAnimationFrame(raf.current);
    if (stopTone.current) { stopTone.current(); stopTone.current = null; }
    if (audioRef.current) audioRef.current.pause();
  };

  const toggle = (e) => {
    e.stopPropagation();
    if (playing) { stop(); return; }
    setPlaying(true);
    if (liveSrc && audioRef.current) {
      audioRef.current.currentTime = prog * (audioRef.current.duration || 0) || 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    stopTone.current = demoTone();
    const dur = 6000; const start = performance.now() - prog * dur;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setProg(p);
      if (p >= 1) { stop(); setProg(0); }
      else raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  React.useEffect(() => () => stop(), []);
  const bars = React.useMemo(() => Array.from({ length: 22 }, () => 0.25 + Math.random() * 0.75), []);
  const sentColor = { positive: '#5fd29a', mixed: '#e0b24a', neutral: '#9aa6b8', negative: '#e0775f' }[(call.sentiment || '').toLowerCase()] || '#9aa6b8';

  const trellusHref = call.trellusLink || call.transcriptLink || 'https://app.trellus.ai';
  const isReal = !!(call.trellusLink || call.transcriptLink);

  return (
    <div className="ec-call" onClick={(e) => e.stopPropagation()}>
      {liveSrc && <audio ref={audioRef} src={liveSrc}
        onTimeUpdate={(e) => setProg(e.target.currentTime / (e.target.duration || 1))}
        onEnded={() => { stop(); setProg(0); }} />}
      <button className={'ec-play' + (playing ? ' on' : '')} onClick={toggle} aria-label="Play sample call">
        {playing ? '❚❚' : '►'}
      </button>
      <div className="ec-call-body">
        <div className="ec-call-top">
          <span className="ec-call-title" title={call.title} onClick={() => setOpen(o => !o)}>{call.title}</span>
          <span className="ec-call-dur">{fmtDur(call.duration)}</span>
        </div>
        <div className="ec-wave">
          {bars.map((h, i) => (
            <span key={i} style={{
              height: (h * 100) + '%',
              background: i / bars.length <= prog ? 'var(--c-accent)' : 'currentColor',
              opacity:    i / bars.length <= prog ? 1 : .3
            }} />
          ))}
        </div>
        <div className="ec-call-meta">
          <span className="ec-sent" style={{ color: sentColor }}>● {call.sentiment}</span>
          <span className="ec-call-links">
            {!isReal && <span className="ec-demo">demo</span>}
            <a className="ec-trellus-link" href={trellusHref} target="_blank" rel="noopener"
               onClick={(e) => e.stopPropagation()}
               title={isReal ? 'Open transcript in Trellus' : 'Opens Trellus once API is connected'}>
              Trellus ↗
            </a>
          </span>
        </div>
        {open && call.transcript && <div className="ec-transcript">"{call.transcript}"</div>}
      </div>
    </div>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ n }) {
  return (
    <div className="ec-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? '' : 'ec-star-empty'}>★</span>
      ))}
    </div>
  );
}

// ── Portrait ──────────────────────────────────────────────────────────────────
// Handles suffixes like "IV" so William Kerth IV → WKIV
function computeInitials(first, last) {
  const f      = (first || '')[0] || '';
  const words  = (last  || '').split(/\s+/);
  const l      = (words[0] || '')[0] || '';
  const suffix = words.slice(1).filter(w => /^[IVX]+$/i.test(w)).join('');
  return (f + l + suffix).toUpperCase();
}

function Portrait({ agent }) {
  const initials = computeInitials(agent.first, agent.last);
  const isHail   = agent.company === 'hail911';
  return (
    <div className="ec-portrait">
      {agent.photo
        ? <img src={agent.photo} alt={agent.nameFirstLast} />
        : <React.Fragment>
            <div className="ec-halftone" />
            <div className="ec-monogram">{initials.toUpperCase()}</div>
          </React.Fragment>
      }
      {isHail && (
        <span className="ec-cobadge" title="Hail911">
          <img src={(window.__resources && window.__resources.hail911) || 'app/img/hail911-logo.jpg'} alt="Hail911" />
        </span>
      )}
      <span className="ec-teamtag">{agent.team}</span>
      {agent.grade != null && (
        <div className="ec-grade" data-grade-level={agent.grade >= 9 ? 'gem' : agent.grade >= 7 ? 'mint' : agent.grade >= 5 ? 'fine' : 'good'}>
          <div className="ec-grade-num">{agent.grade}</div>
          <div className="ec-grade-lbl">Grade</div>
        </div>
      )}
    </div>
  );
}

// ── TrendChart (toggle LPH vs ACC) ────────────────────────────────────────────
function TrendChart({ trendLph, trendAcc }) {
  const hasLph  = trendLph && trendLph.some(v => v > 0);
  const hasAcc  = trendAcc && trendAcc.some(v => v > 0);
  const [mode, setMode] = React.useState(hasAcc ? 'acc' : 'lph');
  if (!hasLph && !hasAcc) return null;

  const data    = mode === 'acc' ? (trendAcc || []) : (trendLph || []);
  const nonZero = data.filter(v => v > 0);
  const tMax    = nonZero.length ? Math.max(...nonZero) : 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div className="ec-section-t" style={{ margin: 0, border: 'none', paddingBottom: 0 }}>
          8-Week Trend
        </div>
        {hasLph && hasAcc
          ? <div className="ec-trend-toggle">
              <button className="ec-tt-btn" data-on={mode === 'lph'} onClick={(e) => { e.stopPropagation(); setMode('lph'); }}>Leads</button>
              <button className="ec-tt-btn" data-on={mode === 'acc'} onClick={(e) => { e.stopPropagation(); setMode('acc'); }}>ACC %</button>
            </div>
          : <span className="ec-trend-label">{hasAcc ? 'ACC %' : 'Leads'}</span>
        }
      </div>
      <div className="ec-spark" style={{ marginTop: 6 }}>
        {data.map((v, i) => (
          <span key={i} style={{ height: Math.max(4, ((v || 0) / tMax) * 100) + '%' }} />
        ))}
      </div>
    </div>
  );
}

// ── Card front ────────────────────────────────────────────────────────────────
function CardFront({ agent, tier, variant, setName }) {
  const stats = ECStats();
  return (
    <div className="ec-face ec-face--front">
      <div className="ec-foil" />
      <div className="ec-rarity-ribbon">{tier.name}</div>
      <div className="ec-inner">
        <div className="ec-top">
          <Stars n={tier.stars} />
          <span className="ec-setbadge">{agent.company === 'hail911' ? 'Hail911' : setName}</span>
          <span className="ec-cardno">#{String(agent.cardNo).padStart(3, '0')} / {String(window.EliteData.ROSTER.length).padStart(3, '0')}</span>
        </div>
        <Portrait agent={agent} />
        <div className="ec-namebar"><div className="ec-name">{agent.nameFirstLast}</div></div>
        <div className="ec-stats">
          {stats.filter(s => s.front !== false).map((s) => {
            const f = formatStat(s, agent.stats[s.key]);
            return (
              <div className="ec-stat" key={s.key}>
                <div className="ec-stat-val">{f.val}<small>{f.unit}</small></div>
                <div className="ec-stat-lbl">{s.label}</div>
              </div>
            );
          })}
        </div>
        {agent.flavor && <div className="ec-flavor">"{agent.flavor}"</div>}
        <div className="ec-footer">
          <div className="ec-logo"><span className="ec-logo-dot" />Elite Call</div>
          <span className="ec-season">{agent.periodLabel}{agent.archived ? ' · Archived' : ''}</span>
        </div>
      </div>
    </div>
  );
}

// ── Card back ─────────────────────────────────────────────────────────────────
function CardBack({ agent, tier }) {
  const stats = ECStats();
  const D     = window.EliteData;

  return (
    <div className="ec-face ec-face--back">
      <div className="ec-foil" />
      <div className="ec-back-inner">
        <div className="ec-back-head">
          <div>
            <div className="ec-back-name">{agent.nameFirstLast}</div>
            <div style={{ fontSize: 11, opacity: .65, letterSpacing: '.5px', textTransform: 'uppercase' }}>
              {tier.name} · {agent.team}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {agent.grade != null && (
              <div className="ec-back-grade" data-grade-level={agent.grade >= 9 ? 'gem' : agent.grade >= 7 ? 'mint' : agent.grade >= 5 ? 'fine' : 'good'}>
                {agent.grade}<small>Grade</small>
              </div>
            )}
            <div className="ec-back-ovr">{agent.composite}<small>OVR</small></div>
          </div>
        </div>

        <div className="ec-section-t">Stat Breakdown</div>
        {stats.map((s) => {
          const raw   = agent.stats[s.key];
          const isNull = raw == null || (typeof raw === 'number' && isNaN(raw));
          const score  = isNull ? 0 : D.scoreStat(s, raw);
          const f      = formatStat(s, raw);
          return (
            <div className="ec-bar-row" key={s.key}>
              <span className="ec-bar-lbl">{s.label}</span>
              <span className="ec-bar-track">
                {!isNull && <span className="ec-bar-fill" style={{ width: score + '%' }} />}
              </span>
              <span className="ec-bar-num">{f.val}{f.unit}</span>
            </div>
          );
        })}

        <TrendChart trendLph={agent.trendLph} trendAcc={agent.trendAcc} />

        {agent.calls && agent.calls.length > 0 && (
          <React.Fragment>
            <div className="ec-section-t">Sample Calls <span style={{ opacity: .55, fontWeight: 400, letterSpacing: '.5px' }}>· via Trellus</span></div>
            {agent.calls.slice(0, 3).map((c, i) => <CallPlayer key={i} call={c} />)}
          </React.Fragment>
        )}

        {agent.strengths && agent.strengths.length > 0 && (
          <React.Fragment>
            <div className="ec-section-t">Strengths</div>
            {agent.strengths.map((s, i) => (
              <div className="ec-sg" key={i}><span className="ec-sg-mark">▲</span><span>{s}</span></div>
            ))}
          </React.Fragment>
        )}

        {agent.growth && agent.growth.length > 0 && (
          <React.Fragment>
            <div className="ec-section-t">Growth Areas</div>
            {agent.growth.map((s, i) => (
              <div className="ec-sg" key={i}><span className="ec-sg-mark" style={{ color: 'var(--red)' }}>▼</span><span>{s}</span></div>
            ))}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

// ── TradingCard ───────────────────────────────────────────────────────────────
function TradingCard({ agent, variant = 'vintage', setName = 'Elite Call', flippable = true, flipped: controlledFlipped, onFlip, style }) {
  const [internalFlip, setInternalFlip] = React.useState(false);
  const flipped = controlledFlipped !== undefined ? controlledFlipped : internalFlip;
  const cardRef = React.useRef(null);
  const tier    = ECTiers().find((t) => t.key === agent.tier) || ECTiers()[0];
  const isFoil  = tier.key === 'mvp' || tier.key === 'hof' || tier.key === 'allstar';

  const toggle = () => {
    if (!flippable) return;
    if (onFlip) onFlip(!flipped); else setInternalFlip(f => !f);
  };

  // Mouse-reactive foil: track cursor position on the card
  const onMouseMove = (e) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width).toFixed(3));
    el.style.setProperty('--my', ((e.clientY - r.top)  / r.height).toFixed(3));
    el.setAttribute('data-mouse-active', 'true');
  };
  const onMouseLeave = () => {
    const el = cardRef.current; if (!el) return;
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
    el.removeAttribute('data-mouse-active');
  };

  return (
    <div
      ref={cardRef}
      className="ec-card"
      data-variant={variant}
      data-tier={tier.key}
      data-foil={isFoil}
      data-company={agent.company || ''}
      data-flipped={flipped}
      style={{ cursor: flippable ? 'pointer' : 'default', ...style }}
      onClick={toggle}
      onMouseMove={isFoil ? onMouseMove : undefined}
      onMouseLeave={isFoil ? onMouseLeave : undefined}
      title={flippable ? 'Click to flip' : undefined}
    >
      <div className="ec-flip">
        <CardFront agent={agent} tier={tier} variant={variant} setName={setName} />
        <CardBack  agent={agent} tier={tier} />
      </div>
    </div>
  );
}

Object.assign(window, { TradingCard, Stars });

/* ── StaticCard (Base Set) ── */
function StaticCard({ card, variant = 'chrome', style }) {
  const meta = window.EliteBaseSet.TYPE_META[card.type] || window.EliteBaseSet.TYPE_META.Skill;
  const rar  = window.EliteBaseSet.RARITY[card.rarity];
  const isHuman  = card.type === 'Human';
  const initials = isHuman ? card.title.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() : null;
  return (
    <div className="sc-card" data-variant={variant} data-type={card.type} data-rarity={card.rarity}
      data-foil={rar.foil} style={{ '--sc-accent': meta.accent, '--sc-tint': meta.tint, '--sc-rarcol': rar.color, ...style }}>
      <div className="sc-foil" />
      <div className="sc-inner">
        <div className="sc-top">
          <div className="sc-title" title={card.title}>{card.title}</div>
          <div className="sc-rargem" title={rar.name}>{card.rarity}</div>
        </div>
        <div className="sc-typebar"><span className="sc-glyph">{meta.glyph}</span>{card.type}</div>
        <div className="sc-art">
          <div className="sc-halftone" />
          {isHuman ? <div className="sc-monogram">{initials}</div> : <div className="sc-bigglyph">{meta.glyph}</div>}
          {card.description && <div className="sc-trigger">{card.description}</div>}
        </div>
        <div className="sc-action"><span className="sc-action-lbl">Action</span>{card.action}</div>
        <div className="sc-rules">{card.behavior}</div>
        {card.flavor && <div className="sc-flavor">"{card.flavor}"</div>}
        <div className="sc-footer">
          <span className="sc-set">Base Set · {rar.name}</span>
          <span className="sc-no">#{String(card.cardNo).padStart(3, '0')} / {String(window.EliteBaseSet.BASE_SET.length).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
}

function AnyCard(props) {
  const c = props.agent || props.card;
  if (c && c.kind === 'static') return <StaticCard card={c} variant={props.variant} style={props.style} />;
  return <TradingCard {...props} />;
}

Object.assign(window, { StaticCard, AnyCard });
