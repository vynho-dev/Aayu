# Aayu — Design System & UI/UX Specification

**Version:** 1.0 (MVP)
**Companion to:** Aayu PRD v1.0 (Section 11 is the binding scope)
**Purpose:** Single source of truth for UI/UX. Human-readable for designers; agent-readable for coding tools. Build only the screens in the PRD's Locked MVP Spec.

---

## 1. Design Philosophy

Aayu is used at the worst moment of a family's life — a hospitalization and a denied claim. Every design decision serves **clarity and confidence**, never delight-for-its-own-sake.

Five principles, in priority order:

1. **Hope before mechanics.** Lead every outcome screen with the result (money recoverable, record saved), then the detail.
2. **Trust over decoration.** Visible encryption, "pay only if we win," plain language, and a human review step. No dark patterns, no urgency manipulation.
3. **Clarity over noise.** One primary action per screen. Generous whitespace. No gradients, no visual clutter.
4. **Calm, not clinical-cold.** Warm neutrals and a single trustworthy teal — a hospital that feels human, not sterile.
5. **Effortless on a cheap phone.** Mobile-first, low-end Android, minimal typing, large tap targets.

**Reference synthesis (inform, don't copy):** the calm restraint of premium fintech, the clarity of modern health apps, the honesty of consumer-first insurance challengers. Aayu's signature = *warmth + evidence*.

---

## 2. Brand Identity

- **Name:** Aayu (आयु — lifespan, vitality).
- **Tagline:** "Your family's health, working for you."
- **Voice:** Warm, plain-spoken, on-your-side. Never corporate, never alarmist. Sentence case everywhere. Use contractions. Say what things do.
- **Logo mark:** Rounded-square containing a heartbeat/pulse glyph in Teal 700 on light, or reversed to white on teal.
- **Do:** "We found the clause the insurer missed." **Don't:** "Maximize your claim recovery potential!"

---

## 3. Design Tokens

### 3.1 Color — CSS

```css
:root {
  /* Brand — Teal (medical + money + calm) */
  --aayu-teal-50:  #E1F5EE;
  --aayu-teal-100: #9FE1CB;
  --aayu-teal-400: #1D9E75;  /* action / hover */
  --aayu-teal-600: #0F6E56;  /* PRIMARY */
  --aayu-teal-800: #085041;
  --aayu-teal-900: #04342C;  /* text on teal tints */

  /* Ink — deep navy for headings/trust */
  --aayu-ink-900:  #042C53;
  --aayu-ink-700:  #0C447C;

  /* Neutrals — warm, not cold gray */
  --aayu-surface-page:  #F7F6F2;  /* warm off-white canvas */
  --aayu-surface-card:  #FFFFFF;
  --aayu-surface-muted: #F1EFE8;
  --aayu-border:        #E4E2DA;
  --aayu-border-strong: #D3D1C7;

  /* Text */
  --aayu-text-primary:   #1F2421;
  --aayu-text-secondary: #5F5E5A;
  --aayu-text-muted:     #888780;

  /* Semantic — used sparingly */
  --aayu-success:    #0F6E56;  --aayu-success-bg: #E1F5EE;
  --aayu-attention:  #BA7517;  --aayu-attention-bg: #FAEEDA;  /* "needs your attention" — NOT alarm */
  --aayu-danger:     #A32D2D;  --aayu-danger-bg:  #FCEBEB;    /* real errors only */
}
```

**Color rules:**
- Teal 600 is the only brand-fill color. One primary action per screen.
- Amber/attention = "needs your review/eligibility," never danger.
- Red is reserved strictly for genuine errors (upload failed, unreadable doc).
- Text on any colored tint uses the 800/900 stop of that same family — never black.
- Dark mode: invert surfaces to warm-dark (`#1A1C1B` page, `#242625` card); teal brand fills stay constant; text flips to `#F1EFE8` primary.

### 3.2 Color — JSON (for tooling / Style Dictionary)

```json
{
  "color": {
    "brand": { "primary": "#0F6E56", "action": "#1D9E75", "tint": "#E1F5EE", "onTint": "#04342C" },
    "ink":   { "900": "#042C53", "700": "#0C447C" },
    "surface": { "page": "#F7F6F2", "card": "#FFFFFF", "muted": "#F1EFE8" },
    "border": { "default": "#E4E2DA", "strong": "#D3D1C7" },
    "text": { "primary": "#1F2421", "secondary": "#5F5E5A", "muted": "#888780" },
    "semantic": {
      "success": { "fg": "#0F6E56", "bg": "#E1F5EE" },
      "attention": { "fg": "#BA7517", "bg": "#FAEEDA" },
      "danger": { "fg": "#A32D2D", "bg": "#FCEBEB" }
    }
  }
}
```

### 3.3 Typography

- **Family:** A humanist sans for warmth + legibility. Recommended: **Inter** or **Geist** (UI), fallback system stack. One family across the product.
- **Weights:** 400 (regular) and 500 (medium) only. Never 600/700 — too heavy for a calm health product.
- **Case:** Sentence case everywhere, including buttons and labels.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `display` | 28–32 / 1.2 | 500 | Outcome moments (₹ recovered) |
| `h1` | 22 / 1.3 | 500 | Screen titles |
| `h2` | 18 / 1.4 | 500 | Section headers |
| `body` | 16 / 1.7 | 400 | Default text |
| `body-sm` | 14 / 1.6 | 400 | Secondary |
| `caption` | 13 / 1.5 | 400 | Metadata, clause refs |
| `label` | 12 / 1.4 | 500 | Badges, overlines |

Min font size 13px for anything a user must read; never below 12px.

### 3.4 Spacing (8px base)

```
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 20px  --space-6: 24px  --space-8: 32px  --space-10: 40px  --space-12: 48px
```
Component-internal gaps in px (8/12/16); vertical section rhythm in larger steps (24/32/48).

### 3.5 Radii

```
--radius-sm: 8px    /* controls: buttons, inputs, chips */
--radius-md: 12px   /* cards, list rows, sheets */
--radius-lg: 16px   /* modals, bottom sheets */
--radius-pill: 999px /* status badges */
```

### 3.6 Elevation / shadows

Flat-first. Use borders, not shadows, to separate surfaces. Shadows only for genuinely floating layers.

```
--elevation-0: none;                                   /* in-flow cards use a 0.5px border */
--elevation-1: 0 1px 2px rgba(4,44,44,0.06);           /* raised card */
--elevation-2: 0 8px 24px rgba(4,44,44,0.10);          /* sheets, dropdowns */
--focus-ring: 0 0 0 3px rgba(15,110,86,0.25);          /* teal focus */
```

### 3.7 Motion

```
--dur-fast: 120ms    /* hovers, taps */
--dur-base: 220ms    /* enters, transitions */
--dur-slow: 400ms    /* celebratory reveals (result screen) */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* default — decisive, calm */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```
**Motion rules:** Purposeful only. Result reveal (₹ amount counts up over ~400ms) is the one "moment." Everything else is quiet fades/slides. Respect `prefers-reduced-motion` — disable count-up and non-essential transitions.

---

## 4. Information Architecture

### 4.1 Sitemap (MVP — max 9 views, per PRD 11.1)

```
Landing
 └─ Auth (sign up / log in)
     └─ Home / Patient selector  ──create/select patient──┐
         ├─ Consent (first upload only)                    │
         ├─ Upload documents                               │
         │    └─ Processing state                          │
         │        └─ Claim result  ◀── hero               │
         │            ├─ Appeal letter (view/edit/download)│
         │            └─ Policy Q&A (panel)                │
         ├─ Vault (auto-populated)                         │
         └─ Scheme match (card/screen)                     │
```

### 4.2 Navigation pattern

- **Mobile:** bottom tab bar with 3 items — Home, Vault, Help. The claim flow is a full-screen task launched from Home (not a tab).
- **Desktop/tablet:** left sidebar with the same three destinations; content max-width 720px, centered, so it never sprawls.
- One screen = one job. The claim task is linear (upload → process → result); no side-navigation mid-task.

---

## 5. Key User Flows (MVP)

**Flow A — Hero (fight a claim):**
Landing → Sign up → Create patient ("Appa, 62") → Consent → Upload (rejection + policy + bills) → Processing → **Claim result** (assessment + appeal + download) → auto: Vault seeded + scheme surfaced.

**Flow B — Explain my policy:** From claim result, open Policy Q&A panel → ask free-text → plain-language answer grounded in the uploaded policy.

**Flow C — View Vault:** Home → Vault → browse conditions, medications, timeline for the patient.

---

## 6. Component Library

Each component: purpose, anatomy, states. Build as reusable React components.

- **Button** — primary (teal fill, white text), secondary (hairline border, ink text), ghost (teal text only). One primary per screen. Height 44px (mobile tap target). States: default / hover / active(scale .98) / focus(ring) / loading(spinner + label) / disabled(avoid; prefer enabled).
- **Trust badge** — pill, teal tint bg, teal-900 text, shield/lock icon. Copy: "Pay only if we win," "Your data is encrypted." Always visible on upload + result screens.
- **Input / field** — 44px, hairline border, teal focus ring, label above (13px secondary). Inline validation below on blur. Minimal typing — prefer selects and prefilled values.
- **Patient selector** — avatar/initials + name + relation ("Appa · father, 62"). The first thing after login; sets context for all data.
- **Upload dropzone** — large tap area, icon + "Add photo or PDF," shows thumbnails of added files, per-file status (reading / done / unreadable-retry).
- **Metric card** — muted 13px label, 22–24px/500 value. Teal value for money/positive, ink for neutral counts.
- **Status chip** — pill. Success (teal tint), Attention (amber tint), Neutral (muted). Icon + 12px label.
- **Assessment card** — icon + title + plain-language body; used for "why it was denied" and clause explanation.
- **Document/letter card** — header with title + "review before sending" badge; body preview; actions (Download PDF, Edit).
- **List row** — for Vault records and the "we also did this" block: icon tile + title + subtitle + chevron. Bordered rows, not floating cards, in dense lists.
- **Bottom sheet / modal** — for consent and confirmations; radius 16px, elevation-2; normal-flow faux-viewport (never position:fixed in prototypes).

---

## 7. State Design (every screen needs all four)

- **Empty** — an invitation, not an apology. Vault before any upload: "Appa's health record starts here. Upload a report to begin." + CTA. Never "Nothing here yet."
- **Loading** — honest and specific. Processing screen names the step: "Reading the policy…", "Finding the clause…", "Drafting your appeal…". Skeletons for lists, not spinners alone. Reassure: "This takes about a minute. Your documents are encrypted."
- **Error** — say what happened + what to do, no jargon, no "Error:". Unreadable doc: "This photo's a little blurry to read. Retake it in good light?" + Retry. AI/API failure: "We couldn't finish this just now. Try again — nothing was lost." Never crash.
- **Success** — the result screen IS the success; no extra confetti. A single calm confirmation ("Appeal ready") plus the outcome. Micro: subtle check-mark draw + amount count-up (reduced-motion safe).

---

## 8. Forms & Validation

- Minimum fields. Prefer selects, toggles, prefilled values over typing.
- Validate on blur, not on every keystroke; show errors inline below the field in danger color with an icon.
- Consent is an explicit, readable checkbox screen — not buried fine print. Plain-language summary of what's collected and why, with a link to detail.
- File upload validates type/size client-side; gives per-file feedback.

---

## 9. Responsive Layout

- **Mobile (default, 360–430px):** single column, bottom tab bar, full-screen tasks, 16px side padding, 44px tap targets.
- **Tablet (768px):** single centered column max 640px; sidebar appears.
- **Desktop (1024px+):** left sidebar + centered content max 720px; never full-bleed forms. Two-column only for Vault (list + detail).
- Design mobile-first; desktop is the same components with more breathing room, not a different UI.

---

## 10. Accessibility (WCAG 2.1 AA)

- Contrast ≥ 4.5:1 for text; teal 600 on white passes; never place body text on teal fills below the 800 stop.
- All interactive elements keyboard-reachable, visible focus ring (teal, 3px).
- Tap targets ≥ 44×44px.
- Every input has a programmatic label; every icon-only button has `aria-label`; decorative icons `aria-hidden`.
- Respect `prefers-reduced-motion` (disable count-up, non-essential transitions).
- Don't encode meaning by color alone — pair status color with an icon + text.
- Screen-reader: logical heading order; processing state announces via `aria-live`; result amount announced.
- Support OS text scaling up to 200% without breaking layout.

---

## 11. Trust-Building Elements (non-negotiable)

These appear by design, not decoration:
- "Pay only if we win" — on upload and result.
- Encryption/lock indicator — persistent in the claim flow header.
- "Review before sending" on every AI-generated appeal (also a liability guardrail).
- Plain-language everything; clause references cited by section number.
- Explicit consent before first processing; clear data-deletion path.
- Never alarmist copy; never fake urgency or countdowns.

---

## 12. Developer Handoff

- Tokens ship as CSS custom properties (Section 3) — single source; Tailwind config or Style Dictionary generated from the JSON.
- Components map 1:1 to the library in Section 6; name them exactly (`<Button>`, `<TrustBadge>`, `<PatientSelector>`, `<UploadDropzone>`, `<AssessmentCard>`, `<LetterCard>`, `<MetricCard>`, `<StatusChip>`, `<ListRow>`).
- Each component: props for state variants; no inline magic numbers — reference tokens.
- Spacing, radii, motion all reference tokens, never literals.
- Every screen implements all four states (Section 7) before it's "done."
- Match the two rendered mockups (design foundations + claim result) as the visual target.

---

## 13. Out of Scope for MVP Design

Per PRD 11.7 — do NOT design or build: payments UI, pre-claim check flow, full eligibility engine screens, ABDM integration, notifications, medication management, multi-caregiver management, provider/insurer views, native app shells, manual Vault entry. Vault is view-only and auto-populated.

---

*End of Design System v1.0. Match the rendered mockups. Build only PRD-scoped screens. Calm is the brand.*
