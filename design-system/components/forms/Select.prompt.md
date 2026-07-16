Native dropdown styled to match Input — the design system prefers selects/prefilled values over free typing.

```jsx
<Select label="Relation to patient" placeholder="Choose one"
  options={['Father','Mother','Spouse','Sibling','Other']} value={rel} onChange={e=>setRel(e.target.value)} />
```

Chevron uses Lucide; call `lucide.createIcons()` after mount.
