const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function PolicyQAScreen({onClose}) {
  const [messages, setMessages] = React.useState([
    {from:'user', text:'Does my policy cover a second surgery this year?'},
    {from:'ai', text:'Yes — your policy allows unlimited claims within the annual sum insured of ₹5,00,000, as long as the cumulative amount for the year hasn’t been exhausted (Section 2.3).'}
  ]);
  const [draft, setDraft] = React.useState('');
  const send = () => { if(!draft.trim()) return; setMessages(m => [...m, {from:'user', text:draft}]); setDraft(''); };
  return (
    <div style={{display:'flex', flexDirection:'column', minHeight:520, background:'var(--aayu-surface-page)'}}>
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'16px 20px', borderBottom:'0.5px solid var(--aayu-border)', background:'var(--aayu-surface-card)'}}>
        <button onClick={onClose} aria-label="Go back" style={{border:'none', background:'none', cursor:'pointer', color:'var(--aayu-text-secondary)'}}><i data-lucide="arrow-left" style={{width:20, height:20}} aria-hidden="true"></i></button>
        <div style={{fontSize:16, fontWeight:500, color:'var(--aayu-text-primary)'}}>Explain my policy</div>
      </div>
      <div style={{flex:1, padding:20, display:'flex', flexDirection:'column', gap:12, overflowY:'auto'}}>
        {messages.map((m,i) => (
          <div key={i} style={{alignSelf: m.from==='user' ? 'flex-end' : 'flex-start', maxWidth:'80%', background: m.from==='user' ? 'var(--aayu-teal-600)' : 'var(--aayu-surface-card)', color: m.from==='user' ? '#fff' : 'var(--aayu-text-primary)', border: m.from==='ai' ? '0.5px solid var(--aayu-border)' : 'none', borderRadius:'var(--radius-md)', padding:'10px 14px', fontSize:15, lineHeight:1.6}}>{m.text}</div>
        ))}
      </div>
      <div style={{display:'flex', gap:10, padding:16, borderTop:'0.5px solid var(--aayu-border)', background:'var(--aayu-surface-card)'}}>
        <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ask anything about your policy" style={{flex:1, height:44, borderRadius:'var(--radius-sm)', border:'1px solid var(--aayu-border-strong)', padding:'0 14px', fontSize:15, fontFamily:'var(--font-sans)'}} />
        <Button variant="primary" onClick={send}>Ask</Button>
      </div>
    </div>
  );
}

window.PolicyQAScreen = PolicyQAScreen;
