const { MetricCard, ListRow, StatusChip } = window.AayuDesignSystem_84693d;

function SL({children}) {
  return <div style={{fontSize:12, fontWeight:500, letterSpacing:'0.04em', color:'var(--aayu-text-muted)', textTransform:'uppercase', margin:'4px 0 10px'}}>{children}</div>;
}

function HealthScreen({wide}) {
  const conditions = [{icon:'heart-pulse', title:'Type 2 diabetes', subtitle:'Diagnosed 2022'}, {icon:'activity', title:'Hypertension', subtitle:'Diagnosed 2021'}];
  const meds = [{icon:'pill', title:'Metformin 500mg', subtitle:'Twice daily · since Mar 2024'}, {icon:'pill', title:'Amlodipine 5mg', subtitle:'Once daily · since Jan 2023'}];
  const allergies = [{icon:'triangle-alert', title:'Penicillin', subtitle:'Reaction: rash'}];
  const timeline = [
    {date:'12 Jun 2026', title:'Hospitalization — Apollo, Chennai', body:'Cardiac observation, 4 nights. Discharge summary on file.'},
    {date:'12 Jun 2026', title:'Claim rejected by insurer', body:'Cited pre-existing condition clause.'},
    {date:'02 Jan 2023', title:'Started Amlodipine', body:'Prescribed for hypertension.'},
  ];
  const Section = ({label, rows}) => (
    <div><SL>{label}</SL><div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', overflow:'hidden', background:'var(--aayu-surface-card)'}}>{rows.map((r,i)=><ListRow key={i} {...r} />)}</div></div>
  );
  return (
    <div style={{padding: wide ? 0 : '20px 16px', display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <div style={{fontSize: wide?26:22, fontWeight:500, color:'var(--aayu-text-primary)'}}>Appa's health</div>
        <div style={{fontSize:13, color:'var(--aayu-text-secondary)', marginTop:2}}>Built automatically from the documents you upload.</div>
      </div>
      <div style={{display:'flex', gap:12}}>
        <MetricCard label="Conditions" value="2" />
        <MetricCard label="Medications" value="2" />
        <MetricCard label="Allergies" value="1" />
      </div>
      <Section label="Conditions" rows={conditions} />
      <Section label="Medications" rows={meds} />
      <Section label="Allergies" rows={allergies} />
      <div>
        <SL>Timeline</SL>
        <div style={{display:'flex', flexDirection:'column', gap:0, paddingLeft:6}}>
          {timeline.map((t,i) => (
            <div key={i} style={{display:'flex', gap:14}}>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <span style={{width:10, height:10, borderRadius:'50%', background:'var(--aayu-teal-600)', marginTop:5}}></span>
                {i < timeline.length-1 && <span style={{width:2, flex:1, background:'var(--aayu-border-strong)'}}></span>}
              </div>
              <div style={{paddingBottom:18}}>
                <div style={{fontSize:12, color:'var(--aayu-text-muted)'}}>{t.date}</div>
                <div style={{fontSize:15, fontWeight:500, color:'var(--aayu-text-primary)', marginTop:2}}>{t.title}</div>
                <div style={{fontSize:13, color:'var(--aayu-text-secondary)', marginTop:2, lineHeight:1.5}}>{t.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
window.HealthScreen = HealthScreen;
