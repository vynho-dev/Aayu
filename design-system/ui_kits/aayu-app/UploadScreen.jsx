const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function UploadScreen({onNext}) {
  const [files, setFiles] = React.useState([
    {name:'rejection-letter.pdf', status:'done'},
    {name:'policy.pdf', status:'done'},
  ]);
  const addFile = () => setFiles(f => [...f, {name:'discharge-summary.jpg', status:'reading'}]);
  return (
    <div style={{padding:'24px 20px', display:'flex', flexDirection:'column', gap:16, minHeight:520, background:'var(--aayu-surface-page)'}}>
      <div>
        <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Upload your documents</div>
        <div style={{fontSize:14, color:'var(--aayu-text-secondary)', marginTop:4}}>Rejection letter, policy, and hospital bills for Appa.</div>
      </div>
      <TrustBadge icon="lock">Pay only if we win</TrustBadge>
      <label style={{border:'1.5px dashed var(--aayu-border-strong)', borderRadius:'var(--radius-md)', background:'var(--aayu-surface-muted)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, padding:'32px 16px', cursor:'pointer'}} onClick={addFile}>
        <i data-lucide="upload" style={{width:28, height:28, color:'var(--aayu-teal-600)'}}></i>
        <div style={{fontSize:15, fontWeight:500, color:'var(--aayu-text-primary)'}}>Add photo or PDF</div>
      </label>
      <div style={{display:'flex', flexDirection:'column', gap:8}}>
        {files.map((f,i) => (
          <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-sm)', background:'var(--aayu-surface-card)'}}>
            <i data-lucide="file-text" style={{width:18, height:18, color:'var(--aayu-text-secondary)'}}></i>
            <div style={{flex:1, fontSize:14, color:'var(--aayu-text-primary)'}}>{f.name}</div>
            <span style={{fontSize:12, color: f.status==='done' ? 'var(--aayu-success)' : 'var(--aayu-text-muted)'}}>{f.status}</span>
          </div>
        ))}
      </div>
      <div style={{fontSize:13, color:'var(--aayu-text-muted)'}}>This takes about a minute. Your documents are encrypted.</div>
      <div style={{flex:1}}></div>
      <Button variant="primary" onClick={onNext} style={{width:'100%'}}>Analyze documents</Button>
    </div>
  );
}

window.UploadScreen = UploadScreen;
