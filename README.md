# Call Review Report Generator

AI-powered QA reporting tool for call centers. Upload a CSV of call transcripts → Claude analyzes every call → formatted PDF-ready report with per-call positives, concerns, status ratings, and cross-call patterns.

---

## Quick Setup (Vercel)

### 1. Fork / clone this repo

### 2. Get an Anthropic API key
Sign up at [console.anthropic.com](https://console.anthropic.com) and create a key.

### 3. Deploy to Vercel
1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Before deploying, add an **Environment Variable**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from step 2
3. Click **Deploy**

That's it — Vercel auto-detects the `api/` folder as serverless functions.

### 4. Use it
Visit your Vercel URL, upload a CSV, fill in report details, click **Analyze Calls & Generate Report**.

---

## CSV Format

| Column | Required | Notes |
|---|---|---|
| `Primary Phone` | ✅ | Customer phone number |
| `Rep` | ✅ | Agent name — "Last, First" format supported |
| `Call Status` | ✅ | e.g. `HS - SALES OPP`, `HS - AC TUNE-UP` |
| `Transcript` | ✅ | Full call transcript text |
| `Drive Link` | optional | Google Drive / recording URL — renders a Listen button |
| `Client` | optional | Auto-fills the Client field in the form |
| `Campaign` | optional | Auto-fills Campaign field |
| `Date` | optional | Auto-fills Date field |

Adding the optional columns to your CSV removes manual form-filling over time.

---

## Cost estimate

Each report batch makes **N + 1** Claude API calls (one per call, one for cross-call patterns) using `claude-sonnet-4-5`. A 5-call batch costs roughly **$0.02–0.08** depending on transcript length.

---

## Local development

```bash
npm i -g vercel
vercel dev
```

Then visit `http://localhost:3000`. Add your API key to a `.env.local` file:

```
ANTHROPIC_API_KEY=sk-ant-...
```

---

## File structure

```
/
├── api/
│   └── claude.js        # Vercel serverless proxy to Anthropic
├── uploads/
│   ├── emblem_horizontal_signature.png
│   └── elite-call-center-lead-generator-outbound-calls-logo.png
├── index.html           # The app (pure HTML/JS, no build step)
├── vercel.json
└── README.md
```
