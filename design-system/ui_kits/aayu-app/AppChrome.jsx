const { Button, TrustBadge, StatusChip, MetricCard, PatientSelector, ListRow } = window.AayuDesignSystem_84693d;

const NAV = [
  {id:'home', label:'Home', icon:'house'},
  {id:'health', label:'Health', icon:'heart-pulse'},
  {id:'claim', label:'Claim', icon:'file-plus-2', primary:true},
  {id:'schemes', label:'Schemes', icon:'landmark'},
  {id:'profile', label:'Profile', icon:'circle-user'},
];

function TabBar({active, onNav}) {
  return (
    <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-around', borderTop:'0.5px solid var(--aayu-border)', background:'var(--aayu-surface-card)', padding:'8px 6px 10px'}}>
      {NAV.map(n => {
        if (n.primary) {
          return (
            <button key={n.id} onClick={()=>onNav(n.id)} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4, border:'none', background:'none', cursor:'pointer', transform:'translateY(-8px)'}}>
              <span style={{width:52, height:52, borderRadius:'50%', background:'var(--aayu-teal-600)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--elevation-1)'}}>
                <i data-lucide={n.icon} style={{width:24, height:24, color:'#fff'}}></i>
              </span>
              <span style={{fontSize:11, color:'var(--aayu-text-secondary)', fontWeight:500}}>{n.label}</span>
            </button>
          );
        }
        const on = active === n.id;
        return (
          <button key={n.id} onClick={()=>onNav(n.id)} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4, border:'none', background:'none', cursor:'pointer', padding:'4px 8px'}}>
            <i data-lucide={n.icon} style={{width:22, height:22, color: on ? 'var(--aayu-teal-600)' : 'var(--aayu-text-muted)'}}></i>
            <span style={{fontSize:11, fontWeight:500, color: on ? 'var(--aayu-teal-600)' : 'var(--aayu-text-muted)'}}>{n.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Sidebar({active, onNav}) {
  return (
    <div style={{width:240, flexShrink:0, background:'var(--aayu-surface-card)', borderRight:'0.5px solid var(--aayu-border)', display:'flex', flexDirection:'column', padding:'24px 16px'}}>
      <div style={{fontSize:26, fontWeight:500, color:'var(--aayu-teal-600)', padding:'0 12px 24px'}}>Aayu</div>
      <div style={{display:'flex', flexDirection:'column', gap:4}}>
        {NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={()=>onNav(n.id)} style={{display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer', textAlign:'left', background: on ? 'var(--aayu-success-bg)' : 'transparent', color: on ? 'var(--aayu-teal-800)' : 'var(--aayu-text-secondary)', fontFamily:'var(--font-sans)', fontSize:15, fontWeight:500}}>
              <i data-lucide={n.icon} style={{width:20, height:20, color: on ? 'var(--aayu-teal-600)' : 'var(--aayu-text-muted)'}}></i>
              {n.label}
            </button>
          );
        })}
      </div>
      <div style={{flex:1}}></div>
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'12px', borderTop:'0.5px solid var(--aayu-border)'}}>
        <span style={{width:32, height:32, borderRadius:'50%', background:'var(--aayu-teal-100)', color:'var(--aayu-teal-900)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:500, fontSize:13}}>P</span>
        <div><div style={{fontSize:14, fontWeight:500, color:'var(--aayu-text-primary)'}}>Priya Iyer</div><div style={{fontSize:12, color:'var(--aayu-text-muted)'}}>Caregiver</div></div>
      </div>
    </div>
  );
}

// AppChrome: wide=false → phone (content scrolls, bottom tab bar); wide=true → sidebar + centered content
function AppChrome({active, onNav, wide, children}) {
  if (wide) {
    return (
      <div style={{display:'flex', height:'100%', background:'var(--aayu-surface-page)', fontFamily:'var(--font-sans)'}}>
        <Sidebar active={active} onNav={onNav} />
        <div style={{flex:1, overflowY:'auto'}}>
          <div style={{maxWidth:720, margin:'0 auto', padding:'32px 32px 64px'}}>{children}</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{display:'flex', flexDirection:'column', height:'100%', background:'var(--aayu-surface-page)', fontFamily:'var(--font-sans)'}}>
      <div style={{flex:1, overflowY:'auto'}}>{children}</div>
      <TabBar active={active} onNav={onNav} />
    </div>
  );
}
window.AayuNav = NAV;
window.AppChrome = AppChrome;
