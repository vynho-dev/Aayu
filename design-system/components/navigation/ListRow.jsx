import React from 'react';
export function ListRow({icon='file-text', title, subtitle, onClick}) {
  return React.createElement('button', {
    onClick,
    style:{display:'flex', alignItems:'center', gap:12, width:'100%', textAlign:'left', padding:'12px 16px', background:'var(--aayu-surface-card)', border:'none', borderBottom:'0.5px solid var(--aayu-border)', cursor: onClick ? 'pointer' : 'default', fontFamily:'var(--font-sans)'}
  },
    React.createElement('div', {style:{width:36, height:36, borderRadius:'var(--radius-sm)', background:'var(--aayu-surface-muted)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}},
      React.createElement('i', {'data-lucide':icon, style:{width:18, height:18, color:'var(--aayu-teal-600)'}})
    ),
    React.createElement('div', {style:{flex:1}},
      React.createElement('div', {style:{fontSize:15, fontWeight:500, color:'var(--aayu-text-primary)'}}, title),
      subtitle && React.createElement('div', {style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-text-secondary)'}}, subtitle)
    ),
    React.createElement('i', {'data-lucide':'chevron-right', style:{width:18, height:18, color:'var(--aayu-text-muted)'}})
  );
}
