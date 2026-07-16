import React from 'react';
export function MetricCard({label, value, tone='ink'}) {
  return React.createElement('div', {
    style:{background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', padding:'var(--space-4)', display:'flex', flexDirection:'column', gap:4, fontFamily:'var(--font-sans)', minWidth:140}
  },
    React.createElement('div', {style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-text-muted)', fontWeight:500}}, label),
    React.createElement('div', {style:{fontSize:24, fontWeight:500, color: tone==='teal' ? 'var(--aayu-teal-600)' : 'var(--aayu-ink-900)'}}, value)
  );
}
