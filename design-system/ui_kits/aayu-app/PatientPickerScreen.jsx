const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function PatientPickerScreen({onNext}) {
  const [selected, setSelected] = React.useState('Appa');
  const patients = [{name:'Appa', relation:'Father', age:62}, {name:'Amma', relation:'Mother', age:58}];
  return (
    <div style={{padding:'24px 20px', display:'flex', flexDirection:'column', gap:20, minHeight:520, background:'var(--aayu-surface-page)'}}>
      <div>
        <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Who is this for?</div>
        <div style={{fontSize:14, color:'var(--aayu-text-secondary)', marginTop:4}}>Select a patient, or add someone new.</div>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {patients.map(p => <PatientSelector key={p.name} {...p} selected={selected===p.name} onClick={()=>setSelected(p.name)} />)}
      </div>
      <button style={{display:'flex', alignItems:'center', gap:10, padding:'14px', border:'1.5px dashed var(--aayu-border-strong)', borderRadius:'var(--radius-md)', background:'transparent', color:'var(--aayu-text-secondary)', cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:15}}>
        <i data-lucide="plus" style={{width:18, height:18}}></i> Add a patient
      </button>
      <div style={{flex:1}}></div>
      <Button variant="primary" onClick={onNext} style={{width:'100%'}}>Continue with {selected}</Button>
    </div>
  );
}

window.PatientPickerScreen = PatientPickerScreen;
