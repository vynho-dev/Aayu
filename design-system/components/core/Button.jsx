import React from 'react';
export function Button({variant='primary', size='md', loading=false, disabled=false, children, onClick, style}) {
  const base = {fontFamily:'var(--font-sans)', fontSize:16, fontWeight:500, height:'var(--tap-target)', padding:'0 20px', borderRadius:'var(--radius-sm)', border:'none', cursor:disabled?'not-allowed':'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', opacity:disabled?0.5:1};
  const variants = {
    primary: {background:'var(--aayu-teal-600)', color:'#fff'},
    secondary: {background:'transparent', color:'var(--aayu-text-primary)', border:'1px solid var(--aayu-border-strong)'},
    ghost: {background:'transparent', color:'var(--aayu-teal-600)'}
  };
  return React.createElement('button', {
    style:{...base, ...variants[variant], ...style},
    disabled: disabled || loading,
    onClick,
    onMouseDown: e => { if(!disabled) e.currentTarget.style.transform='scale(0.98)'; },
    onMouseUp: e => { e.currentTarget.style.transform='scale(1)'; }
  }, loading ? 'Working…' : children);
}
