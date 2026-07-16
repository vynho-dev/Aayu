const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function LandingScreen({onStart}) {
  return (
    <div style={{minHeight:520, background:'var(--aayu-teal-600)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:32, textAlign:'center'}}>
      <div style={{fontSize:38, fontWeight:500, color:'#fff'}}>Aayu</div>
      <div style={{fontSize:17, color:'var(--aayu-teal-50)', maxWidth:280, lineHeight:1.6}}>Your family's health, working for you.</div>
      <div style={{fontSize:14, color:'var(--aayu-teal-100)', maxWidth:300, lineHeight:1.6, marginTop:8}}>Fight a wrongly rejected insurance claim, build a lifelong health record, and find benefits you're owed — from one upload.</div>
      <Button variant="primary" onClick={onStart} style={{background:'#fff', color:'var(--aayu-teal-700)', marginTop:12}}>Get started</Button>
      <div style={{marginTop:10}}><TrustBadge icon="shield-check">Pay only if we win</TrustBadge></div>
    </div>
  );
}

window.LandingScreen = LandingScreen;
