import React from 'react';
export function BottomSheet({title, children, onClose, primaryLabel='Continue', onPrimary}) {
  return React.createElement('div', {style:{display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(4,44,44,0.35)', padding:16, fontFamily:'var(--font-sans)'}},
    React.createElement('div', {style:{width:'100%', maxWidth:420, background:'var(--aayu-surface-card)', borderRadius:'var(--radius-lg) var(--radius-lg) 0 0', boxShadow:'var(--elevation-2)', padding:'var(--space-6) var(--space-5)', display:'flex', flexDirection:'column', gap:12}},
      React.createElement('div', {style:{display:'flex', justifyContent:'space-between', alignItems:'center'}},
        React.createElement('div', {style:{fontSize:18, fontWeight:500, color:'var(--aayu-text-primary)'}}, title),
        onClose && React.createElement('button', {onClick:onClose, style:{border:'none', background:'none', cursor:'pointer', color:'var(--aayu-text-muted)'}}, React.createElement('i', {'data-lucide':'x', style:{width:20, height:20}}))
      ),
      React.createElement('div', {style:{fontSize:'var(--text-body-size)', lineHeight:'var(--text-body-lh)', color:'var(--aayu-text-secondary)'}}, children),
      React.createElement('button', {onClick:onPrimary, style:{height:'var(--tap-target)', borderRadius:'var(--radius-sm)', border:'none', background:'var(--aayu-teal-600)', color:'#fff', fontWeight:500, fontSize:16, cursor:'pointer', marginTop:8}}, primaryLabel)
    )
  );
}
