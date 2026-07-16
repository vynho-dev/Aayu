const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function ProcessingScreen() {
  const steps = ['Reading the policy…', 'Finding the clause…', 'Drafting your appeal…'];
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(()=>setI(v => Math.min(v+1, steps.length-1)), 1200); return ()=>clearInterval(t); }, []);
  return (
    <div style={{minHeight:520, background:'var(--aayu-surface-page)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:20}}>
      <div style={{width:56, height:56, borderRadius:'50%', border:'3px solid var(--aayu-teal-100)', borderTopColor:'var(--aayu-teal-600)', animation:'spin 1s linear infinite'}}></div>
      <div style={{fontSize:17, fontWeight:500, color:'var(--aayu-text-primary)'}}>{steps[i]}</div>
      <div style={{fontSize:13, color:'var(--aayu-text-muted)', textAlign:'center', maxWidth:260}}>This takes about a minute. Your documents are encrypted.</div>
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

window.ProcessingScreen = ProcessingScreen;
