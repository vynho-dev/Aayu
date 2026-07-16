import React from 'react';
export function UploadDropzone({files=[], onAdd}) {
  return React.createElement('div', {style:{display:'flex', flexDirection:'column', gap:12, fontFamily:'var(--font-sans)'}},
    React.createElement('label', {
      style:{border:'1.5px dashed var(--aayu-border-strong)', borderRadius:'var(--radius-md)', background:'var(--aayu-surface-muted)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:'32px 16px', cursor:'pointer'}
    },
      React.createElement('i', {'data-lucide':'upload', style:{width:28, height:28, color:'var(--aayu-teal-600)'}}),
      React.createElement('div', {style:{fontSize:15, fontWeight:500, color:'var(--aayu-text-primary)'}}, 'Add photo or PDF'),
      React.createElement('input', {type:'file', multiple:true, style:{display:'none'}, onChange:onAdd})
    ),
    files.length > 0 && React.createElement('div', {style:{display:'flex', flexDirection:'column', gap:8}},
      files.map((f,i) => React.createElement('div', {key:i, style:{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-sm)', background:'var(--aayu-surface-card)'}},
        React.createElement('i', {'data-lucide':'file-text', style:{width:18, height:18, color:'var(--aayu-text-secondary)'}}),
        React.createElement('div', {style:{flex:1, fontSize:14, color:'var(--aayu-text-primary)'}}, f.name),
        React.createElement('span', {style:{fontSize:12, color: f.status==='done' ? 'var(--aayu-success)' : f.status==='unreadable' ? 'var(--aayu-danger)' : 'var(--aayu-text-muted)'}}, f.status)
      ))
    )
  );
}
