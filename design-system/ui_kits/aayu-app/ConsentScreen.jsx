const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function ConsentScreen({onAgree, onClose}) {
  return (
    <div style={{display:'flex', alignItems:'flex-end', justifyContent:'center', background:'rgba(4,44,44,0.35)', minHeight:520, padding:16}}>
      <div style={{width:'100%', maxWidth:420, background:'var(--aayu-surface-card)', borderRadius:'16px 16px 0 0', boxShadow:'var(--elevation-2)', padding:'24px 20px', display:'flex', flexDirection:'column', gap:14}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontSize:18, fontWeight:500, color:'var(--aayu-text-primary)'}}>Before we start</div>
          <button onClick={onClose} style={{border:'none', background:'none', cursor:'pointer', color:'var(--aayu-text-muted)'}}><i data-lucide="x" style={{width:20, height:20}}></i></button>
        </div>
        <div style={{fontSize:16, lineHeight:1.7, color:'var(--aayu-text-secondary)'}}>
          We'll read the documents you upload — your rejection letter, policy, and bills — to build Appa's assessment and appeal. Nothing is shared with the insurer without your say.
        </div>
        <TrustBadge icon="lock">Your data is encrypted</TrustBadge>
        <Button variant="primary" onClick={onAgree} style={{width:'100%', marginTop:6}}>I agree, continue</Button>
      </div>
    </div>
  );
}

window.ConsentScreen = ConsentScreen;
