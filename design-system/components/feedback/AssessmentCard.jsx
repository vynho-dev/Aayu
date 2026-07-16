import React from 'react';
export function AssessmentCard({icon='file-search', title, children}) {
  return React.createElement('div', {
    style:{display:'flex', gap:14, padding:'var(--space-4)', background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', fontFamily:'var(--font-sans)'}
  },
    React.createElement('div', {style:{width:36, height:36, borderRadius:'50%', background:'var(--aayu-success-bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}},
      React.createElement('i', {'data-lucide':icon, style:{width:18, height:18, color:'var(--aayu-teal-600)'}})
    ),
    React.createElement('div', null,
      React.createElement('div', {style:{fontSize:16, fontWeight:500, color:'var(--aayu-text-primary)', marginBottom:4}}, title),
      React.createElement('div', {style:{fontSize:'var(--text-body-sm-size)', lineHeight:'var(--text-body-sm-lh)', color:'var(--aayu-text-secondary)'}}, children)
    )
  );
}
