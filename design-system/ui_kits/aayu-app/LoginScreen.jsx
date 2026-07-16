const { Input, Button, TrustBadge } = window.AayuDesignSystem_84693d;

function LoginScreen({wide, mode='login', onAuth}) {
  const [m, setM] = React.useState(mode);
  const signup = m === 'signup';
  return (
    <div style={{minHeight:520, background:'var(--aayu-surface-page)', display:'flex', flexDirection:'column', padding: wide ? '48px 0' : '40px 20px', alignItems:'center'}}>
      <div style={{width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:20}}>
        <div style={{fontSize:28, fontWeight:500, color:'var(--aayu-teal-600)', textAlign:'center', marginBottom:4}}>Aayu</div>
        <div>
          <div style={{fontSize:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>{signup ? 'Create your account' : 'Welcome back'}</div>
          <div style={{fontSize:14, color:'var(--aayu-text-secondary)', marginTop:2}}>{signup ? "Let's get your family's claim moving." : 'Log in to pick up where you left off.'}</div>
        </div>
        <Input label="Email" placeholder="you@email.com" type="email" />
        <Input label="Password" placeholder="••••••••" type="password" />
        <Button variant="primary" onClick={onAuth} style={{width:'100%'}}>{signup ? 'Sign up' : 'Log in'}</Button>
        <button onClick={()=>setM(signup?'login':'signup')} style={{border:'none', background:'none', color:'var(--aayu-teal-600)', fontSize:14, cursor:'pointer', fontFamily:'var(--font-sans)'}}>
          {signup ? 'Already have an account? Log in' : 'New here? Create an account'}
        </button>
        <div style={{display:'flex', justifyContent:'center', marginTop:4}}><TrustBadge icon="lock">Your data is encrypted</TrustBadge></div>
      </div>
    </div>
  );
}
window.LoginScreen = LoginScreen;
