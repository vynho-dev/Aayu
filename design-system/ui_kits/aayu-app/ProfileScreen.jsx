const { PatientSelector, ListRow, TrustBadge } = window.AayuDesignSystem_84693d;

function SL({children}) {
  return <div style={{fontSize:12, fontWeight:500, letterSpacing:'0.04em', color:'var(--aayu-text-muted)', textTransform:'uppercase', margin:'4px 0 10px'}}>{children}</div>;
}

function ProfileScreen({wide}) {
  return (
    <div style={{padding: wide ? 0 : '20px 16px', display:'flex', flexDirection:'column', gap:20}}>
      <div style={{fontSize: wide?26:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Profile</div>

      <div style={{display:'flex', alignItems:'center', gap:14, background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', padding:'var(--space-4)'}}>
        <span style={{width:48, height:48, borderRadius:'50%', background:'var(--aayu-teal-100)', color:'var(--aayu-teal-900)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:500, fontSize:18}}>P</span>
        <div>
          <div style={{fontSize:17, fontWeight:500, color:'var(--aayu-text-primary)'}}>Priya Iyer</div>
          <div style={{fontSize:13, color:'var(--aayu-text-secondary)'}}>priya@email.com · Caregiver</div>
        </div>
      </div>

      <div>
        <SL>Patients you manage</SL>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          <PatientSelector name="Appa" relation="Father" age={62} selected />
          <PatientSelector name="Amma" relation="Mother" age={58} />
        </div>
      </div>

      <div>
        <SL>Settings</SL>
        <div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--aayu-surface-card)'}}>
          <ListRow icon="shield-check" title="Security & encryption" subtitle="Your documents are encrypted" />
          <ListRow icon="file-lock-2" title="Data & consent" subtitle="Review or withdraw consent" />
          <ListRow icon="circle-help" title="Help & support" />
          <ListRow icon="log-out" title="Log out" />
        </div>
      </div>

      <TrustBadge icon="lock">DPDP-compliant · you can delete your data anytime</TrustBadge>
    </div>
  );
}
window.ProfileScreen = ProfileScreen;
