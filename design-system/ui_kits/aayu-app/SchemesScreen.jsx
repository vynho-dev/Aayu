const { Button, StatusChip } = window.AayuDesignSystem_84693d;

function SchemesScreen({wide}) {
  return (
    <div style={{padding: wide ? 0 : '20px 16px', display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <div style={{fontSize: wide?26:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Schemes you may be owed</div>
        <div style={{fontSize:13, color:'var(--aayu-text-secondary)', marginTop:2}}>Matched to Appa's profile from the documents on file.</div>
      </div>

      <div style={{background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-teal-100)', borderRadius:'var(--radius-md)', overflow:'hidden'}}>
        <div style={{background:'var(--aayu-success-bg)', padding:'16px 18px', display:'flex', alignItems:'center', gap:12}}>
          <span style={{width:40, height:40, borderRadius:'var(--radius-sm)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}><i data-lucide="landmark" style={{width:22, height:22, color:'var(--aayu-teal-600)'}}></i></span>
          <div style={{flex:1}}>
            <div style={{fontSize:16, fontWeight:500, color:'var(--aayu-teal-900)'}}>Ayushman Bharat PM-JAY</div>
            <div style={{fontSize:12, color:'var(--aayu-teal-800)'}}>Government of India</div>
          </div>
          <StatusChip tone="success">Likely eligible</StatusChip>
        </div>
        <div style={{padding:'16px 18px', display:'flex', flexDirection:'column', gap:12}}>
          <div style={{fontSize:24, fontWeight:500, color:'var(--aayu-teal-600)'}}>Up to ₹5,00,000 <span style={{fontSize:14, fontWeight:400, color:'var(--aayu-text-secondary)'}}>/ family / year</span></div>
          <div style={{fontSize:14, lineHeight:1.6, color:'var(--aayu-text-secondary)'}}>Based on Appa's age and household profile, he may qualify for cashless secondary and tertiary care at empanelled hospitals.</div>
          <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
            <Button variant="primary">Check eligibility</Button>
            <Button variant="ghost">How this was matched</Button>
          </div>
        </div>
      </div>

      <div style={{display:'flex', alignItems:'center', gap:12, padding:'14px 16px', border:'0.5px dashed var(--aayu-border-strong)', borderRadius:'var(--radius-md)', background:'var(--aayu-surface-muted)'}}>
        <i data-lucide="search" style={{width:20, height:20, color:'var(--aayu-text-muted)'}}></i>
        <div style={{flex:1}}>
          <div style={{fontSize:14, fontWeight:500, color:'var(--aayu-text-primary)'}}>Still checking for more</div>
          <div style={{fontSize:13, color:'var(--aayu-text-secondary)'}}>We'll surface new matches as your Health record grows. No match is ever hidden.</div>
        </div>
      </div>
    </div>
  );
}
window.SchemesScreen = SchemesScreen;
