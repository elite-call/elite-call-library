/* =============================================================================
   TRELLUS CLIENT  ·  plug-and-play data source for transcripts + call audio
   -----------------------------------------------------------------------------
   TODAY: Trellus data arrives as a CSV your Google Script exports. The app reads
   that file read-only (no exports triggered) — same as DialedIn and the QA sheet.

   SOON: Trellus is opening direct API access. When that lands you only need to
   drop the API key into TRELLUS_CONFIG below (or set window.TRELLUS_API_KEY before
   this script loads / localStorage 'trellus_api_key'). Everything downstream —
   including the call-audio players on the card backs — switches from the CSV /
   demo path to live recordings with NO other code changes.

   The rest of the app calls window.Trellus.getCalls(agent) and
   window.Trellus.recordingUrl(call); both work in either mode.
   ============================================================================= */
(function () {
  'use strict';

  const TRELLUS_CONFIG = {
    // ⚠️ SECURITY: a key placed here is visible to anyone who opens this page.
    // For production, leave this BLANK and route Trellus calls through a server-side
    // proxy (your Google Apps Script can hold the key) — then point baseUrl at the
    // proxy. The literal below is for prototype testing only; ROTATE it before launch.
    apiKey:
      (typeof window !== 'undefined' && window.TRELLUS_API_KEY) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('trellus_api_key')) ||
      '60be61f9e306f8a8d7cb351016c1b45274cbb7e9',
    baseUrl: 'https://api.trellus.ai',   // confirm exact base + version path against Trellus docs
    // Two auth styles per Trellus' note:
    //   'bearer'  -> Authorization: Bearer <key>   (RPT endpoints)
    //   'header'  -> api_key: <key>                 (bootstrap)
    // Endpoint paths + response shapes below are best-guess placeholders pending docs.
    endpoints: {
      sessions:  { path: '/sessions', auth: 'bearer' },          // GET ?rep=&from=&to=
      gold:      { path: '/gold',     auth: 'bearer' },          // GET ?rep=
      bootstrap: { path: '/bootstrap', auth: 'header' },
      recording: (id) => ({ path: `/sessions/${id}/recording`, auth: 'bearer' }),
    },
  };

  // Build auth headers for the requested style.
  function authHeaders(style) {
    const k = TRELLUS_CONFIG.apiKey;
    return style === 'header' ? { api_key: k } : { Authorization: `Bearer ${k}` };
  }

  const isLive = () => !!TRELLUS_CONFIG.apiKey;

  // --- LIVE MODE (used once apiKey is set) ----------------------------------
  async function fetchSessionsLive(repName, { from, to } = {}) {
    const ep = TRELLUS_CONFIG.endpoints.sessions;
    const u = new URL(TRELLUS_CONFIG.baseUrl + ep.path);
    u.searchParams.set('rep', repName);          // Trellus uses "First Last"
    if (from) u.searchParams.set('from', from);
    if (to) u.searchParams.set('to', to);
    const res = await fetch(u, { headers: authHeaders(ep.auth) });
    if (!res.ok) throw new Error('Trellus API ' + res.status);
    return res.json();
  }
  function recordingUrlLive(call) {
    if (call && call.src) return call.src;
    if (call && call.trellusId) {
      const ep = TRELLUS_CONFIG.endpoints.recording(call.trellusId);
      // NOTE: <audio src> can't send headers; if Trellus requires the bearer token
      // on the recording endpoint, return a short-lived signed URL from the proxy
      // instead. Query-param fallback shown here for prototype testing only.
      return `${TRELLUS_CONFIG.baseUrl}${ep.path}?key=${encodeURIComponent(TRELLUS_CONFIG.apiKey)}`;
    }
    return null;
  }

  // --- CSV / DEMO MODE (current) --------------------------------------------
  // Calls are already attached to each agent by EliteData (from the CSV export
  // or sample generator). recordingUrl returns null -> the player runs its
  // clearly-labeled demo waveform until real recordings are available.
  function getCallsCsv(agent) { return (agent && agent.calls) || []; }
  function recordingUrlCsv(call) { return (call && call.src) || null; }

  // --- MONTHLY SHUFFLE -------------------------------------------------------
  // When a new edition drops on the 1st, the photo + audio shown on each card
  // should re-shuffle (fresh variety) but stay STABLE within that month. We seed
  // the shuffle with the agent id + period key so it's deterministic per edition.
  function seedRand(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Pick the photo for an agent this period from their Google Drive album.
  // album = array of image URLs (one rep's folder). Returns one, rotated monthly.
  // TODAY: albums aren't wired yet -> returns agent.photo (usually null -> monogram).
  // SOON: pass the Drive album and it deterministically rotates per edition.
  function photoFor(agent, periodKey, album) {
    if (album && album.length) {
      const rand = seedRand((agent.id || agent.nameFirstLast) + ':' + (periodKey || ''));
      return shuffle(album, rand)[0];
    }
    return agent.photo || null;
  }

  // Trellus has a "gold" tracker of standout sample calls. Each edition we shuffle
  // a handful of an agent's gold calls onto their card back. Live mode pulls the
  // gold list from the API; CSV/demo mode shuffles whatever calls are attached.
  async function goldCallsFor(agent, periodKey, n) {
    n = n || 3;
    let calls;
    if (isLive()) {
      try {
        const ep = TRELLUS_CONFIG.endpoints.gold;
        const u = new URL(TRELLUS_CONFIG.baseUrl + ep.path);
        u.searchParams.set('rep', agent.nameFirstLast);
        const res = await fetch(u, { headers: authHeaders(ep.auth) });
        const data = await res.json();
        calls = (data.items || data || []).map((s) => ({
          title: s.disposition || s.purpose || 'Gold Call',
          tag: s.campaign || 'Gold',
          sentiment: s.sentiment || 'Positive',
          duration: Math.round(s.duration_seconds || 0),
          date: (s.timestamp || '').slice(0, 10),
          transcript: (s.transcript_text || '').slice(0, 220),
          src: s.recording_url || null,                          // playable audio
          trellusLink: s.permalink || s.transcript_link || null, // download/open in Trellus
          trellusId: s.id || null,
        }));
      } catch (e) { console.warn('[Trellus] gold fetch failed:', e); calls = getCallsCsv(agent); }
    } else {
      calls = getCallsCsv(agent);
    }
    const rand = seedRand((agent.id || agent.nameFirstLast) + ':gold:' + (periodKey || ''));
    return shuffle(calls, rand).slice(0, n);
  }

  window.Trellus = {
    photoFor, goldCallsFor,
    config: TRELLUS_CONFIG,
    isLive,
    /** Returns the agent's call clips. Async so live + CSV share one signature. */
    async getCalls(agent) {
      if (!isLive()) return getCallsCsv(agent);
      try {
        const sessions = await fetchSessionsLive(agent.nameFirstLast);
        return (sessions.items || sessions || []).map((s) => ({
          title: s.disposition || s.purpose || 'Call',
          tag: s.campaign || '',
          sentiment: s.sentiment || 'Neutral',
          duration: Math.round(s.duration_seconds || 0),
          date: (s.timestamp || '').slice(0, 10),
          transcript: (s.transcript_text || '').slice(0, 220),
          src: s.recording_url || null,
          trellusId: s.id || null,
        }));
      } catch (e) {
        console.warn('[Trellus] live fetch failed, falling back to CSV/demo:', e);
        return getCallsCsv(agent);
      }
    },
    /** Resolve a playable audio URL for a call, or null (demo mode). */
    recordingUrl(call) { return isLive() ? recordingUrlLive(call) : recordingUrlCsv(call); },
    /** Convenience for ops: stash a key at runtime without editing code. */
    setApiKey(k) { TRELLUS_CONFIG.apiKey = k || ''; try { localStorage.setItem('trellus_api_key', k || ''); } catch (e) {} },
  };
})();
