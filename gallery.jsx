/* =============================================================================
   ELITE CALL — TRADING CARDS · DATA LAYER  v2
   -----------------------------------------------------------------------------
   Two data paths:
     LIVE  → window.AGENT_FEED_CSV is set by app/agent_feed_data.js
             buildRosterFromAgentFeed() parses it into the card shape.
     DEMO  → falls back to deterministic sample data using the original stat keys.
   ============================================================================= */

(function () {
  'use strict';

  // ── Stat catalog (6 tiles on card front) ─────────────────────────────────────
  // isSec: value is seconds, display as "Xs" or "M:SS"
  // front:true  → shown as tile on card front
  // front:false → shown on card back bars only
  const STATS = [
    { key: 'lph',              label: 'Leads/Hr',   unit: '',  max: 3.0,  better: 'high',            front: true  },
    { key: 'dials',            label: 'Dials',       unit: '',  max: 3000, better: 'high',            front: true  },
    { key: 'percentScheduled', label: 'Sched %',     unit: '%', max: 110,  better: 'high',            front: true  },
    { key: 'acc',              label: 'ACC',         unit: '%', max: 100,  better: 'high',            front: true  },
    { key: 'closeRate',        label: 'Close Rate',  unit: '%', max: 50,   better: 'high',            front: true  },
    { key: 'goldRate',         label: 'Gold Rate',   unit: '%', max: 5,    better: 'high',            front: true  },
    { key: 'avgTalk',          label: 'Avg Talk',    unit: '',  max: 90,   better: 'high', isSec: true, front: false },
  ];

  // ── Tiers (rarity ladder) ────────────────────────────────────────────────────
  const TIERS = [
    { key: 'rookie',  name: 'Rookie',       stars: 1, min: 0,  short: 'RC'  },
    { key: 'starter', name: 'Starter',      stars: 2, min: 40, short: 'ST'  },
    { key: 'allstar', name: 'Role Player', stars: 3, min: 58, short: 'RP'  },
    { key: 'mvp',     name: 'MVP',          stars: 4, min: 72, short: 'MVP' },
    { key: 'hof',     name: 'Elite',       stars: 5, min: 85, short: 'ELT' },
  ];

  function tierFor(composite) {
    let t = TIERS[0];
    for (const tier of TIERS) if (composite >= tier.min) t = tier;
    return t;
  }

  // ── Scoring ──────────────────────────────────────────────────────────────────
  function scoreStat(stat, raw) {
    if (raw == null || (typeof raw === 'number' && isNaN(raw))) return 0;
    return Math.max(0, Math.min(100, Math.round((Number(raw) / stat.max) * 100)));
  }

  // Elite Call weights (all 6 stats)
  const WEIGHTS      = { lph: 0.27, closeRate: 0.20, acc: 0.20, percentScheduled: 0.13, goldRate: 0.07, dials: 0.05, avgTalk: 0.08 };
  const WEIGHTS_H911 = { lph: 0.38, closeRate: 0.26, percentScheduled: 0.18, avgTalk: 0.10, dials: 0.08 };

  function composite(statsObj, isHail) {
    const w = isHail ? WEIGHTS_H911 : WEIGHTS;
    let sum = 0, wsum = 0;
    for (const s of STATS) {
      const wt = w[s.key]; if (!wt) continue;
      const raw = statsObj[s.key];
      if (raw == null || (typeof raw === 'number' && isNaN(raw))) continue;
      sum  += scoreStat(s, raw) * wt;
      wsum += wt;
    }
    return wsum > 0 ? Math.round(sum / wsum) : 0;
  }

  // ── Deterministic PRNG ───────────────────────────────────────────────────────
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashString(s) {
    let h = 0x9e3779b9;
    for (let i = 0; i < s.length; i++) h = (Math.imul(h ^ s.charCodeAt(i), 0x9e3779b9) | 0);
    return (h >>> 0);
  }

  // ── Grade (1-10): PSA-inspired quality score, LPH + ACC primary ──────────────
  // Elite Call: 60% LPH + 40% ACC
  // Hail911:    50% LPH (scaled to their range) + 50% Sched%
  function computeGrade(stats, isHail) {
    const lphScore  = Math.min(100, ((stats.lph || 0) / 3.0) * 100);
    const accScore  = (stats.acc != null && !isNaN(stats.acc)) ? stats.acc : null;
    const schedScore = (stats.percentScheduled != null && !isNaN(stats.percentScheduled))
      ? Math.min(100, stats.percentScheduled) : null;

    let blended;
    if (!isHail && accScore != null) {
      blended = lphScore * 0.60 + accScore * 0.40;
    } else if (isHail && schedScore != null) {
      const hailLph = Math.min(100, ((stats.lph || 0) / 0.75) * 100);
      blended = hailLph * 0.50 + schedScore * 0.50;
    } else {
      blended = lphScore;
    }
    return Math.max(1, Math.min(10, Math.round(1 + (blended / 100) * 9)));
  }

  // ── THE MAGIC: performance-weighted probabilistic tier roll ──────────────────
  // Better composite → dramatically better odds at rarer tiers.
  // Seeded by agent_id + periodKey so the same card always shows the same tier on reload.
  // Everyone has at least a tiny chance at any tier — that's the fun.
  function weightedTierRoll(comp, agentId, periodKey) {
    const seed = hashString((agentId || '') + (periodKey || ''));
    const rand = mulberry32(seed);
    const t = Math.max(0, Math.min(1, comp / 100));

    // Raw weights (will be normalised)
    const raw = [
      { key: 'hof',     w: 0.1  + Math.pow(t, 3.0) * 12  },
      { key: 'mvp',     w: 0.5  + Math.pow(t, 2.0) * 25  },
      { key: 'allstar', w: 5.0  + Math.pow(t, 1.2) * 35  },
      { key: 'starter', w: 20   + t * 20                  },
      { key: 'rookie',  w: Math.pow(1 - t, 1.4) * 90 + 2 },
    ];
    const total = raw.reduce((s, r) => s + r.w, 0);
    let r = rand() * total;
    for (const { key, w } of raw) { r -= w; if (r <= 0) return key; }
    return 'rookie';
  }

  // ── Name utilities ───────────────────────────────────────────────────────────
  function lastFirstToFirstLast(s) {
    const p = s.split(',');
    return p.length === 2 ? `${p[1].trim()} ${p[0].trim()}` : s.trim();
  }
  function firstLastToLastFirst(s) {
    const p = s.trim().split(/\s+/);
    return p.length >= 2 ? `${p[p.length - 1]}, ${p.slice(0, -1).join(' ')}` : s.trim();
  }

  // ── CSV parser (handles quoted fields + escaped double-quotes) ───────────────
  function parseCsv(text) {
    const rows = []; let row = [], field = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') q = false;
        else field += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r') field += c;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    const head = rows.shift().map((h) => h.trim());
    return rows.filter((r) => r.length > 1).map((r) => {
      const o = {}; head.forEach((h, idx) => (o[h] = (r[idx] || '').trim())); return o;
    });
  }

  // ── Parse helpers ────────────────────────────────────────────────────────────
  // acc_display: "97%" → 97 | "0.926" → 92.6 | "1" → 100 | "—" → null
  function parseAccPct(val) {
    if (!val || val === '—' || val === '') return null;
    const s = String(val).trim();
    if (s.endsWith('%')) return parseFloat(s) || null;
    const f = parseFloat(s);
    if (isNaN(f)) return null;
    if (f > 1) return f;           // already percentage (e.g. "96")
    return Math.round(f * 1000) / 10;  // 0.926 → 92.6
  }

  // Pipe-separated number string → array of numbers
  function parsePipe(s) {
    if (!s) return [];
    return s.split('|').map(v => { const n = parseFloat(v); return isNaN(n) ? 0 : n; });
  }

  // sample_calls JSON → call objects for CallPlayer
  function parseSampleCalls(json, periodLabel) {
    if (!json || json === '[]') return [];
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr)) return [];
      return arr.map(c => ({
        title:       String(c.label || 'Call'),
        tag:         '',
        sentiment:   'Positive',
        duration:    Number(c.dur) || 0,
        date:        periodLabel || '',
        transcript:  '',
        src:         null,
        trellusLink: c.url || null,
      }));
    } catch (e) { return []; }
  }

  // ── buildRosterFromAgentFeed ─────────────────────────────────────────────────
  function buildRosterFromAgentFeed(csvString) {
    const rows = parseCsv(csvString);
    if (!rows.length) return [];

    const firstRow    = rows[0];
    const periodKey   = firstRow.week_tag     || 'current';
    const periodLabel = firstRow.period_label || 'Current Period';

    const agents = rows.map((row, i) => {
      const isHail = row.company === 'hail911' || row.is_elitecall === 'FALSE';

      const rawName = (row.display_name || '').trim();
      const parts   = rawName.split(/\s+/);
      const first   = parts[0] || '';
      const last    = parts.slice(1).join(' ') || '';

      const accPct  = parseAccPct(row.acc_display);
      const goldRaw = row.gold_rate !== '' ? parseFloat(row.gold_rate) : NaN;
      const goldPct = isNaN(goldRaw) ? null : goldRaw * 100;

      const schedRaw = row.percent_scheduled !== '' ? parseFloat(String(row.percent_scheduled).replace('%', '')) : null;
      const schedPct  = (schedRaw != null && !isNaN(schedRaw)) ? schedRaw : null;

      const stats = {
        lph:              parseFloat(row.leads_per_hour) || 0,
        dials:            parseInt(row.di_dialed)        || 0,
        avgTalk:          parseInt(row.di_avg_talk_sec)  || 0,
        percentScheduled: schedPct,
        acc:              accPct,
        closeRate:        parseFloat(row.di_conv_rate)   || 0,
        goldRate:         goldPct,
      };

      const comp  = composite(stats, isHail);
      const tier  = weightedTierRoll(comp, row.agent_id || String(i), periodKey);
      const grade = computeGrade(stats, isHail);

      // Trend arrays (8 weeks)
      const trendLph = parsePipe(row.trend);                               // weekly lead counts
      const trendAcc = parsePipe(row.trend_acc).map(v => Math.round(v * 100)); // 0–1 → 0–100%

      const calls = parseSampleCalls(row.sample_calls, periodLabel);

      const strengths = [], growth = [];
      if (row.qa_latest_praise    && row.qa_latest_praise.length    > 10) strengths.push(row.qa_latest_praise.slice(0, 240));
      if (row.qa_latest_coaching  && row.qa_latest_coaching.length  > 10) growth.push(row.qa_latest_coaching.slice(0, 240));

      return {
        id:           row.agent_id || `A${String(i + 1).padStart(3, '0')}`,
        cardNo:       i + 1,     // re-assigned after sort
        first,
        last,
        nameFirstLast: rawName,
        nameLastFirst: last ? `${last}, ${first}` : first,
        team:          row.team    || '',
        company:       row.company || '',
        isEliteCall:   row.is_elitecall === 'TRUE',
        periodKey,
        periodLabel,
        archived:      false,
        photo:         null,
        stats,
        composite:     comp,
        tier,
        flavor:        '',
        strengths,
        growth,
        grade,
        trend:         trendLph,
        trendLph,
        trendAcc,
        calls,
      };
    });

    // Sort highest composite first → card #001 is the top performer
    agents.sort((a, b) => b.composite - a.composite);
    agents.forEach((a, i) => (a.cardNo = i + 1));
    return agents;
  }

  // ============================================================================
  //  DEMO FALLBACK (no AGENT_FEED_CSV)
  // ============================================================================
  const DEMO_PERIODS = [
    { key: '2026-04', label: 'April 2026', short: 'APR' },
    { key: '2026-05', label: 'May 2026',   short: 'MAY' },
    { key: '2026-06', label: 'June 2026',  short: 'JUN' },
  ];

  const FIRST = ['Jordan','Marcus','Priya','Devin','Sofia','Tyrell','Hannah','Andre','Mei','Caleb',
    'Rosa','Liam','Aisha','Noah','Yuki','Gabriel','Imani','Diego','Nora','Sean',
    'Tasha','Owen','Lena','Malik','Carmen','Reid','Bianca','Theo','Joon','Vera','Hector','Dana'];
  const LAST  = ['Mitchell','Reyes','Patel','Brooks','Romano','Jackson','Cole','Whitfield','Tanaka','Nguyen',
    'Delgado','Fitzgerald','Karim','Sanders','Mori','Santos','Washington','Ferraro','Hale','Donnelly',
    'Greene','Sullivan','Petrov','Abara','Vega','Calloway','Russo','Mercer','Park','Ellison','Cruz','Lindqvist'];
  const TEAMS = ['Florida', 'Illinois', 'Vanguard', 'Apex'];
  const STRENGTHS = [
    'Turns cold opens into warm conversations.',
    'Relentless on the dial — never lets the queue go quiet.',
    'Reads hesitation and reframes it as opportunity.',
    'Masters the callback cadence; follow-through is automatic.',
    'Builds rapport in the first ten seconds.',
    'Handles pricing objections without flinching.',
    'Keeps tone bright on the 80th dial of the day.',
    'Diagnoses the real need before pitching.',
  ];
  const GROWTH = [
    'Tighten discovery before jumping to the close.',
    'Push for the next step earlier in the call.',
    'Vary the opener — the script is getting stale.',
    'Hold the silence after the ask.',
  ];
  const FLAVOR = [
    'Never takes no for an answer — just finds a better question.',
    'Dials like the quarter ends tonight.',
    'The prospect always thinks it was their idea.',
    'Quietly leads the board most weeks.',
  ];
  const CALL_TOPICS = [
    { title: 'Cold open → booked',       tag: 'Appt Set'   },
    { title: 'Pricing objection handled', tag: 'Objection'  },
    { title: 'Callback close',            tag: 'Follow-up'  },
    { title: 'Membership upsell',         tag: 'Upsell'     },
  ];

  function makeDemoPeriod(periodIndex, PERIODS) {
    const rand = mulberry32(20260401 + periodIndex * 7919);
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const span = (lo, hi) => lo + rand() * (hi - lo);
    const out  = [];
    for (let i = 0; i < 32; i++) {
      const first = FIRST[i % FIRST.length];
      const last  = LAST[i % LAST.length];
      const team  = TEAMS[Math.floor(mulberry32(1000 + i)() * TEAMS.length)];
      const tilt  = Math.pow(rand(), 1.6);
      const base  = 0.32 + tilt * 0.6 + periodIndex * 0.025;
      const j     = () => Math.max(0, Math.min(1, base + (rand() - 0.5) * 0.28));
      const raw   = {
        lph:       +(span(0.5, 2.8) * (0.5 + j() * 0.7)).toFixed(2),
        dials:     Math.round(span(300, 2800) * (0.6 + j() * 0.5)),
        avgTalk:   Math.round(span(25, 90)),
        acc:       Math.round(70 + j() * 30),
        closeRate: +(span(4, 45) * (0.5 + j() * 0.7)).toFixed(1),
        goldRate:  +(span(0, 4) * j()).toFixed(2),
      };
      const comp  = composite(raw, false);
      const p     = PERIODS[periodIndex];
      const nC    = 2 + Math.floor(rand() * 2);
      const calls = Array.from({ length: nC }, () => {
        const topic = pick(CALL_TOPICS);
        return {
          title: topic.title, tag: topic.tag, sentiment: 'Positive',
          duration: 45 + Math.floor(rand() * 360), date: p.label,
          transcript: pick(FLAVOR), src: null, trellusLink: null,
        };
      });
      out.push({
        id: 'A' + String(i + 1).padStart(3, '0'),
        cardNo: i + 1,
        first, last,
        nameFirstLast: `${first} ${last}`, nameLastFirst: `${last}, ${first}`,
        team, company: '', isEliteCall: true,
        periodKey: p.key, periodLabel: p.label,
        archived: periodIndex < PERIODS.length - 1,
        photo: null, stats: raw, composite: comp,
        tier:  weightedTierRoll(comp, `demo-${i}`, p.key),
        grade: computeGrade(raw, false),
        flavor: pick(FLAVOR),
        strengths: [pick(STRENGTHS)].filter(Boolean),
        growth:    [pick(GROWTH)].filter(Boolean),
        trend: Array.from({ length: 8 }, () => Math.round(comp + (rand() - 0.45) * 22)),
        trendLph: Array.from({ length: 8 }, () => +(Math.random() * 2.5).toFixed(2)),
        trendAcc: Array.from({ length: 8 }, () => Math.round(75 + Math.random() * 25)),
        calls,
      });
    }
    return out;
  }

  function makeAllDemoPeriods() {
    const byPeriod = {};
    DEMO_PERIODS.forEach((p, idx) => (byPeriod[p.key] = makeDemoPeriod(idx, DEMO_PERIODS)));
    return byPeriod;
  }

  // ============================================================================
  //  PRODUCTION ADAPTER  (join 3 CSVs — kept for future use)
  // ============================================================================
  const NAME_KEY_COLUMNS = {
    id: 'agent_id', dialedin: 'dialedin_name', trellus: 'trellus_name',
    qa: 'qa_name', team: 'team', photo: 'photo_url',
  };
  function hmsToMinutes(hms) {
    if (!hms) return 0;
    const p = String(hms).split(':').map(Number);
    if (p.length === 3) return p[0] * 60 + p[1] + p[2] / 60;
    if (p.length === 2) return p[0] + p[1] / 60;
    return +hms || 0;
  }
  function pct(s) { return parseFloat(String(s).replace('%', '')) || 0; }
  function qaScoreFromEvents(rows) {
    if (!rows.length) return { score: 70, praise: 0, coaching: 0 };
    let praise = 0, coaching = 0;
    const feedback = [];
    for (const r of rows) {
      const code = (r['QA Code'] || '').toLowerCase();
      if (code.includes('praise')) { praise++; if (r.Description) feedback.push({ kind: 'praise', text: r.Description }); }
      else if (code.includes('coaching')) { coaching++; if (r.Description) feedback.push({ kind: 'coaching', text: r.Description }); }
    }
    const score = Math.max(20, Math.min(100, Math.round(72 + praise * 6 - coaching * 2.2)));
    return { score, praise, coaching, feedback };
  }
  function trellusAgg(rows) {
    if (!rows.length) return { sentiment: 60, objection: 60, calls: [] };
    const sentMap = { positive: 92, mixed: 60, neutral: 55, negative: 25, '': 55 };
    let sSum = 0;
    rows.forEach((r) => (sSum += sentMap[(r.Sentiment || '').toLowerCase()] ?? 55));
    const calls = rows.slice(0, 4).map((r) => ({
      title: r.Disposition || r.Purpose || 'Call', tag: r.Campaign || '',
      sentiment: r.Sentiment || 'Neutral',
      duration: Math.round(+r['Duration (seconds)'] || 0),
      date: (r.Timestamp || '').slice(0, 10),
      transcript: (r['Transcript Text'] || '').slice(0, 220),
      src: null, transcriptLink: r['Transcript Link'] || null,
    }));
    return { sentiment: Math.round(sSum / rows.length), objection: Math.min(100, 45 + rows.length / 3), calls };
  }
  function buildRoster({ keyCsv, dialedInCsv, trellusCsv, qaCsv, periodKey, periodLabel }) {
    const key  = keyCsv ? parseCsv(keyCsv) : null;
    const di   = indexBy(parseCsv(dialedInCsv), (r) => r.Rep);
    const trBy = groupBy(parseCsv(trellusCsv), (r) => firstLastToLastFirst(r['Rep Name']));
    const qaBy = groupBy(parseCsv(qaCsv), (r) => r.Rep);
    const reps = key
      ? key.map((k) => ({ lf: k[NAME_KEY_COLUMNS.dialedin], team: k[NAME_KEY_COLUMNS.team], photo: k[NAME_KEY_COLUMNS.photo], id: k[NAME_KEY_COLUMNS.id] }))
      : Object.keys(di).map((lf) => ({ lf, team: '', photo: null, id: null }));
    return reps.map((rep, i) => {
      const d = di[rep.lf] || {};
      const qa = qaScoreFromEvents(qaBy[rep.lf] || []);
      const tr = trellusAgg(trBy[rep.lf] || []);
      const s  = {
        lph:       +(d.Leads || 0) / Math.max(1, +(d.Hours || 1)),
        dials:     +(d.Dialed || 0),
        avgTalk:   hmsToMinutes(d['Avg Talk Time']) * 60,
        acc:       qa.score,
        closeRate: pct(d['Conversion Rate']),
        goldRate:  0,
      };
      const comp    = composite(s, false);
      const nameFL  = lastFirstToFirstLast(rep.lf);
      const [first, ...rest] = nameFL.split(' ');
      return {
        id: rep.id || 'A' + String(i + 1).padStart(3, '0'),
        cardNo: i + 1, first, last: rest.join(' '),
        nameFirstLast: nameFL, nameLastFirst: rep.lf,
        team: rep.team || '', company: '', isEliteCall: true,
        periodKey: periodKey || '', periodLabel: periodLabel || '',
        archived: false, photo: rep.photo || null,
        stats: s, composite: comp,
        tier: weightedTierRoll(comp, rep.id || String(i), periodKey || ''),
        flavor: '', strengths: [], growth: [],
        trend: [], trendLph: [], trendAcc: [],
        calls: tr.calls,
      };
    });
  }
  function indexBy(rows, keyFn)  { const o = {}; rows.forEach((r) => (o[(keyFn(r) || '').trim()] = r)); return o; }
  function groupBy(rows, keyFn)  { const o = {}; rows.forEach((r) => { const k = (keyFn(r) || '').trim(); (o[k] = o[k] || []).push(r); }); return o; }

  // ============================================================================
  //  BOOTSTRAP
  // ============================================================================
  let PERIODS, CURRENT_PERIOD, ROSTER_BY_PERIOD, ROSTER;

  if (window.AGENT_FEED_CSV) {
    PERIODS = [{ key: '2026-W25', label: 'May 30 – Jun 26', short: 'W25' }];
    CURRENT_PERIOD = PERIODS[0];
    ROSTER = buildRosterFromAgentFeed(window.AGENT_FEED_CSV);
    ROSTER_BY_PERIOD = { [CURRENT_PERIOD.key]: ROSTER };
  } else {
    PERIODS = DEMO_PERIODS;
    CURRENT_PERIOD = DEMO_PERIODS[DEMO_PERIODS.length - 1];
    ROSTER_BY_PERIOD = makeAllDemoPeriods();
    ROSTER = ROSTER_BY_PERIOD[CURRENT_PERIOD.key];
  }

  window.EliteData = {
    STATS, TIERS, WEIGHTS, WEIGHTS_H911, PERIODS, CURRENT_PERIOD,
    tierFor, scoreStat, composite, weightedTierRoll, computeGrade,
    lastFirstToFirstLast, firstLastToLastFirst,
    parseCsv, parseSampleCalls, buildRoster, buildRosterFromAgentFeed,
    hmsToMinutes, qaScoreFromEvents, trellusAgg,
    ROSTER_BY_PERIOD, ROSTER,
  };
})();
