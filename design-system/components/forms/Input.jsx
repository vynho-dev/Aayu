import React, {useState, useId} from 'react';
export function Input({label, placeholder, error, value, onChange, type='text'}) {
  const [touched, setTouched] = useState(false);
  const id = useId();
  const errId = id + '-err';
  const showError = touched && error;
  return React.createElement('div', {style:{display:'flex', flexDirection:'column', gap:6, fontFamily:'var(--font-sans)'}},
    label && React.createElement('label', {htmlFor:id, style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-text-secondary)', fontWeight:500}}, label),
    React.createElement('input', {
      id, type, placeholder, value, onChange,
      'aria-invalid': showError ? true : undefined,
      'aria-describedby': showError ? errId : undefined,
      onBlur: () => setTouched(true),
      style:{height:'var(--tap-target)', borderRadius:'var(--radius-sm)', border: showError ? '1px solid var(--aayu-danger)' : '1px solid var(--aayu-border-strong)', padding:'0 14px', fontSize:16, fontFamily:'var(--font-sans)', color:'var(--aayu-text-primary)', background:'var(--aayu-surface-card)'}
    }),
    showError && React.createElement('div', {id:errId, role:'alert', style:{fontSize:'var(--text-caption-size)', color:'var(--aayu-danger)', display:'flex', alignItems:'center', gap:4}}, React.createElement('i', {'data-lucide':'alert-circle', style:{width:13, height:13}, 'aria-hidden':'true'}), error)
  );
}
