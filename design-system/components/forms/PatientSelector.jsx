import React from 'react';
export function PatientSelector({name, relation, age, selected=false, onClick}) {
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return React.createElement('button', {
    onClick,
    style:{display:'flex', alignItems:'center', gap:12, width:'100%', textAlign:'left', padding:'var(--space-3) var(--space-4)', borderRadius:'var(--radius-md)', border: selected ? '1.5px solid var(--aayu-teal-600)' : '0.5px solid var(--aayu-border)', background: selected ? 'var(--aayu-success-bg)' : 'var(--aayu-surface-card)', cursor:'pointer', fontFamily:'var(--font-sans)'}
  },
    React.createElement('div', {style:{width:40, height:40, borderRadius:'50%', background:'var(--aayu-teal-100)', color:'var(--aayu-teal-900)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:500, fontSize:14, flexShrink:0}}, initials),
    React.createElement('div', null,
      React.createElement('div', {style:{fontSize:16, fontWeight:500, color:'var(--aayu-text-primary)'}}, name),
      React.createElement('div', {style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-text-secondary)'}}, `${relation} · ${age}`)
    )
  );
}
