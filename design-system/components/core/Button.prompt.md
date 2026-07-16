Primary action button — teal fill for the one primary action per screen; secondary (hairline border) and ghost (text-only) for lesser actions.

```jsx
<Button variant="primary" onClick={submit}>Continue</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Skip for now</Button>
<Button variant="primary" loading>Submitting</Button>
```

Height is fixed at 44px (mobile tap target). Avoid `disabled` where possible — the design system prefers an always-enabled button with inline validation over a disabled one.
