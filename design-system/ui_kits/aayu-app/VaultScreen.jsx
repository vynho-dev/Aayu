const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function VaultScreen({onClose}) {
  const conditions = [{icon:'heart-pulse', title:'Type 2 diabetes', subtitle:'Diagnosed 2022'}, {icon:'activity', title:'Hypertension', subtitle:'Diagnosed 2021'}];
  const meds = [{icon:'pill', title:'Metformin 500mg', subtitle:'Since Mar 2024'}, {icon:'pill', title:'Amlodipine 5mg', subtitle:'Since Jan 2023'}];
  return (
    <div style={{minHeight:520, background:'var(--aayu-surface-page)'}}>
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'16px 20px', borderBottom:'0.5px solid var(--aayu-border)', background:'var(--aayu-surface-card)'}}>
        <button onClick={onClose} aria-label="Go back" style={{border:'none', background:'none', cursor:'pointer', color:'var(--aayu-text-secondary)'}}><i data-lucide="arrow-left" style={{width:20, height:20}} aria-hidden="true"></i></button>
        <div style={{fontSize:16, fontWeight:500, color:'var(--aayu-text-primary)'}}>Appa's Vault</div>
      </div>
      <div style={{padding:20, display:'flex', flexDirection:'column', gap:20}}>
        <div>
          <div style={{fontSize:13, fontWeight:500, color:'var(--aayu-text-muted)', marginBottom:8}}>CONDITIONS</div>
          <div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', overflow:'hidden'}}>
            {conditions.map((c,i) => <ListRow key={i} {...c} />)}
          </div>
        </div>
        <div>
          <div style={{fontSize:13, fontWeight:500, color:'var(--aayu-text-muted)', marginBottom:8}}>MEDICATIONS</div>
          <div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', overflow:'hidden'}}>
            {meds.map((m,i) => <ListRow key={i} {...m} />)}
          </div>
        </div>
        <div style={{background:'var(--aayu-success-bg)', borderRadius:'var(--radius-md)', padding:16, display:'flex', gap:12, alignItems:'flex-start'}}>
          <i data-lucide="badge-indian-rupee" style={{width:22, height:22, color:'var(--aayu-teal-600)', flexShrink:0, marginTop:2}}></i>
          <div>
            <div style={{fontSize:15, fontWeight:500, color:'var(--aayu-teal-900)'}}>Ayushman Bharat PM-JAY</div>
            <div style={{fontSize:13, color:'var(--aayu-teal-800)', marginTop:2}}>Based on Appa's profile, he may be eligible for coverage up to ₹5,00,000/year.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.VaultScreen = VaultScreen;
