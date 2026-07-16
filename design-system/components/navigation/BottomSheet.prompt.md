For consent and confirmations — radius 16px, elevation-2, rendered in normal flow (faux-viewport), never `position:fixed`.

```jsx
<BottomSheet title="Before we start" primaryLabel="I agree, continue" onPrimary={agree} onClose={cancel}>
  We'll read your uploaded documents to build the assessment. Nothing is shared without your consent.
</BottomSheet>
```
