const { Button, TrustBadge, StatusChip, MetricCard, ListRow } = window.AayuDesignSystem_84693d;

function SectionLabel({children}) {
  return <div style={{fontSize:12, fontWeight:500, letterSpacing:'0.04em', color:'var(--aayu-text-muted)', textTransform:'uppercase', margin:'4px 0 10px'}}>{children}</div>;
}

function ActiveClaimCard({onReview, onAsk}) {
  return (
    <div style={{background:'var(--aayu-success-bg)', border:'0.5px solid var(--aayu-teal-100)', borderRadius:'var(--radius-md)', padding:'var(--space-5)', display:'flex', flexDirection:'column', gap:12}}>
      <StatusChip tone="attention">Contestable denial</StatusChip>
      <div>
        <div style={{fontSize:30, fontWeight:500, color:'var(--aayu-teal-600)', lineHeight:1.1}}>₹18,400</div>
        <div style={{fontSize:14, color:'var(--aayu-teal-800)', marginTop:4}}>recoverable on Appa's rejected claim</div>
      </div>
      <div style={{fontSize:14, color:'var(--aayu-text-secondary)'}}>Your appeal is drafted and cites Section 4.2. Review it before sending.</div>
      <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
        <Button variant="primary" onClick={onReview}>Review appeal</Button>
        <Button variant="secondary" onClick={onAsk}>Ask about my policy</Button>
      </div>
    </div>
  );
}

function QuickTile({icon, title, value, sub, onClick}) {
  return (
    <button onClick={onClick} style={{flex:1, minWidth:0, textAlign:'left', background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', padding:'var(--space-4)', cursor:'pointer', fontFamily:'var(--font-sans)', display:'flex', flexDirection:'column', gap:8}}>
      <i data-lucide={icon} style={{width:22, height:22, color:'var(--aayu-teal-600)'}}></i>
      <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-ink-900)'}}>{value}</div>
      <div style={{fontSize:13, color:'var(--aayu-text-secondary)'}}>{title}</div>
      {sub && <div style={{fontSize:12, color:'var(--aayu-text-muted)'}}>{sub}</div>}
    </button>
  );
}

function HomeScreen({wide, onNav, onReview, onAsk}) {
  const activity = [
    {icon:'file-check-2', title:'Appeal letter generated', subtitle:'2 min ago'},
    {icon:'heart-pulse', title:'3 documents added to Health', subtitle:'2 min ago'},
    {icon:'landmark', title:'Scheme match found: PM-JAY', subtitle:'2 min ago'},
  ];
  return (
    <div style={{padding: wide ? 0 : '20px 16px', display:'flex', flexDirection:'column', gap:20}}>
      {!wide && (
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Hi Priya</div>
            <div style={{fontSize:13, color:'var(--aayu-text-secondary)', marginTop:2}}>Here's where Appa's care stands.</div>
          </div>
          <button style={{display:'flex', alignItems:'center', gap:8, border:'0.5px solid var(--aayu-border)', background:'var(--aayu-surface-card)', borderRadius:'var(--radius-pill)', padding:'6px 8px 6px 6px', cursor:'pointer', fontFamily:'var(--font-sans)'}}>
            <span style={{width:28, height:28, borderRadius:'50%', background:'var(--aayu-teal-100)', color:'var(--aayu-teal-900)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:500, fontSize:12}}>A</span>
            <span style={{fontSize:13, fontWeight:500, color:'var(--aayu-text-primary)'}}>Appa</span>
            <i data-lucide="chevron-down" style={{width:16, height:16, color:'var(--aayu-text-muted)'}}></i>
          </button>
        </div>
      )}
      {wide && (
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4}}>
          <div style={{fontSize:26, fontWeight:500, color:'var(--aayu-text-primary)'}}>Hi Priya</div>
          <button style={{display:'flex', alignItems:'center', gap:8, border:'0.5px solid var(--aayu-border)', background:'var(--aayu-surface-card)', borderRadius:'var(--radius-pill)', padding:'6px 12px 6px 6px', cursor:'pointer', fontFamily:'var(--font-sans)'}}>
            <span style={{width:28, height:28, borderRadius:'50%', background:'var(--aayu-teal-100)', color:'var(--aayu-teal-900)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:500, fontSize:12}}>A</span>
            <span style={{fontSize:14, fontWeight:500, color:'var(--aayu-text-primary)'}}>Appa · Father, 62</span>
            <i data-lucide="chevron-down" style={{width:16, height:16, color:'var(--aayu-text-muted)'}}></i>
          </button>
        </div>
      )}

      <div style={{display: wide ? 'grid' : 'block', gridTemplateColumns: wide ? '1.2fr 1fr' : 'none', gap:20}}>
        <div style={{display:'flex', flexDirection:'column', gap:16}}>
          <ActiveClaimCard onReview={onReview} onAsk={onAsk} />
          <button onClick={()=>onNav('claim')} style={{display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', height:52, borderRadius:'var(--radius-sm)', border:'1.5px dashed var(--aayu-teal-400)', background:'var(--aayu-surface-card)', color:'var(--aayu-teal-600)', fontFamily:'var(--font-sans)', fontSize:16, fontWeight:500, cursor:'pointer'}}>
            <i data-lucide="file-plus-2" style={{width:20, height:20}}></i> Fight a new claim
          </button>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:16, marginTop: wide ? 0 : 4}}>
          <div>
            <SectionLabel>Quick access</SectionLabel>
            <div style={{display:'flex', gap:12}}>
              <QuickTile icon="heart-pulse" value="12" title="Health records" sub="conditions · meds" onClick={()=>onNav('health')} />
              <QuickTile icon="landmark" value="₹5L" title="Scheme cover" sub="1 match found" onClick={()=>onNav('schemes')} />
            </div>
          </div>
          <div>
            <SectionLabel>Recent activity</SectionLabel>
            <div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--aayu-surface-card)'}}>
              {activity.map((a,i) => <ListRow key={i} {...a} />)}
            </div>
          </div>
        </div>
      </div>
      <TrustBadge icon="shield-check">Your data is encrypted · Pay only if we win</TrustBadge>
    </div>
  );
}
window.HomeScreen = HomeScreen;
