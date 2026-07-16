const { Button, StatusChip, TrustBadge, MetricCard } = window.AayuDesignSystem_84693d;

function Skel({w='100%', h=14, r=6, mt=0}) {
  return <div style={{width:w, height:h, borderRadius:r, marginTop:mt, background:'linear-gradient(90deg,var(--aayu-surface-muted) 25%,#EAE8E0 50%,var(--aayu-surface-muted) 75%)', backgroundSize:'200% 100%', animation:'aayuShimmer 1.3s ease-in-out infinite'}}></div>;
}
function Wrap({children}) {
  return <div style={{padding:'22px 18px', minHeight:'100%', background:'var(--aayu-surface-page)', fontFamily:'var(--font-sans)', display:'flex', flexDirection:'column', gap:16}}><style>{'@keyframes aayuShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}'}</style>{children}</div>;
}
function Center({children}) {
  return <div style={{minHeight:'100%', background:'var(--aayu-surface-page)', fontFamily:'var(--font-sans)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:'40px 28px', textAlign:'center'}}>{children}</div>;
}
function Icn({name, tone='teal'}) {
  const bg = tone==='danger'?'var(--aayu-danger-bg)':tone==='attention'?'var(--aayu-attention-bg)':'var(--aayu-success-bg)';
  const fg = tone==='danger'?'var(--aayu-danger)':tone==='attention'?'var(--aayu-attention)':'var(--aayu-teal-600)';
  return <span style={{width:56, height:56, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center'}}><i data-lucide={name} style={{width:26, height:26, color:fg}}></i></span>;
}
function H(t){ return <div style={{fontSize:18, fontWeight:500, color:'var(--aayu-text-primary)'}}>{t}</div>; }
function P(t){ return <div style={{fontSize:14, color:'var(--aayu-text-secondary)', lineHeight:1.6, maxWidth:280}}>{t}</div>; }

// ---- HEALTH ----
function HealthEmpty(){ return <Center><Icn name="heart-pulse"/>{H("Appa's health record starts here")}{P('Upload a report or a claim to begin. Everything you add builds his lifelong record automatically.')}<Button variant="primary">Add a document</Button></Center>; }
function HealthLoading(){ return <Wrap><div style={{fontSize:20, fontWeight:500}}>Appa's health</div><Skel w="60%" h={12}/><div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', background:'var(--aayu-surface-card)', padding:14, display:'flex', flexDirection:'column', gap:16, marginTop:6}}>{[0,1,2].map(i=><div key={i} style={{display:'flex', gap:12, alignItems:'center'}}><Skel w={36} h={36} r={8}/><div style={{flex:1}}><Skel w="70%" h={13}/><Skel w="40%" h={11} mt={8}/></div></div>)}</div></Wrap>; }

// ---- SCHEMES ----
function SchemesEmpty(){ return <Center><Icn name="landmark" tone="attention"/>{H('No scheme match yet')}{P('We haven’t found a confident match for Appa’s profile. As you add more documents, new matches will appear here — nothing is ever hidden.')}<Button variant="secondary">Add more documents</Button></Center>; }
function SchemesLoading(){ return <Wrap><div style={{fontSize:20, fontWeight:500}}>Schemes</div><div style={{border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', background:'var(--aayu-surface-card)', padding:18, display:'flex', flexDirection:'column', gap:12}}><Skel w={40} h={40} r={8}/><Skel w="80%" h={16}/><Skel w="50%" h={13}/><Skel w="100%" h={12} mt={6}/><Skel w="90%" h={12}/></div><div style={{fontSize:13, color:'var(--aayu-text-muted)', textAlign:'center'}}>Checking curated schemes against Appa’s profile…</div></Wrap>; }

// ---- UPLOAD / CLAIM ----
function UploadEmpty(){ return <Center><Icn name="file-plus-2"/>{H('Upload your claim documents')}{P('Add the rejection letter, your policy, and hospital bills. Photos or PDFs both work.')}<Button variant="primary">Add photo or PDF</Button><div style={{marginTop:4}}><TrustBadge icon="lock">Pay only if we win</TrustBadge></div></Center>; }
function UploadError(){ return <Wrap><div style={{fontSize:20, fontWeight:500}}>Upload documents</div>
  <div style={{display:'flex', gap:10, alignItems:'flex-start', border:'0.5px solid var(--aayu-attention)', background:'var(--aayu-attention-bg)', borderRadius:'var(--radius-md)', padding:14}}><i data-lucide="image-off" style={{width:20, height:20, color:'var(--aayu-attention)', flexShrink:0, marginTop:2}}></i><div style={{flex:1}}><div style={{fontSize:14, fontWeight:500, color:'var(--aayu-text-primary)'}}>This photo’s a little blurry to read</div><div style={{fontSize:13, color:'var(--aayu-text-secondary)'}}>Retake it in good light and we’ll try again.</div><div style={{marginTop:8}}><Button variant="secondary">Retake photo</Button></div></div></div>
  <div style={{display:'flex', gap:10, alignItems:'flex-start', border:'0.5px solid var(--aayu-danger)', background:'var(--aayu-danger-bg)', borderRadius:'var(--radius-md)', padding:14}}><i data-lucide="file-x" style={{width:20, height:20, color:'var(--aayu-danger)', flexShrink:0, marginTop:2}}></i><div style={{flex:1}}><div style={{fontSize:14, fontWeight:500, color:'var(--aayu-text-primary)'}}>This doesn’t look like a medical document</div><div style={{fontSize:13, color:'var(--aayu-text-secondary)'}}>Please upload the rejection letter, policy, or a bill.</div></div></div>
</Wrap>; }

// ---- PROCESSING / APPEAL ERROR ----
function AppealError(){ return <Center><Icn name="triangle-alert" tone="danger"/>{H('We couldn’t finish this just now')}{P('Something interrupted the analysis — but nothing was lost. Try again and we’ll pick up where we stopped.')}<Button variant="primary">Try again</Button><Button variant="ghost">Contact support</Button></Center>; }

// ---- SUCCESS ----
function ClaimSuccess(){ return <Center><Icn name="circle-check"/><StatusChip tone="success">Appeal ready</StatusChip><div style={{fontSize:30, fontWeight:500, color:'var(--aayu-teal-600)'}}>₹18,400</div>{P('Your clause-cited appeal for Appa is drafted and ready to review before you send it.')}<Button variant="primary">Review appeal</Button></Center>; }

// ---- HOME EMPTY (first-time) ----
function HomeEmpty(){ return <Wrap><div><div style={{fontSize:22, fontWeight:500}}>Hi Priya</div><div style={{fontSize:13, color:'var(--aayu-text-secondary)'}}>Let’s get started.</div></div>
  <div style={{background:'var(--aayu-surface-card)', border:'0.5px solid var(--aayu-border)', borderRadius:'var(--radius-md)', padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:12, textAlign:'center'}}><Icn name="file-plus-2"/>{H('Fight your first claim')}{P('Upload a rejected claim and we’ll draft a clause-cited appeal — you only pay if we win.')}<Button variant="primary">Fight a claim</Button></div>
  <TrustBadge icon="shield-check">Your data is encrypted</TrustBadge></Wrap>; }

Object.assign(window, { AayuSkel:Skel, HealthEmpty, HealthLoading, SchemesEmpty, SchemesLoading, UploadEmpty, UploadError, AppealError, ClaimSuccess, HomeEmpty });
