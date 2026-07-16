const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function AuthScreen({onAuth}) {
  const [mode, setMode] = React.useState('signup');
  return (
    <div style={{minHeight:520, background:'var(--aayu-surface-page)', display:'flex', flexDirection:'column', gap:20, padding:'32px 20px'}}>
      <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>{mode==='signup' ? 'Create your account' : 'Log in'}</div>
      <Input label="Email" placeholder="you@email.com" type="email" />
      <Input label="Password" placeholder="••••••••" type="password" />
      <Button variant="primary" onClick={onAuth} style={{width:'100%'}}>{mode==='signup' ? 'Sign up' : 'Log in'}</Button>
      <button onClick={()=>setMode(mode==='signup'?'login':'signup')} style={{border:'none', background:'none', color:'var(--aayu-teal-600)', fontSize:14, cursor:'pointer', fontFamily:'var(--font-sans)'}}>
        {mode==='signup' ? 'Already have an account? Log in' : "New here? Sign up"}
      </button>
    </div>
  );
}

window.AuthScreen = AuthScreen;
