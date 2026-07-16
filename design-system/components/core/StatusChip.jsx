import React from 'react';
const tones = {
  success: {bg:'var(--aayu-success-bg)', fg:'var(--aayu-success)', icon:'check'},
  attention: {bg:'var(--aayu-attention-bg)', fg:'var(--aayu-attention)', icon:'clock'},
  neutral: {bg:'var(--aayu-surface-muted)', fg:'var(--aayu-text-secondary)', icon:'circle'}
};
export function StatusChip({tone='neutral', children}) {
  const t = tones[tone];
  return React.createElement('span', {
    style:{display:'inline-flex', alignItems:'center', gap:4, background:t.bg, color:t.fg, borderRadius:'var(--radius-pill)', padding:'4px 10px', fontSize:'var(--text-label-size)', fontWeight:500, fontFamily:'var(--font-sans)'}
  }, React.createElement('i', {'data-lucide':t.icon, style:{width:12, height:12}}), children);
}
