const { Button, TrustBadge, StatusChip, MetricCard, Input, PatientSelector, UploadDropzone, AssessmentCard, LetterCard, ListRow, BottomSheet } = window.AayuDesignSystem_84693d;

function ClaimResultScreen({onOpenQA, onOpenVault}) {
  const [amount, setAmount] = React.useState(0);
  React.useEffect(() => {
    let start;
    const target = 18400;
    const dur = 800;
    function tick(ts){ if(!start) start=ts; const p = Math.min((ts-start)/dur, 1); setAmount(Math.round(target*p)); if(p<1) requestAnimationFrame(tick); }
    requestAnimationFrame(tick);
  }, []);
  return (
    <div style={{padding:'24px 20px', display:'flex', flexDirection:'column', gap:18, minHeight:520, background:'var(--aayu-surface-page)'}}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <i data-lucide="lock" style={{width:14, height:14, color:'var(--aayu-teal-600)'}}></i>
        <span style={{fontSize:12, color:'var(--aayu-text-muted)'}}>Encrypted · Appa's claim</span>
      </div>
      <div>
        <StatusChip tone="attention">Contestable denial</StatusChip>
        <div style={{fontSize:30, fontWeight:500, color:'var(--aayu-teal-600)', marginTop:10}}>₹{amount.toLocaleString('en-IN')} recoverable</div>
        <div style={{fontSize:14, color:'var(--aayu-text-secondary)', marginTop:4}}>We found the clause the insurer missed.</div>
      </div>
      <div style={{display:'flex', gap:10}}>
        <MetricCard label="Documents read" value="3" />
        <MetricCard label="Clause cited" value="Sec. 4.2" />
      </div>
      <AssessmentCard icon="file-search" title="Likely reason for denial">
        The insurer cited a pre-existing condition exclusion that doesn't apply — the policy excludes it only after 12 months, and this policy is 14 months old.
      </AssessmentCard>
      <LetterCard
        title="Appeal letter"
        editable
        preview={"To the Claims Review Officer,\n\nI am writing to formally appeal the denial of claim #A4471 for Mr. Rajan Iyer. The rejection cited a pre-existing condition exclusion; however, per Section 4.2 of the policy, this exclusion lapses after 12 months of continuous cover. This policy has been active for 14 months.\n\nI request a full review and reversal of the denied amount of ₹18,400."}
        onDownload={()=>{}}
      />
      <div style={{display:'flex', gap:10}}>
        <Button variant="secondary" onClick={onOpenQA} style={{flex:1}}>Ask about my policy</Button>
        <Button variant="ghost" onClick={onOpenVault} style={{flex:1}}>View Vault</Button>
      </div>
    </div>
  );
}

window.ClaimResultScreen = ClaimResultScreen;
