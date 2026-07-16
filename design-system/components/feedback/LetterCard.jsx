import React, {useState} from 'react';
export function LetterCard({title, preview, editable=false, onDownload}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(typeof preview === 'string' ? preview : '');
  const body = editing
    ? React.createElement('textarea', {
        value:text, onChange:e=>setText(e.target.value), autoFocus:true,
        style:{width:'100%', minHeight:140, resize:'vertical', border:'1px solid var(--aayu-border-strong)', borderRadius:'var(--radius-sm)', padding:12, fontSize:'var(--text-body-sm-size)', lineHeight:'var(--text-body-sm-lh)', fontFamily:'var(--font-sans)', color:'var(--aayu-text-primary)', outline:'none'}
      })
    : React.createElement('div', {style:{fontSize:'var(--text-body-sm-size)', lineHeight:'var(--text-body-sm-lh)', color:'var(--aayu-text-secondary)', maxHeight: editable ? 200 : 120, overflow:'hidden', whiteSpace:'pre-wrap'}}, editing ? text : (text || preview));
  return React.createElement('div', {
    style:{background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', overflow:'hidden', fontFamily:'var(--font-sans)'}
  },
    React.createElement('div', {style:{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'0.5px solid var(--aayu-border)'}},
      React.createElement('div', {style:{fontSize:16, fontWeight:500, color:'var(--aayu-text-primary)'}}, title),
      React.createElement('span', {style:{fontSize:'var(--text-label-size)', fontWeight:500, background:'var(--aayu-attention-bg)', color:'var(--aayu-attention)', borderRadius:'var(--radius-pill)', padding:'4px 10px'}}, 'Review before sending')
    ),
    React.createElement('div', {style:{padding:16}}, body),
    React.createElement('div', {style:{display:'flex', gap:10, padding:'12px 16px', borderTop:'0.5px solid var(--aayu-border)'}},
      React.createElement('button', {onClick:onDownload, style:{height:36, padding:'0 14px', borderRadius:'var(--radius-sm)', border:'none', background:'var(--aayu-teal-600)', color:'#fff', fontWeight:500, fontSize:14, cursor:'pointer'}}, 'Download PDF'),
      editable && React.createElement('button', {onClick:()=>setEditing(e=>!e), style:{height:36, padding:'0 14px', borderRadius:'var(--radius-sm)', border:'1px solid var(--aayu-border-strong)', background:'transparent', color:'var(--aayu-text-primary)', fontWeight:500, fontSize:14, cursor:'pointer'}}, editing ? 'Done editing' : 'Edit letter')
    )
  );
}
