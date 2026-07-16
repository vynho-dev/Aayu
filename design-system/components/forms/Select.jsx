import React from 'react';
export function Select({label, options=[], value, onChange, placeholder='Select…'}) {
  return React.createElement('div', {style:{display:'flex', flexDirection:'column', gap:6, fontFamily:'var(--font-sans)'}},
    label && React.createElement('label', {style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-text-secondary)', fontWeight:500}}, label),
    React.createElement('div', {style:{position:'relative'}},
      React.createElement('select', {
        value, onChange,
        style:{appearance:'none', WebkitAppearance:'none', width:'100%', height:'var(--tap-target)', borderRadius:'var(--radius-sm)', border:'1px solid var(--aayu-border-strong)', padding:'0 40px 0 14px', fontSize:16, fontFamily:'var(--font-sans)', color: value ? 'var(--aayu-text-primary)' : 'var(--aayu-text-muted)', background:'var(--aayu-surface-card)', outline:'none', cursor:'pointer'}
      },
        !value && React.createElement('option', {value:'', disabled:true}, placeholder),
        options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          return React.createElement('option', {key:val, value:val}, lbl);
        })
      ),
      React.createElement('i', {'data-lucide':'chevron-down', style:{position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:18, height:18, color:'var(--aayu-text-muted)', pointerEvents:'none'}})
    )
  );
}
