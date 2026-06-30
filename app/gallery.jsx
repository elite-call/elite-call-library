/* Gallery app — search / sort / filter the full roster.
   New in v2: compare mode, team color bands, bigger grid, entrance animations. */

const GAL_DEFAULTS = /*EDITMODE-BEGIN*/{
  "variant": "chrome",
  "setName": "Elite Call",
  "accent": "#d8a72a"
} /*EDITMODE-END*/;

const TIER_FILTERS = window.EliteData.TIERS.map((t) => ({ key: t.key, name: t.name }));
const PERIODS = window.EliteData.PERIODS;

// Team accent colors — keyed to lowercase team name
const TEAM_COLORS = {
  florida: '#0d7a5a',
  illinois: '#1b3d8c',
  hail911: '#9b1a1a',
  vanguard: '#5a1a7a',
  apex: '#7a4a0a'
};
function teamColor(team) {
  return TEAM_COLORS[(team || '').toLowerCase().replace(/\s+/g, '')] || '#2a3a5a';
}

async function exportCard(node, item) {
  if (!window.html2canvas || !node) return;
  const canvas = await window.html2canvas(node, { backgroundColor: null, scale: 2, useCORS: true, logging: false });
  const base = item.kind === 'static' ? item.title : item.nameLastFirst;
  const suffix = item.kind === 'static' ? 'baseset' : item.periodKey;
  const a = document.createElement('a');
  a.download = `${String(base).replace(/[ ,]+/g, '_')}_${suffix}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
}

// ── CompareModal ──────────────────────────────────────────────────────────────
function CompareModal({ agents, variant, setName, onClose }) {
  const stats = window.EliteData.STATS;
  return (
    <div className="cmp-overlay" onClick={onClose}>
      <div className="cmp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cmp-close" onClick={onClose} title="Close">✕</button>
        <h2 className="cmp-title">Comparing <em>{agents.length} Cards</em></h2>
        <div className="cmp-cards">
          {agents.map((a) =>
          <div key={a.id} className="cmp-card-wrap">
              <AnyCard agent={a} card={a} variant={variant} setName={setName} />
            </div>
          )}
        </div>
        <div className="cmp-table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <th>Stat</th>
                {agents.map((a) => <th key={a.id}>{a.first}</th>)}
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => {
                const vals = agents.map((a) => a.stats[s.key]);
                const nums = vals.filter((v) => v != null && !isNaN(v));
                const best = nums.length ? Math.max(...nums) : null;
                return (
                  <tr key={s.key}>
                    <td className="cmp-stat-lbl">{s.label}</td>
                    {vals.map((v, i) => {
                      const f = window.formatStat(s, v);
                      const isBest = best != null && v === best && nums.length > 1;
                      return (
                        <td key={i} className={isBest ? 'cmp-best' : ''}>{f.val}{f.unit}</td>);

                    })}
                  </tr>);

              })}
              <tr className="cmp-ovr-row">
                <td className="cmp-stat-lbl">Overall</td>
                {agents.map((a) => {
                  const isBest = a.composite === Math.max(...agents.map((x) => x.composite));
                  return <td key={a.id} className={isBest ? 'cmp-best' : ''}>{a.composite}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}

// ── CardCell ──────────────────────────────────────────────────────────────────
function CardCell({ item, variant, setName, index, inCompare, onToggleCompare, showCompareBtn }) {
  const ref = React.useRef(null);
  const [busy, setBusy] = React.useState(false);
  const tc = teamColor(item.team);
  const isAgent = item.kind !== 'static';

  const save = async (e) => {
    e.stopPropagation();
    setBusy(true);
    try {await exportCard(ref.current.querySelector('.ec-card, .sc-card'), item);} finally
    {setBusy(false);}
  };

  return (
    <div
      className={'card-cell' + (inCompare ? ' cmp-selected' : '')}
      ref={ref}
      style={{ '--ci': index, '--team-c': tc }}
      data-team={(item.team || '').toLowerCase().replace(/\s+/g, '')}>
      
      {/* Team accent strip */}
      <div className="team-strip" style={{ background: tc }} />

      <AnyCard agent={item} card={item} variant={variant} setName={setName} />

      <div className="card-cell-actions">
        {showCompareBtn && isAgent &&
        <button
          className={'card-cmp-btn' + (inCompare ? ' active' : '')}
          onClick={(e) => {e.stopPropagation();onToggleCompare(item);}}
          title={inCompare ? 'Remove from compare' : 'Add to compare'}>
          
            {inCompare ? '✓ In Compare' : '+ Compare'}
          </button>
        }
        <button className="card-save" onClick={save} title="Download card as image">
          {busy ? '…' : '⬇ Save'}
        </button>
      </div>
    </div>);

}

// ── CompareBar (floating bottom bar) ─────────────────────────────────────────
function CompareBar({ count, onCompare, onClear }) {
  return (
    <div className="compare-bar">
      <span className="compare-bar-count">{count} card{count > 1 ? 's' : ''} selected</span>
      {count >= 2 &&
      <button className="compare-bar-go" onClick={onCompare}>
          Compare {count} →
        </button>
      }
      <button className="compare-bar-clear" onClick={onClear} title="Clear selection">✕</button>
    </div>);

}

// ── Gallery ───────────────────────────────────────────────────────────────────
function Gallery() {
  const [t, setTweak] = useTweaks(GAL_DEFAULTS);
  const [periodKey, setPeriodKey] = React.useState(window.EliteData.CURRENT_PERIOD.key);
  const period = PERIODS.find((p) => p.key === periodKey) || PERIODS[0];
  const isArchived = periodKey !== window.EliteData.CURRENT_PERIOD.key;
  const roster = window.EliteData.ROSTER_BY_PERIOD[periodKey] || [];
  const teams = React.useMemo(() => Array.from(new Set(roster.map((a) => a.team))).sort(), [roster]);

  const [q, setQ] = React.useState('');
  const [mode, setMode] = React.useState('agents');
  const [sortKey, setSortKey] = React.useState('composite');
  const [sortDir, setSortDir] = React.useState('desc');
  const [tierOn, setTierOn] = React.useState({});
  const [teamOn, setTeamOn] = React.useState({});
  const [typeOn, setTypeOn] = React.useState({});
  const [rarOn, setRarOn] = React.useState({});

  // Compare state
  const [compareSet, setCompareSet] = React.useState(new Set());
  const [showCompare, setShowCompare] = React.useState(false);

  // Reset compare when period / mode changes
  React.useEffect(() => {setCompareSet(new Set());setShowCompare(false);}, [periodKey, mode]);

  const toggleCompare = React.useCallback((item) => {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else if (next.size < 3) {
        next.add(item.id);
      } else {
        // Replace oldest selection
        const [first] = next;
        next.delete(first);
        next.add(item.id);
      }
      return next;
    });
  }, []);

  const BASE = window.EliteBaseSet && window.EliteBaseSet.BASE_SET || [];
  const baseTypes = React.useMemo(() => Array.from(new Set(BASE.map((c) => c.type))), [BASE]);
  const baseRarities = ['UR', 'SR', 'R', 'C'];

  const sortOptions = [
  { key: 'composite', label: 'Overall' },
  { key: 'name', label: 'Name' },
  ...window.EliteData.STATS.map((s) => ({ key: 's_' + s.key, label: s.label }))];


  const anyTier = Object.values(tierOn).some(Boolean);
  const anyTeam = Object.values(teamOn).some(Boolean);
  const anyType = Object.values(typeOn).some(Boolean);
  const anyRar = Object.values(rarOn).some(Boolean);

  const filtered = React.useMemo(() => {
    let list = roster.filter((a) => {
      if (q && !a.nameFirstLast.toLowerCase().includes(q.toLowerCase()) &&
      !a.nameLastFirst.toLowerCase().includes(q.toLowerCase())) return false;
      if (anyTier && !tierOn[a.tier]) return false;
      if (anyTeam && !teamOn[a.team]) return false;
      return true;
    });
    const dir = sortDir === 'asc' ? 1 : -1;
    list = list.slice().sort((a, b) => {
      if (sortKey === 'name') return a.last.localeCompare(b.last) * dir;
      if (sortKey === 'composite') return (a.composite - b.composite) * dir;
      const k = sortKey.slice(2);
      return ((a.stats[k] ?? -1) - (b.stats[k] ?? -1)) * dir;
    });
    return list;
  }, [roster, q, sortKey, sortDir, tierOn, teamOn, anyTier, anyTeam]);

  const baseFiltered = React.useMemo(() => {
    return BASE.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (anyType && !typeOn[c.type]) return false;
      if (anyRar && !rarOn[c.rarity]) return false;
      return true;
    });
  }, [BASE, q, typeOn, rarOn, anyType, anyRar]);

  const toggle = (setter) => (key) => setter((m) => ({ ...m, [key]: !m[key] }));
  const compareAgents = filtered.filter((a) => compareSet.has(a.id));

  return (
    <React.Fragment>
      <section className="hero">
        <div style={{ width: "720px" }}>
          <h1>Elite Call <em>LIBRARY</em></h1>
          <p style={{ fontFamily: "Manrope" }}>Every rep, every month — rendered as a collectible. Each review period is its own edition; past months are archived, never erased.</p>
          <div className="set-switch">
            <button className="set-btn" data-on={mode === 'agents'} onClick={() => setMode('agents')}>Agent Cards</button>
            <button className="set-btn" data-on={mode === 'base'} onClick={() => setMode('base')}>EXTRA CARDS</button>
          </div>
          {mode === 'agents' && PERIODS.length > 1 && <div className="period-switch">
              {PERIODS.slice().reverse().map((p) => <button key={p.key} className="period-btn" data-on={p.key === periodKey} onClick={() => setPeriodKey(p.key)}>
                  {p.label}{p.key !== window.EliteData.CURRENT_PERIOD.key ? ' · Archived' : ''}
                </button>
            )}
            </div>
          }
        </div>
        <div className="vault-stats">
          {mode === 'agents' ?
          <React.Fragment>
              <div className="vault-stat"><div className="n">{roster.length}</div><div className="l">Cards</div></div>
              <div className="vault-stat"><div className="n">{roster.filter((a) => a.tier === 'hof' || a.tier === 'mvp').length}</div><div className="l">Chase Cards</div></div>
              <div className="vault-stat"><div className="n">{teams.length}</div><div className="l">DIVISIONS</div></div>
            </React.Fragment> :

          <React.Fragment>
              <div className="vault-stat"><div className="n">{BASE.length}</div><div className="l">Cards</div></div>
              <div className="vault-stat"><div className="n">{BASE.filter((c) => c.rarity === 'UR' || c.rarity === 'SR').length}</div><div className="l">Chase Cards</div></div>
              <div className="vault-stat"><div className="n">{baseTypes.length}</div><div className="l">Types</div></div>
            </React.Fragment>
          }
        </div>
      </section>

      {mode === 'agents' ?
      <React.Fragment>
          <div className="controls">
            <div className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="ctl-group">
              <label>Sort</label>
              <select className="ec-select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                {sortOptions.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
              <span className="chip dir" onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')} title="Toggle direction">
                {sortDir === 'asc' ? '↑' : '↓'}
              </span>
            </div>
            <div className="ctl-group">
              <label>Tier</label>
              <div className="chips">
                {TIER_FILTERS.map((tf) =>
              <span key={tf.key} className="chip" data-on={!!tierOn[tf.key]} onClick={() => toggle(setTierOn)(tf.key)}>{tf.name}</span>
              )}
              </div>
            </div>
            <div className="ctl-group">
              <label>DIVISION</label>
              <div className="chips">
                {teams.map((tm) =>
              <span key={tm} className="chip" data-on={!!teamOn[tm]}
              style={teamOn[tm] ? { '--chip-on-bg': teamColor(tm) } : {}}
              onClick={() => toggle(setTeamOn)(tm)}>{tm}</span>
              )}
              </div>
            </div>
          </div>

          <div className="count-line">
            {filtered.length} card{filtered.length === 1 ? '' : 's'} · {period.label}
            {isArchived ? ' (archived edition)' : ' (current edition)'}
            {compareSet.size > 0 && <span style={{ marginLeft: 12, color: 'var(--gold)', fontWeight: 600 }}>· {compareSet.size} selected for compare</span>}
            <span style={{ marginLeft: 14, opacity: .55, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>✦ Rarity is determined by random chance — better stats earn better odds</span>
          </div>

          {filtered.length === 0 ?
        <div className="empty">No cards match those filters. Try clearing a chip.</div> :

        <div className="grid">
              {filtered.map((a, idx) =>
          <CardCell
            key={a.id}
            item={a}
            variant={t.variant}
            setName={t.setName}
            index={idx}
            inCompare={compareSet.has(a.id)}
            onToggleCompare={toggleCompare}
            showCompareBtn={true} />

          )}
            </div>
        }
        </React.Fragment> :

      <React.Fragment>
          <div className="controls">
            <div className="search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input placeholder="Search cards…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="ctl-group">
              <label>Type</label>
              <div className="chips">
                {baseTypes.map((ty) =>
              <span key={ty} className="chip" data-on={!!typeOn[ty]} onClick={() => toggle(setTypeOn)(ty)}>{ty}</span>
              )}
              </div>
            </div>
            <div className="ctl-group">
              <label>Rarity</label>
              <div className="chips">
                {baseRarities.map((rk) =>
              <span key={rk} className="chip" data-on={!!rarOn[rk]} onClick={() => toggle(setRarOn)(rk)}>{window.EliteBaseSet.RARITY[rk].name}</span>
              )}
              </div>
            </div>
          </div>

          <div className="count-line">{baseFiltered.length} card{baseFiltered.length === 1 ? '' : 's'} · Base Set</div>

          {baseFiltered.length === 0 ?
        <div className="empty">No cards match those filters.</div> :

        <div className="grid">
              {baseFiltered.map((c, idx) =>
          <CardCell key={c.id} item={c} variant={t.variant} setName={t.setName} index={idx} inCompare={false} showCompareBtn={false} />
          )}
            </div>
        }
        </React.Fragment>
      }

      {/* Compare floating bar */}
      {compareSet.size > 0 && !showCompare &&
      <CompareBar
        count={compareSet.size}
        onCompare={() => setShowCompare(true)}
        onClear={() => setCompareSet(new Set())} />

      }

      {/* Compare modal */}
      {showCompare && compareAgents.length >= 2 &&
      <CompareModal
        agents={compareAgents}
        variant={t.variant}
        setName={t.setName}
        onClose={() => setShowCompare(false)} />

      }

      <div className="footer-note">
        Live data · Google Sheet syncs weekly via Apps Script · new edition auto-archives on the 1st<br />
        Tier rarity is probabilistic — same composite score can pull any tier; better performers get better odds · hover a card to <code>⬇ Save</code> it
      </div>

      <TweaksPanel>
        <TweakSection label="Card Style" />
        <TweakRadio label="Look" value={t.variant} options={['vintage', 'chrome', 'arcade']}
        onChange={(v) => setTweak('variant', v)} />
        <TweakText label="Set name" value={t.setName} onChange={(v) => setTweak('setName', v)} />
      </TweaksPanel>
    </React.Fragment>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<Gallery />);