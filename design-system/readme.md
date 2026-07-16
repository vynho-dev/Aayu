# Aayu Design System

Aayu (आयु — lifespan, vitality) is a patient-side healthcare platform for Indian families. The MVP wedge: a caregiver uploads a wrongly-denied health insurance claim, and Aayu's AI produces a clause-cited appeal letter, auto-populates a lifelong medical Vault, and surfaces a government scheme — one document doing three jobs.

**Primary user:** the caregiving adult child (e.g. "Priya, 34") managing a parent's ("Appa, 62") healthcare and claims remotely, on a low-end phone.

**Sources used to build this system:**
- [github.com/vynho-dev/Aayu](https://github.com/vynho-dev/Aayu) — `PRD.md` (product requirements, locked MVP scope) and `Design_System.md` (full design spec: tokens, IA, component list, states, accessibility). No code, Figma file, screenshots, logo, or icon assets exist in this repo — everything here is built directly from those two markdown documents. Explore the repo further for the underlying product rationale (risks, roadmap, success metrics) not reproduced here.

There is no product codebase yet (4-day MVP build, PRD written first) — this design system IS the source of truth the eventual codebase should follow.

---

## Content fundamentals

- **Voice:** warm, plain-spoken, on-your-side. Never corporate, never alarmist.
- **Case:** sentence case everywhere — including buttons and labels. Never Title Case, never ALL CAPS (except tiny overline labels like "CONDITIONS" in Vault section headers).
- **Contractions are used** ("we'll", "you're") — this is a person talking, not a policy document.
- **Say what things do, plainly.** Do: *"We found the clause the insurer missed."* Don't: *"Maximize your claim recovery potential!"*
- **Lead with the outcome, then the mechanism.** Claim result shows the ₹ amount first, assessment detail second.
- **No jargon, no "Error:" prefixes.** *"This photo's a little blurry to read. Retake it in good light?"* not *"Error: OCR confidence below threshold."*
- **Never fake urgency, never dark patterns.** No countdowns, no "act now," no guilt.
- **No emoji.** The brand voice is warm through word choice, not decoration.
- **Empty states are invitations, not apologies.** *"Appa's health record starts here. Upload a report to begin."* — never "Nothing here yet."
- **One primary action per screen**, described in the button label as the outcome ("Continue with Appa", not "Next").

## Visual foundations

- **Color:** one brand fill — Teal 600 (`#0F6E56`) — used for the single primary action per screen. Warm off-white page background (`#F7F6F2`), never stark white-on-gray. Ink navy (`#042C53`) for trust-signaling headings, used sparingly. Amber "attention" is explicitly *not* alarm — it means "needs your review." Red is reserved strictly for genuine errors. No gradients anywhere.
- **Type:** Inter, sentence case, weights 400/500 only — 600/700 are explicitly banned as "too heavy for a calm health product." One display moment (28–32px/500) reserved for outcome numbers (₹ recovered); everything else is quiet.
- **Spacing:** 8px base scale (4 → 48px). Component-internal gaps use the small steps (8/12/16); section rhythm uses the large ones (24/32/48).
- **Backgrounds:** flat warm neutrals only. No photography, no illustration, no full-bleed imagery, no textures or patterns — nothing in the source repo defines any. Screens are content-first and quiet.
- **Animation:** purposeful only, and rare. Fast (120ms) for hover/tap feedback, base (220ms) for transitions, slow (400ms) reserved for exactly one moment — the ₹-amount count-up on the claim result screen. Everything else is a quiet fade/slide. `prefers-reduced-motion` disables the count-up and non-essential transitions.
- **Hover / press states:** hover shifts toward Teal 400 (the "action" stop); press scales the control to 0.98. No color-darkening tricks, no shadows-on-hover.
- **Borders & shadows:** flat-first. In-flow cards use a 0.5px hairline border, *not* a shadow — shadows are reserved for genuinely floating layers (bottom sheets, dropdowns). This is a deliberate rule, not an oversight.
- **Corner radii:** 8px controls (buttons/inputs/chips), 12px cards/list rows, 16px modals/sheets, pill (999px) for status badges only.
- **Cards:** white surface, hairline border, 12px radius, no shadow, no colored left-border accent (explicitly avoided).
- **Layout:** mobile-first (360–430px), bottom tab bar (Home / Vault / Help), single column, 16px side padding, 44px minimum tap targets. Desktop mirrors mobile with a left sidebar and a 720px-max centered content column — never full-bleed forms.
- **Transparency/blur:** used once, deliberately — the scrim behind a bottom sheet (`rgba(4,44,44,0.35)`). No frosted-glass panels, no blur-as-decoration.
- **Imagery:** none defined in source. If/when product photography is introduced, it should read as warm and human (per "warmth + evidence" signature), not clinical or cold — but no actual images exist yet; do not invent any.

## Iconography

No icon assets, icon font, or SVG sprite exist in the source repo. The design spec's component list (Trust badge, Status chip, Upload dropzone, Assessment card, Vault list rows) implies simple, minimal line icons at small sizes (14–28px) paired with text — never color alone for meaning.

**Confirmed:** this system uses [Lucide](https://lucide.dev) as its **single, official icon library**, used consistently across the whole app — thin (1.5px) stroke, rounded caps, no fill. Loaded via CDN (`unpkg.com/lucide@latest`). No emoji, no unicode glyphs used as icons anywhere. (Lucide was originally the closest match to a "calm fintech/health" line style since the source repo shipped no icon assets; the team has now adopted it officially.)

## Fonts — Inter (confirmed)

`Design_System.md` recommends **Inter or Geist**, with no font binaries in the repo. The team has **confirmed Inter** (weights 400/500), vendored into `assets/fonts/` as `.woff2`. No further font decision pending.

## Logo — none provided

No logo file exists anywhere in the source. Per the spec: *"Rounded-square containing a heartbeat/pulse glyph in Teal 700 on light, or reversed to white on teal."* This system does **not** draw that mark — every place a logo would go instead renders the plain wordmark **"Aayu"** in Inter Medium. Replace with the real mark as soon as one exists.

## Intentional additions

- **Input** — the spec's Section 6 doesn't list a generic text field by name, but Section 8 (Forms & Validation) requires one; added to support Auth and free-typed fields.
- **BottomSheet** — named directly in spec Section 6 ("Bottom sheet / modal") but given its own component rather than folded into Dialog, since the spec explicitly forbids `position:fixed` and describes sheet-specific radius/elevation.
- **Select** — the spec's Section 8 mandates "prefer selects, toggles, prefilled values over typing" but Section 6 doesn't name a dropdown primitive; added to satisfy that forms rule (patient relation, document type, etc.).

---

## Index

```
styles.css                 → single entry point, @imports only
tokens/                     colors, typography, spacing, radii, elevation, motion, fonts, base reset
assets/fonts/                Inter-Regular.woff2, Inter-Medium.woff2
guidelines/                  foundation specimen cards (Colors, Type, Spacing, Brand, Iconography)
components/
  core/                       Button, TrustBadge, StatusChip, MetricCard
  forms/                      Input, PatientSelector, UploadDropzone
  feedback/                   AssessmentCard, LetterCard
  navigation/                 ListRow, BottomSheet
ui_kits/aayu-app/            interactive click-through: Landing → Auth → Patient picker → Consent →
                              Upload → Processing → Claim result → Policy Q&A / Vault
SKILL.md                     portable skill definition for Claude Code / other agents
```

All 11 components map 1:1 to `Design_System.md` §6 (Button, Trust badge, Input/field, Patient selector, Upload dropzone, Metric card, Status chip, Assessment card, Document/letter card, List row, Bottom sheet/modal) — no invented primitives beyond the two noted above. A **Select** dropdown was later added (see Intentional additions) to support the "prefer selects over typing" forms rule.

---

## Resolved product decisions (locked)

These were open questions; the team has now locked them. Build against these.

| Decision | Locked answer |
|---|---|
| **Main nav model** | `Home · Health · Claim · Schemes · Profile`. Claim is an **elevated center action** in the mobile tab bar / a nav item in the desktop sidebar; it launches the full-screen upload task. |
| **"Health" vs "Vault"** | **Health**, always, in all user-facing copy. "Vault" is internal-only (it feels intimidating to users). |
| **Appeal letter** | **Editable preview + download PDF.** The user reviews and can edit the generated letter inline before the final PDF download. `LetterCard` has an `editable` mode for this. |
| **Scheme match** | Start with **3–5 high-confidence schemes only**. Never flood the user with low-confidence matches early; show one strong match + an honest "still checking" state. |

## Responsive breakpoints

Mobile-first. Three tiers, same components with more breathing room:

| Tier | Range | Chrome | Content |
|---|---|---|---|
| **Mobile** | 360–767px | Bottom tab bar (Claim elevated center) | Single column, 16px side padding, 44px tap targets |
| **Tablet** | 768–1023px | Left sidebar appears | Single centered column, max 640–720px |
| **Desktop** | 1024px+ | Left sidebar | Centered content max 720px; two-column only for Home & list+detail (Health) |

## Screen states (required for every screen)

Per `Design_System.md` §7, every screen ships all four states before it is "done":
- **Empty** — an invitation, not an apology ("Appa's health record starts here.").
- **Loading** — honest and specific, names the step ("Finding the clause…"); skeletons for lists.
- **Error** — says what happened + what to do, no jargon, no "Error:" prefix; always a retry.
- **Success** — the outcome screen itself is the success; one calm confirmation, no confetti.

See `ui_kits/aayu-app/states.html` for the full state matrix and `blueprint.html` for the screen layouts across all three breakpoints.
