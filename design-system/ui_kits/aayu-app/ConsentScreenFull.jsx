const { Button, TrustBadge } = window.AayuDesignSystem_84693d;

function ConsentScreenFull({wide, onAgree, onClose}) {
  const [checked, setChecked] = React.useState(false);
  const points = [
    {icon:'file-text', t:'What we read', d:'The documents you upload — rejection letter, policy, bills.'},
    {icon:'target', t:'Why', d:'To assess the denial, draft your appeal, and build Appa’s health record.'},
    {icon:'shield-check', t:'How it’s protected', d:'Encrypted at rest and in transit. Never shared without your say.'},
  ];
  return (
    <div style={{minHeight:520, background:'var(--aayu-surface-page)', display:'flex', flexDirection:'column', padding: wide ? '40px 0' : '24px 20px', alignItems:'center'}}>
      <div style={{width:'100%', maxWidth:420, display:'flex', flexDirection:'column', gap:16}}>
        <div>
          <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Before we start</div>
          <div style={{fontSize:14, color:'var(--aayu-text-secondary)', marginTop:2}}>Plain language, no fine print. You’re in control.</div>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {points.map((p,i)=>(
            <div key={i} style={{display:'flex', gap:12, background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', padding:14}}>
              <span style={{width:36, height:36, borderRadius:'50%', background:'var(--aayu-success-bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><i data-lucide={p.icon} style={{width:18, height:18, color:'var(--aayu-teal-600)'}}></i></span>
              <div><div style={{fontSize:15, fontWeight:500, color:'var(--aayu-text-primary)'}}>{p.t}</div><div style={{fontSize:13, color:'var(--aayu-text-secondary)', lineHeight:1.5}}>{p.d}</div></div>
            </div>
          ))}
        </div>
        <label style={{display:'flex', gap:10, alignItems:'flex-start', cursor:'pointer', padding:'4px 2px'}}>
          <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} style={{width:20, height:20, marginTop:2, accentColor:'var(--aayu-teal-600)'}} />
          <span style={{fontSize:14, color:'var(--aayu-text-primary)', lineHeight:1.5}}>I consent to Aayu processing these documents to help with Appa’s claim. <span style={{color:'var(--aayu-teal-600)'}}>Read the detail</span></span>
        </label>
        <Button variant="primary" onClick={onAgree} disabled={!checked} style={{width:'100%'}}>I agree, continue</Button>
        <div style={{display:'flex', justifyContent:'center'}}><TrustBadge icon="lock">You can delete your data anytime</TrustBadge></div>
      </div>
    </div>
  );
}
window.ConsentScreenFull = ConsentScreenFull;
