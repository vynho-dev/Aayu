import React from 'react';
export function TrustBadge({icon='shield-check', children}) {
  return React.createElement('div', {
    style:{display:'inline-flex', alignItems:'center', gap:6, background:'var(--aayu-success-bg)', color:'var(--aayu-teal-900)', borderRadius:'var(--radius-pill)', padding:'6px 12px', fontSize:'var(--text-caption-size)', fontFamily:'var(--font-sans)', fontWeight:500}
  }, React.createElement('i', {'data-lucide':icon, style:{width:14, height:14}}), children);
}
