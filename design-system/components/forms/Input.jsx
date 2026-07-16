import React, {useState} from 'react';
export function Input({label, placeholder, error, value, onChange, type='text'}) {
  const [touched, setTouched] = useState(false);
  return React.createElement('div', {style:{display:'flex', flexDirection:'column', gap:6, fontFamily:'var(--font-sans)'}},
    label && React.createElement('label', {style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-text-secondary)', fontWeight:500}}, label),
    React.createElement('input', {
      type, placeholder, value, onChange,
      onBlur: () => setTouched(true),
      style:{height:'var(--tap-target)', borderRadius:'var(--radius-sm)', border: touched && error ? '1px solid var(--aayu-danger)' : '1px solid var(--aayu-border-strong)', padding:'0 14px', fontSize:16, fontFamily:'var(--font-sans)', outline:'none', color:'var(--aayu-text-primary)', background:'var(--aayu-surface-card)'}
    }),
    touched && error && React.createElement('div', {style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-danger)', display:'flex', alignItems:'center', gap:4}}, React.createElement('i', {'data-lucide':'alert-circle', style:{width:13, height:13}}), error)
  );
}
