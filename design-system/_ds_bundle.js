/* @ds-bundle: {"format":4,"namespace":"AayuDesignSystem_84693d","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"MetricCard","sourcePath":"components/core/MetricCard.jsx"},{"name":"StatusChip","sourcePath":"components/core/StatusChip.jsx"},{"name":"TrustBadge","sourcePath":"components/core/TrustBadge.jsx"},{"name":"AssessmentCard","sourcePath":"components/feedback/AssessmentCard.jsx"},{"name":"LetterCard","sourcePath":"components/feedback/LetterCard.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"PatientSelector","sourcePath":"components/forms/PatientSelector.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"UploadDropzone","sourcePath":"components/forms/UploadDropzone.jsx"},{"name":"BottomSheet","sourcePath":"components/navigation/BottomSheet.jsx"},{"name":"ListRow","sourcePath":"components/navigation/ListRow.jsx"}],"sourceHashes":{"components/core/Button.jsx":"fd1844520f2f","components/core/MetricCard.jsx":"a54257cceb2d","components/core/StatusChip.jsx":"a95255e37642","components/core/TrustBadge.jsx":"8e19a151a986","components/feedback/AssessmentCard.jsx":"e7b7397ea344","components/feedback/LetterCard.jsx":"436cd92d98a1","components/forms/Input.jsx":"da7aeb42e3ca","components/forms/PatientSelector.jsx":"fe21a0fb06ec","components/forms/Select.jsx":"f8e82c32bcb0","components/forms/UploadDropzone.jsx":"86e398b213c0","components/navigation/BottomSheet.jsx":"b73d834b0309","components/navigation/ListRow.jsx":"c7961ae36b39","ui_kits/aayu-app/AppChrome.jsx":"6d62f1e38205","ui_kits/aayu-app/AuthScreen.jsx":"b86ab6c2a6c1","ui_kits/aayu-app/ClaimResultScreen.jsx":"3fc33dd016fc","ui_kits/aayu-app/ConsentScreen.jsx":"bc670b817872","ui_kits/aayu-app/ConsentScreenFull.jsx":"f53f666c5ae4","ui_kits/aayu-app/HealthScreen.jsx":"e8b5e8b2bad2","ui_kits/aayu-app/HomeScreen.jsx":"224b37033b29","ui_kits/aayu-app/LandingScreen.jsx":"30841d63da0c","ui_kits/aayu-app/LoginScreen.jsx":"5730d93d2a1e","ui_kits/aayu-app/PatientPickerScreen.jsx":"0c8026e1c33e","ui_kits/aayu-app/PolicyQAScreen.jsx":"98fbfed4f147","ui_kits/aayu-app/ProcessingScreen.jsx":"26dcfcaf2d3b","ui_kits/aayu-app/ProfileScreen.jsx":"73157de27357","ui_kits/aayu-app/SchemesScreen.jsx":"744e4f88cfc0","ui_kits/aayu-app/StateScreens.jsx":"28d2784555e9","ui_kits/aayu-app/UploadScreen.jsx":"7cb680b6d44e","ui_kits/aayu-app/VaultScreen.jsx":"c4cee005e86b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AayuDesignSystem_84693d = window.AayuDesignSystem_84693d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  style
}) {
  const base = {
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    fontWeight: 500,
    height: 'var(--tap-target)',
    padding: '0 20px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    opacity: disabled ? 0.5 : 1
  };
  const variants = {
    primary: {
      background: 'var(--aayu-teal-600)',
      color: '#fff'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--aayu-text-primary)',
      border: '1px solid var(--aayu-border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--aayu-teal-600)'
    }
  };
  return React.createElement('button', {
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    disabled: disabled || loading,
    onClick,
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.98)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, loading ? 'Working…' : children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/MetricCard.jsx
try { (() => {
function MetricCard({
  label,
  value,
  tone = 'ink'
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontFamily: 'var(--font-sans)',
      minWidth: 140
    }
  }, React.createElement('div', {
    style: {
      fontSize: 'var(--text-caption-size)',
      color: 'var(--aayu-text-muted)',
      fontWeight: 500
    }
  }, label), React.createElement('div', {
    style: {
      fontSize: 24,
      fontWeight: 500,
      color: tone === 'teal' ? 'var(--aayu-teal-600)' : 'var(--aayu-ink-900)'
    }
  }, value));
}
Object.assign(__ds_scope, { MetricCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MetricCard.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusChip.jsx
try { (() => {
const tones = {
  success: {
    bg: 'var(--aayu-success-bg)',
    fg: 'var(--aayu-success)',
    icon: 'check'
  },
  attention: {
    bg: 'var(--aayu-attention-bg)',
    fg: 'var(--aayu-attention)',
    icon: 'clock'
  },
  neutral: {
    bg: 'var(--aayu-surface-muted)',
    fg: 'var(--aayu-text-secondary)',
    icon: 'circle'
  }
};
function StatusChip({
  tone = 'neutral',
  children
}) {
  const t = tones[tone];
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: t.bg,
      color: t.fg,
      borderRadius: 'var(--radius-pill)',
      padding: '4px 10px',
      fontSize: 'var(--text-label-size)',
      fontWeight: 500,
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('i', {
    'data-lucide': t.icon,
    style: {
      width: 12,
      height: 12
    }
  }), children);
}
Object.assign(__ds_scope, { StatusChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusChip.jsx", error: String((e && e.message) || e) }); }

// components/core/TrustBadge.jsx
try { (() => {
function TrustBadge({
  icon = 'shield-check',
  children
}) {
  return React.createElement('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: 'var(--aayu-success-bg)',
      color: 'var(--aayu-teal-900)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 12px',
      fontSize: 'var(--text-caption-size)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500
    }
  }, React.createElement('i', {
    'data-lucide': icon,
    style: {
      width: 14,
      height: 14
    }
  }), children);
}
Object.assign(__ds_scope, { TrustBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/TrustBadge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AssessmentCard.jsx
try { (() => {
function AssessmentCard({
  icon = 'file-search',
  title,
  children
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: 14,
      padding: 'var(--space-4)',
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--aayu-success-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement('i', {
    'data-lucide': icon,
    style: {
      width: 18,
      height: 18,
      color: 'var(--aayu-teal-600)'
    }
  })), React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)',
      marginBottom: 4
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 'var(--text-body-sm-size)',
      lineHeight: 'var(--text-body-sm-lh)',
      color: 'var(--aayu-text-secondary)'
    }
  }, children)));
}
Object.assign(__ds_scope, { AssessmentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AssessmentCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LetterCard.jsx
try { (() => {
const {
  useState
} = React;
function LetterCard({
  title,
  preview,
  editable = false,
  onDownload
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(typeof preview === 'string' ? preview : '');
  const body = editing ? React.createElement('textarea', {
    value: text,
    onChange: e => setText(e.target.value),
    autoFocus: true,
    style: {
      width: '100%',
      minHeight: 140,
      resize: 'vertical',
      border: '1px solid var(--aayu-border-strong)',
      borderRadius: 'var(--radius-sm)',
      padding: 12,
      fontSize: 'var(--text-body-sm-size)',
      lineHeight: 'var(--text-body-sm-lh)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--aayu-text-primary)',
      outline: 'none'
    }
  }) : React.createElement('div', {
    style: {
      fontSize: 'var(--text-body-sm-size)',
      lineHeight: 'var(--text-body-sm-lh)',
      color: 'var(--aayu-text-secondary)',
      maxHeight: editable ? 200 : 120,
      overflow: 'hidden',
      whiteSpace: 'pre-wrap'
    }
  }, editing ? text : text || preview);
  return React.createElement('div', {
    style: {
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '0.5px solid var(--aayu-border)'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, title), React.createElement('span', {
    style: {
      fontSize: 'var(--text-label-size)',
      fontWeight: 500,
      background: 'var(--aayu-attention-bg)',
      color: 'var(--aayu-attention)',
      borderRadius: 'var(--radius-pill)',
      padding: '4px 10px'
    }
  }, 'Review before sending')), React.createElement('div', {
    style: {
      padding: 16
    }
  }, body), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 10,
      padding: '12px 16px',
      borderTop: '0.5px solid var(--aayu-border)'
    }
  }, React.createElement('button', {
    onClick: onDownload,
    style: {
      height: 36,
      padding: '0 14px',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      background: 'var(--aayu-teal-600)',
      color: '#fff',
      fontWeight: 500,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, 'Download PDF'), editable && React.createElement('button', {
    onClick: () => setEditing(e => !e),
    style: {
      height: 36,
      padding: '0 14px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--aayu-border-strong)',
      background: 'transparent',
      color: 'var(--aayu-text-primary)',
      fontWeight: 500,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, editing ? 'Done editing' : 'Edit letter')));
}
Object.assign(__ds_scope, { LetterCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LetterCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
const {
  useState,
  useId
} = React;
function Input({
  label,
  placeholder,
  error,
  value,
  onChange,
  type = 'text'
}) {
  const [touched, setTouched] = useState(false);
  const id = useId();
  const errId = id + '-err';
  const showError = touched && error;
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('label', {
    htmlFor: id,
    style: {
      fontSize: 'var(--text-caption-size)',
      color: 'var(--aayu-text-secondary)',
      fontWeight: 500
    }
  }, label), React.createElement('input', {
    id,
    type,
    placeholder,
    value,
    onChange,
    'aria-invalid': showError ? true : undefined,
    'aria-describedby': showError ? errId : undefined,
    onBlur: () => setTouched(true),
    style: {
      height: 'var(--tap-target)',
      borderRadius: 'var(--radius-sm)',
      border: showError ? '1px solid var(--aayu-danger)' : '1px solid var(--aayu-border-strong)',
      padding: '0 14px',
      fontSize: 16,
      fontFamily: 'var(--font-sans)',
      color: 'var(--aayu-text-primary)',
      background: 'var(--aayu-surface-card)'
    }
  }), showError && React.createElement('div', {
    id: errId,
    role: 'alert',
    style: {
      fontSize: 'var(--text-caption-size)',
      color: 'var(--aayu-danger)',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, React.createElement('i', {
    'data-lucide': 'alert-circle',
    style: {
      width: 13,
      height: 13
    },
    'aria-hidden': 'true'
  }), error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/PatientSelector.jsx
try { (() => {
function PatientSelector({
  name,
  relation,
  age,
  selected = false,
  onClick
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return React.createElement('button', {
    onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      textAlign: 'left',
      padding: 'var(--space-3) var(--space-4)',
      borderRadius: 'var(--radius-md)',
      border: selected ? '1.5px solid var(--aayu-teal-600)' : '0.5px solid var(--aayu-border)',
      background: selected ? 'var(--aayu-success-bg)' : 'var(--aayu-surface-card)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--aayu-teal-100)',
      color: 'var(--aayu-teal-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: 14,
      flexShrink: 0
    }
  }, initials), React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, name), React.createElement('div', {
    style: {
      fontSize: 'var(--text-caption-size)',
      color: 'var(--aayu-text-secondary)'
    }
  }, `${relation} · ${age}`)));
}
Object.assign(__ds_scope, { PatientSelector });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/PatientSelector.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useId
} = React;
function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select…'
}) {
  const id = useId();
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-sans)'
    }
  }, label && React.createElement('label', {
    htmlFor: id,
    style: {
      fontSize: 'var(--text-caption-size)',
      color: 'var(--aayu-text-secondary)',
      fontWeight: 500
    }
  }, label), React.createElement('div', {
    style: {
      position: 'relative'
    }
  }, React.createElement('select', {
    id,
    value,
    onChange,
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 'var(--tap-target)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--aayu-border-strong)',
      padding: '0 40px 0 14px',
      fontSize: 16,
      fontFamily: 'var(--font-sans)',
      color: value ? 'var(--aayu-text-primary)' : 'var(--aayu-text-muted)',
      background: 'var(--aayu-surface-card)',
      cursor: 'pointer'
    }
  }, !value && React.createElement('option', {
    value: '',
    disabled: true
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return React.createElement('option', {
      key: val,
      value: val
    }, lbl);
  })), React.createElement('i', {
    'data-lucide': 'chevron-down',
    'aria-hidden': 'true',
    style: {
      position: 'absolute',
      right: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 18,
      height: 18,
      color: 'var(--aayu-text-muted)',
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/UploadDropzone.jsx
try { (() => {
function UploadDropzone({
  files = [],
  onAdd
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('label', {
    style: {
      border: '1.5px dashed var(--aayu-border-strong)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--aayu-surface-muted)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '32px 16px',
      cursor: 'pointer'
    }
  }, React.createElement('i', {
    'data-lucide': 'upload',
    style: {
      width: 28,
      height: 28,
      color: 'var(--aayu-teal-600)'
    }
  }), React.createElement('div', {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, 'Add photo or PDF'), React.createElement('input', {
    type: 'file',
    multiple: true,
    style: {
      display: 'none'
    },
    onChange: onAdd
  })), files.length > 0 && React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, files.map((f, i) => React.createElement('div', {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--aayu-surface-card)'
    }
  }, React.createElement('i', {
    'data-lucide': 'file-text',
    style: {
      width: 18,
      height: 18,
      color: 'var(--aayu-text-secondary)'
    }
  }), React.createElement('div', {
    style: {
      flex: 1,
      fontSize: 14,
      color: 'var(--aayu-text-primary)'
    }
  }, f.name), React.createElement('span', {
    style: {
      fontSize: 12,
      color: f.status === 'done' ? 'var(--aayu-success)' : f.status === 'unreadable' ? 'var(--aayu-danger)' : 'var(--aayu-text-muted)'
    }
  }, f.status)))));
}
Object.assign(__ds_scope, { UploadDropzone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/UploadDropzone.jsx", error: String((e && e.message) || e) }); }

// components/navigation/BottomSheet.jsx
try { (() => {
const {
  useId
} = React;
function BottomSheet({
  title,
  children,
  onClose,
  primaryLabel = 'Continue',
  onPrimary
}) {
  const titleId = useId();
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      background: 'rgba(4,44,44,0.35)',
      padding: 16,
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': titleId,
    style: {
      width: '100%',
      maxWidth: 420,
      background: 'var(--aayu-surface-card)',
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      boxShadow: 'var(--elevation-2)',
      padding: 'var(--space-6) var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, React.createElement('div', {
    id: titleId,
    style: {
      fontSize: 18,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, title), onClose && React.createElement('button', {
    onClick: onClose,
    'aria-label': 'Close',
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--aayu-text-muted)'
    }
  }, React.createElement('i', {
    'data-lucide': 'x',
    'aria-hidden': 'true',
    style: {
      width: 20,
      height: 20
    }
  }))), React.createElement('div', {
    style: {
      fontSize: 'var(--text-body-size)',
      lineHeight: 'var(--text-body-lh)',
      color: 'var(--aayu-text-secondary)'
    }
  }, children), React.createElement('button', {
    onClick: onPrimary,
    style: {
      height: 'var(--tap-target)',
      borderRadius: 'var(--radius-sm)',
      border: 'none',
      background: 'var(--aayu-teal-600)',
      color: '#fff',
      fontWeight: 500,
      fontSize: 16,
      cursor: 'pointer',
      marginTop: 8
    }
  }, primaryLabel)));
}
Object.assign(__ds_scope, { BottomSheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/BottomSheet.jsx", error: String((e && e.message) || e) }); }

// components/navigation/ListRow.jsx
try { (() => {
function ListRow({
  icon = 'file-text',
  title,
  subtitle,
  onClick
}) {
  return React.createElement('button', {
    onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      width: '100%',
      textAlign: 'left',
      padding: '12px 16px',
      background: 'var(--aayu-surface-card)',
      border: 'none',
      borderBottom: '0.5px solid var(--aayu-border)',
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)'
    }
  }, React.createElement('div', {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--aayu-surface-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, React.createElement('i', {
    'data-lucide': icon,
    style: {
      width: 18,
      height: 18,
      color: 'var(--aayu-teal-600)'
    }
  })), React.createElement('div', {
    style: {
      flex: 1
    }
  }, React.createElement('div', {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, title), subtitle && React.createElement('div', {
    style: {
      fontSize: 'var(--text-caption-size)',
      color: 'var(--aayu-text-secondary)'
    }
  }, subtitle)), React.createElement('i', {
    'data-lucide': 'chevron-right',
    style: {
      width: 18,
      height: 18,
      color: 'var(--aayu-text-muted)'
    }
  }));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/ListRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/AppChrome.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  PatientSelector,
  ListRow
} = window.AayuDesignSystem_84693d;
const NAV = [{
  id: 'home',
  label: 'Home',
  icon: 'house'
}, {
  id: 'health',
  label: 'Health',
  icon: 'heart-pulse'
}, {
  id: 'claim',
  label: 'Claim',
  icon: 'file-plus-2',
  primary: true
}, {
  id: 'schemes',
  label: 'Schemes',
  icon: 'landmark'
}, {
  id: 'profile',
  label: 'Profile',
  icon: 'circle-user'
}];
function TabBar({
  active,
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      borderTop: '0.5px solid var(--aayu-border)',
      background: 'var(--aayu-surface-card)',
      padding: '8px 6px 10px'
    }
  }, NAV.map(n => {
    if (n.primary) {
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        onClick: () => onNav(n.id),
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          transform: 'translateY(-8px)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--aayu-teal-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--elevation-1)'
        }
      }, /*#__PURE__*/React.createElement("i", {
        "data-lucide": n.icon,
        style: {
          width: 24,
          height: 24,
          color: '#fff'
        }
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: 'var(--aayu-text-secondary)',
          fontWeight: 500
        }
      }, n.label));
    }
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNav(n.id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '4px 8px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": n.icon,
      style: {
        width: 22,
        height: 22,
        color: on ? 'var(--aayu-teal-600)' : 'var(--aayu-text-muted)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 500,
        color: on ? 'var(--aayu-teal-600)' : 'var(--aayu-text-muted)'
      }
    }, n.label));
  }));
}
function Sidebar({
  active,
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240,
      flexShrink: 0,
      background: 'var(--aayu-surface-card)',
      borderRight: '0.5px solid var(--aayu-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 500,
      color: 'var(--aayu-teal-600)',
      padding: '0 12px 24px'
    }
  }, "Aayu"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, NAV.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNav(n.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 12px',
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        background: on ? 'var(--aayu-success-bg)' : 'transparent',
        color: on ? 'var(--aayu-teal-800)' : 'var(--aayu-text-secondary)',
        fontFamily: 'var(--font-sans)',
        fontSize: 15,
        fontWeight: 500
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": n.icon,
      style: {
        width: 20,
        height: 20,
        color: on ? 'var(--aayu-teal-600)' : 'var(--aayu-text-muted)'
      }
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px',
      borderTop: '0.5px solid var(--aayu-border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      background: 'var(--aayu-teal-100)',
      color: 'var(--aayu-teal-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: 13
    }
  }, "P"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Priya Iyer"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--aayu-text-muted)'
    }
  }, "Caregiver"))));
}

// AppChrome: wide=false → phone (content scrolls, bottom tab bar); wide=true → sidebar + centered content
function AppChrome({
  active,
  onNav,
  wide,
  children
}) {
  if (wide) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: '100%',
        background: 'var(--aayu-surface-page)',
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(Sidebar, {
      active: active,
      onNav: onNav
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflowY: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 720,
        margin: '0 auto',
        padding: '32px 32px 64px'
      }
    }, children)));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--aayu-surface-page)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto'
    }
  }, children), /*#__PURE__*/React.createElement(TabBar, {
    active: active,
    onNav: onNav
  }));
}
window.AayuNav = NAV;
window.AppChrome = AppChrome;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/AppChrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/AuthScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function AuthScreen({
  onAuth
}) {
  const [mode, setMode] = React.useState('signup');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 520,
      background: 'var(--aayu-surface-page)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      padding: '32px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, mode === 'signup' ? 'Create your account' : 'Log in'), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    placeholder: "you@email.com",
    type: "email"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    type: "password"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onAuth,
    style: {
      width: '100%'
    }
  }, mode === 'signup' ? 'Sign up' : 'Log in'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMode(mode === 'signup' ? 'login' : 'signup'),
    style: {
      border: 'none',
      background: 'none',
      color: 'var(--aayu-teal-600)',
      fontSize: 14,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, mode === 'signup' ? 'Already have an account? Log in' : "New here? Sign up"));
}
window.AuthScreen = AuthScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/AuthScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/ClaimResultScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function ClaimResultScreen({
  onOpenQA,
  onOpenVault
}) {
  const [amount, setAmount] = React.useState(0);
  React.useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAmount(18400);
      return;
    }
    let start;
    const target = 18400;
    const dur = 800;
    function tick(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setAmount(Math.round(target * p));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      minHeight: 520,
      background: 'var(--aayu-surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "lock",
    style: {
      width: 14,
      height: 14,
      color: 'var(--aayu-teal-600)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--aayu-text-muted)'
    }
  }, "Encrypted \xB7 Appa's claim")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StatusChip, {
    tone: "attention"
  }, "Contestable denial"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 500,
      color: 'var(--aayu-teal-600)',
      marginTop: 10
    }
  }, "\u20B9", amount.toLocaleString('en-IN'), " recoverable"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)',
      marginTop: 4
    }
  }, "We found the clause the insurer missed.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Documents read",
    value: "3"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Clause cited",
    value: "Sec. 4.2"
  })), /*#__PURE__*/React.createElement(AssessmentCard, {
    icon: "file-search",
    title: "Likely reason for denial"
  }, "The insurer cited a pre-existing condition exclusion that doesn't apply \u2014 the policy excludes it only after 12 months, and this policy is 14 months old."), /*#__PURE__*/React.createElement(LetterCard, {
    title: "Appeal letter",
    editable: true,
    preview: "To the Claims Review Officer,\n\nI am writing to formally appeal the denial of claim #A4471 for Mr. Rajan Iyer. The rejection cited a pre-existing condition exclusion; however, per Section 4.2 of the policy, this exclusion lapses after 12 months of continuous cover. This policy has been active for 14 months.\n\nI request a full review and reversal of the denied amount of ₹18,400.",
    onDownload: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onOpenQA,
    style: {
      flex: 1
    }
  }, "Ask about my policy"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onOpenVault,
    style: {
      flex: 1
    }
  }, "View Vault")));
}
window.ClaimResultScreen = ClaimResultScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/ClaimResultScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/ConsentScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function ConsentScreen({
  onAgree,
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      background: 'rgba(4,44,44,0.35)',
      minHeight: 520,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 420,
      background: 'var(--aayu-surface-card)',
      borderRadius: '16px 16px 0 0',
      boxShadow: 'var(--elevation-2)',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Before we start"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--aayu-text-muted)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 20,
      height: 20
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--aayu-text-secondary)'
    }
  }, "We'll read the documents you upload \u2014 your rejection letter, policy, and bills \u2014 to build Appa's assessment and appeal. Nothing is shared with the insurer without your say."), /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "lock"
  }, "Your data is encrypted"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onAgree,
    style: {
      width: '100%',
      marginTop: 6
    }
  }, "I agree, continue")));
}
window.ConsentScreen = ConsentScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/ConsentScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/ConsentScreenFull.jsx
try { (() => {
const {
  Button,
  TrustBadge
} = window.AayuDesignSystem_84693d;
function ConsentScreenFull({
  wide,
  onAgree,
  onClose
}) {
  const [checked, setChecked] = React.useState(false);
  const points = [{
    icon: 'file-text',
    t: 'What we read',
    d: 'The documents you upload — rejection letter, policy, bills.'
  }, {
    icon: 'target',
    t: 'Why',
    d: 'To assess the denial, draft your appeal, and build Appa’s health record.'
  }, {
    icon: 'shield-check',
    t: 'How it’s protected',
    d: 'Encrypted at rest and in transit. Never shared without your say.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 520,
      background: 'var(--aayu-surface-page)',
      display: 'flex',
      flexDirection: 'column',
      padding: wide ? '40px 0' : '24px 20px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 420,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Before we start"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)',
      marginTop: 2
    }
  }, "Plain language, no fine print. You\u2019re in control.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, points.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: 'var(--aayu-success-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": p.icon,
    style: {
      width: 18,
      height: 18,
      color: 'var(--aayu-teal-600)'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, p.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)',
      lineHeight: 1.5
    }
  }, p.d))))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      cursor: 'pointer',
      padding: '4px 2px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: e => setChecked(e.target.checked),
    style: {
      width: 20,
      height: 20,
      marginTop: 2,
      accentColor: 'var(--aayu-teal-600)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-primary)',
      lineHeight: 1.5
    }
  }, "I consent to Aayu processing these documents to help with Appa\u2019s claim. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--aayu-teal-600)'
    }
  }, "Read the detail"))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onAgree,
    disabled: !checked,
    style: {
      width: '100%'
    }
  }, "I agree, continue"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "lock"
  }, "You can delete your data anytime"))));
}
window.ConsentScreenFull = ConsentScreenFull;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/ConsentScreenFull.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/HealthScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  MetricCard,
  ListRow,
  StatusChip
} = window.AayuDesignSystem_84693d;
function SL({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'var(--aayu-text-muted)',
      textTransform: 'uppercase',
      margin: '4px 0 10px'
    }
  }, children);
}
function HealthScreen({
  wide
}) {
  const conditions = [{
    icon: 'heart-pulse',
    title: 'Type 2 diabetes',
    subtitle: 'Diagnosed 2022'
  }, {
    icon: 'activity',
    title: 'Hypertension',
    subtitle: 'Diagnosed 2021'
  }];
  const meds = [{
    icon: 'pill',
    title: 'Metformin 500mg',
    subtitle: 'Twice daily · since Mar 2024'
  }, {
    icon: 'pill',
    title: 'Amlodipine 5mg',
    subtitle: 'Once daily · since Jan 2023'
  }];
  const allergies = [{
    icon: 'triangle-alert',
    title: 'Penicillin',
    subtitle: 'Reaction: rash'
  }];
  const timeline = [{
    date: '12 Jun 2026',
    title: 'Hospitalization — Apollo, Chennai',
    body: 'Cardiac observation, 4 nights. Discharge summary on file.'
  }, {
    date: '12 Jun 2026',
    title: 'Claim rejected by insurer',
    body: 'Cited pre-existing condition clause.'
  }, {
    date: '02 Jan 2023',
    title: 'Started Amlodipine',
    body: 'Prescribed for hypertension.'
  }];
  const Section = ({
    label,
    rows
  }) => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SL, null, label), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--aayu-surface-card)'
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement(ListRow, _extends({
    key: i
  }, r)))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: wide ? 0 : '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: wide ? 26 : 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Appa's health"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)',
      marginTop: 2
    }
  }, "Built automatically from the documents you upload.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(MetricCard, {
    label: "Conditions",
    value: "2"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Medications",
    value: "2"
  }), /*#__PURE__*/React.createElement(MetricCard, {
    label: "Allergies",
    value: "1"
  })), /*#__PURE__*/React.createElement(Section, {
    label: "Conditions",
    rows: conditions
  }), /*#__PURE__*/React.createElement(Section, {
    label: "Medications",
    rows: meds
  }), /*#__PURE__*/React.createElement(Section, {
    label: "Allergies",
    rows: allergies
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SL, null, "Timeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      paddingLeft: 6
    }
  }, timeline.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--aayu-teal-600)',
      marginTop: 5
    }
  }), i < timeline.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      flex: 1,
      background: 'var(--aayu-border-strong)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--aayu-text-muted)'
    }
  }, t.date), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)',
      marginTop: 2
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)',
      marginTop: 2,
      lineHeight: 1.5
    }
  }, t.body)))))));
}
window.HealthScreen = HealthScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/HealthScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  ListRow
} = window.AayuDesignSystem_84693d;
function SectionLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'var(--aayu-text-muted)',
      textTransform: 'uppercase',
      margin: '4px 0 10px'
    }
  }, children);
}
function ActiveClaimCard({
  onReview,
  onAsk
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--aayu-success-bg)',
      border: '0.5px solid var(--aayu-teal-100)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatusChip, {
    tone: "attention"
  }, "Contestable denial"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 500,
      color: 'var(--aayu-teal-600)',
      lineHeight: 1.1
    }
  }, "\u20B918,400"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-teal-800)',
      marginTop: 4
    }
  }, "recoverable on Appa's rejected claim")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)'
    }
  }, "Your appeal is drafted and cites Section 4.2. Review it before sending."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onReview
  }, "Review appeal"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onAsk
  }, "Ask about my policy")));
}
function QuickTile({
  icon,
  title,
  value,
  sub,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      flex: 1,
      minWidth: 0,
      textAlign: 'left',
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 22,
      height: 22,
      color: 'var(--aayu-teal-600)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-ink-900)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)'
    }
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--aayu-text-muted)'
    }
  }, sub));
}
function HomeScreen({
  wide,
  onNav,
  onReview,
  onAsk
}) {
  const activity = [{
    icon: 'file-check-2',
    title: 'Appeal letter generated',
    subtitle: '2 min ago'
  }, {
    icon: 'heart-pulse',
    title: '3 documents added to Health',
    subtitle: '2 min ago'
  }, {
    icon: 'landmark',
    title: 'Scheme match found: PM-JAY',
    subtitle: '2 min ago'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: wide ? 0 : '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, !wide && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Hi Priya"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)',
      marginTop: 2
    }
  }, "Here's where Appa's care stands.")), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      border: '0.5px solid var(--aayu-border)',
      background: 'var(--aayu-surface-card)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 8px 6px 6px',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--aayu-teal-100)',
      color: 'var(--aayu-teal-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: 12
    }
  }, "A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Appa"), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      width: 16,
      height: 16,
      color: 'var(--aayu-text-muted)'
    }
  }))), wide && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Hi Priya"), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      border: '0.5px solid var(--aayu-border)',
      background: 'var(--aayu-surface-card)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 12px 6px 6px',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--aayu-teal-100)',
      color: 'var(--aayu-teal-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: 12
    }
  }, "A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Appa \xB7 Father, 62"), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      width: 16,
      height: 16,
      color: 'var(--aayu-text-muted)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: wide ? 'grid' : 'block',
      gridTemplateColumns: wide ? '1.2fr 1fr' : 'none',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(ActiveClaimCard, {
    onReview: onReview,
    onAsk: onAsk
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav('claim'),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      width: '100%',
      height: 52,
      borderRadius: 'var(--radius-sm)',
      border: '1.5px dashed var(--aayu-teal-400)',
      background: 'var(--aayu-surface-card)',
      color: 'var(--aayu-teal-600)',
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      fontWeight: 500,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "file-plus-2",
    style: {
      width: 20,
      height: 20
    }
  }), " Fight a new claim")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: wide ? 0 : 4
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Quick access"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(QuickTile, {
    icon: "heart-pulse",
    value: "12",
    title: "Health records",
    sub: "conditions \xB7 meds",
    onClick: () => onNav('health')
  }), /*#__PURE__*/React.createElement(QuickTile, {
    icon: "landmark",
    value: "\u20B95L",
    title: "Scheme cover",
    sub: "1 match found",
    onClick: () => onNav('schemes')
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, null, "Recent activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--aayu-surface-card)'
    }
  }, activity.map((a, i) => /*#__PURE__*/React.createElement(ListRow, _extends({
    key: i
  }, a))))))), /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "shield-check"
  }, "Your data is encrypted \xB7 Pay only if we win"));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/LandingScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function LandingScreen({
  onStart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 520,
      background: 'var(--aayu-teal-600)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 32,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 38,
      fontWeight: 500,
      color: '#fff'
    }
  }, "Aayu"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      color: 'var(--aayu-teal-50)',
      maxWidth: 280,
      lineHeight: 1.6
    }
  }, "Your family's health, working for you."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-teal-100)',
      maxWidth: 300,
      lineHeight: 1.6,
      marginTop: 8
    }
  }, "Fight a wrongly rejected insurance claim, build a lifelong health record, and find benefits you're owed \u2014 from one upload."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onStart,
    style: {
      background: '#fff',
      color: 'var(--aayu-teal-700)',
      marginTop: 12
    }
  }, "Get started"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "shield-check"
  }, "Pay only if we win")));
}
window.LandingScreen = LandingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/LandingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/LoginScreen.jsx
try { (() => {
const {
  Input,
  Button,
  TrustBadge
} = window.AayuDesignSystem_84693d;
function LoginScreen({
  wide,
  mode = 'login',
  onAuth
}) {
  const [m, setM] = React.useState(mode);
  const signup = m === 'signup';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 520,
      background: 'var(--aayu-surface-page)',
      display: 'flex',
      flexDirection: 'column',
      padding: wide ? '48px 0' : '40px 20px',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 360,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 500,
      color: 'var(--aayu-teal-600)',
      textAlign: 'center',
      marginBottom: 4
    }
  }, "Aayu"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, signup ? 'Create your account' : 'Welcome back'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)',
      marginTop: 2
    }
  }, signup ? "Let's get your family's claim moving." : 'Log in to pick up where you left off.')), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    placeholder: "you@email.com",
    type: "email"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    type: "password"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onAuth,
    style: {
      width: '100%'
    }
  }, signup ? 'Sign up' : 'Log in'), /*#__PURE__*/React.createElement("button", {
    onClick: () => setM(signup ? 'login' : 'signup'),
    style: {
      border: 'none',
      background: 'none',
      color: 'var(--aayu-teal-600)',
      fontSize: 14,
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)'
    }
  }, signup ? 'Already have an account? Log in' : 'New here? Create an account'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "lock"
  }, "Your data is encrypted"))));
}
window.LoginScreen = LoginScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/PatientPickerScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function PatientPickerScreen({
  onNext
}) {
  const [selected, setSelected] = React.useState('Appa');
  const patients = [{
    name: 'Appa',
    relation: 'Father',
    age: 62
  }, {
    name: 'Amma',
    relation: 'Mother',
    age: 58
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      minHeight: 520,
      background: 'var(--aayu-surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Who is this for?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)',
      marginTop: 4
    }
  }, "Select a patient, or add someone new.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, patients.map(p => /*#__PURE__*/React.createElement(PatientSelector, _extends({
    key: p.name
  }, p, {
    selected: selected === p.name,
    onClick: () => setSelected(p.name)
  })))), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px',
      border: '1.5px dashed var(--aayu-border-strong)',
      borderRadius: 'var(--radius-md)',
      background: 'transparent',
      color: 'var(--aayu-text-secondary)',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus",
    style: {
      width: 18,
      height: 18
    }
  }), " Add a patient"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onNext,
    style: {
      width: '100%'
    }
  }, "Continue with ", selected));
}
window.PatientPickerScreen = PatientPickerScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/PatientPickerScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/PolicyQAScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function PolicyQAScreen({
  onClose
}) {
  const [messages, setMessages] = React.useState([{
    from: 'user',
    text: 'Does my policy cover a second surgery this year?'
  }, {
    from: 'ai',
    text: 'Yes — your policy allows unlimited claims within the annual sum insured of ₹5,00,000, as long as the cumulative amount for the year hasn’t been exhausted (Section 2.3).'
  }]);
  const [draft, setDraft] = React.useState('');
  const send = () => {
    if (!draft.trim()) return;
    setMessages(m => [...m, {
      from: 'user',
      text: draft
    }]);
    setDraft('');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: 520,
      background: 'var(--aayu-surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 20px',
      borderBottom: '0.5px solid var(--aayu-border)',
      background: 'var(--aayu-surface-card)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Go back",
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--aayu-text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left",
    style: {
      width: 20,
      height: 20
    },
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Explain my policy")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      overflowY: 'auto'
    }
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
      maxWidth: '80%',
      background: m.from === 'user' ? 'var(--aayu-teal-600)' : 'var(--aayu-surface-card)',
      color: m.from === 'user' ? '#fff' : 'var(--aayu-text-primary)',
      border: m.from === 'ai' ? '0.5px solid var(--aayu-border)' : 'none',
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      fontSize: 15,
      lineHeight: 1.6
    }
  }, m.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      padding: 16,
      borderTop: '0.5px solid var(--aayu-border)',
      background: 'var(--aayu-surface-card)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    placeholder: "Ask anything about your policy",
    style: {
      flex: 1,
      height: 44,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--aayu-border-strong)',
      padding: '0 14px',
      fontSize: 15,
      fontFamily: 'var(--font-sans)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: send
  }, "Ask")));
}
window.PolicyQAScreen = PolicyQAScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/PolicyQAScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/ProcessingScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function ProcessingScreen() {
  const steps = ['Reading the policy…', 'Finding the clause…', 'Drafting your appeal…'];
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI(v => Math.min(v + 1, steps.length - 1)), 1200);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    style: {
      minHeight: 520,
      background: 'var(--aayu-surface-page)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      border: '3px solid var(--aayu-teal-100)',
      borderTopColor: 'var(--aayu-teal-600)',
      animation: 'spin 1s linear infinite'
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, steps[i]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-muted)',
      textAlign: 'center',
      maxWidth: 260
    }
  }, "This takes about a minute. Your documents are encrypted."), /*#__PURE__*/React.createElement("style", null, '@keyframes spin{to{transform:rotate(360deg)}}'));
}
window.ProcessingScreen = ProcessingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/ProcessingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/ProfileScreen.jsx
try { (() => {
const {
  PatientSelector,
  ListRow,
  TrustBadge
} = window.AayuDesignSystem_84693d;
function SL({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.04em',
      color: 'var(--aayu-text-muted)',
      textTransform: 'uppercase',
      margin: '4px 0 10px'
    }
  }, children);
}
function ProfileScreen({
  wide
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: wide ? 0 : '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: wide ? 26 : 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: 'var(--aayu-teal-100)',
      color: 'var(--aayu-teal-900)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: 18
    }
  }, "P"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Priya Iyer"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)'
    }
  }, "priya@email.com \xB7 Caregiver"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SL, null, "Patients you manage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(PatientSelector, {
    name: "Appa",
    relation: "Father",
    age: 62,
    selected: true
  }), /*#__PURE__*/React.createElement(PatientSelector, {
    name: "Amma",
    relation: "Mother",
    age: 58
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SL, null, "Settings"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--aayu-surface-card)'
    }
  }, /*#__PURE__*/React.createElement(ListRow, {
    icon: "shield-check",
    title: "Security & encryption",
    subtitle: "Your documents are encrypted"
  }), /*#__PURE__*/React.createElement(ListRow, {
    icon: "file-lock-2",
    title: "Data & consent",
    subtitle: "Review or withdraw consent"
  }), /*#__PURE__*/React.createElement(ListRow, {
    icon: "circle-help",
    title: "Help & support"
  }), /*#__PURE__*/React.createElement(ListRow, {
    icon: "log-out",
    title: "Log out"
  }))), /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "lock"
  }, "DPDP-compliant \xB7 you can delete your data anytime"));
}
window.ProfileScreen = ProfileScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/ProfileScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/SchemesScreen.jsx
try { (() => {
const {
  Button,
  StatusChip
} = window.AayuDesignSystem_84693d;
function SchemesScreen({
  wide
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: wide ? 0 : '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: wide ? 26 : 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Schemes you may be owed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)',
      marginTop: 2
    }
  }, "Matched to Appa's profile from the documents on file.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-teal-100)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--aayu-success-bg)',
      padding: '16px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-sm)',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "landmark",
    style: {
      width: 22,
      height: 22,
      color: 'var(--aayu-teal-600)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--aayu-teal-900)'
    }
  }, "Ayushman Bharat PM-JAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--aayu-teal-800)'
    }
  }, "Government of India")), /*#__PURE__*/React.createElement(StatusChip, {
    tone: "success"
  }, "Likely eligible")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 500,
      color: 'var(--aayu-teal-600)'
    }
  }, "Up to \u20B95,00,000 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 400,
      color: 'var(--aayu-text-secondary)'
    }
  }, "/ family / year")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--aayu-text-secondary)'
    }
  }, "Based on Appa's age and household profile, he may qualify for cashless secondary and tertiary care at empanelled hospitals."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Check eligibility"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "How this was matched")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 16px',
      border: '0.5px dashed var(--aayu-border-strong)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--aayu-surface-muted)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 20,
      height: 20,
      color: 'var(--aayu-text-muted)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Still checking for more"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)'
    }
  }, "We'll surface new matches as your Health record grows. No match is ever hidden."))));
}
window.SchemesScreen = SchemesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/SchemesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/StateScreens.jsx
try { (() => {
const {
  Button,
  StatusChip,
  TrustBadge,
  MetricCard
} = window.AayuDesignSystem_84693d;
function Skel({
  w = '100%',
  h = 14,
  r = 6,
  mt = 0
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      borderRadius: r,
      marginTop: mt,
      background: 'linear-gradient(90deg,var(--aayu-surface-muted) 25%,#EAE8E0 50%,var(--aayu-surface-muted) 75%)',
      backgroundSize: '200% 100%',
      animation: 'aayuShimmer 1.3s ease-in-out infinite'
    }
  });
}
function Wrap({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 18px',
      minHeight: '100%',
      background: 'var(--aayu-surface-page)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes aayuShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}'), children);
}
function Center({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      background: 'var(--aayu-surface-page)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      padding: '40px 28px',
      textAlign: 'center'
    }
  }, children);
}
function Icn({
  name,
  tone = 'teal'
}) {
  const bg = tone === 'danger' ? 'var(--aayu-danger-bg)' : tone === 'attention' ? 'var(--aayu-attention-bg)' : 'var(--aayu-success-bg)';
  const fg = tone === 'danger' ? 'var(--aayu-danger)' : tone === 'attention' ? 'var(--aayu-attention)' : 'var(--aayu-teal-600)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": name,
    style: {
      width: 26,
      height: 26,
      color: fg
    }
  }));
}
function H(t) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, t);
}
function P(t) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)',
      lineHeight: 1.6,
      maxWidth: 280
    }
  }, t);
}

// ---- HEALTH ----
function HealthEmpty() {
  return /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(Icn, {
    name: "heart-pulse"
  }), H("Appa's health record starts here"), P('Upload a report or a claim to begin. Everything you add builds his lifelong record automatically.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Add a document"));
}
function HealthLoading() {
  return /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 500
    }
  }, "Appa's health"), /*#__PURE__*/React.createElement(Skel, {
    w: "60%",
    h: 12
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--aayu-surface-card)',
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 6
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Skel, {
    w: 36,
    h: 36,
    r: 8
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Skel, {
    w: "70%",
    h: 13
  }), /*#__PURE__*/React.createElement(Skel, {
    w: "40%",
    h: 11,
    mt: 8
  }))))));
}

// ---- SCHEMES ----
function SchemesEmpty() {
  return /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(Icn, {
    name: "landmark",
    tone: "attention"
  }), H('No scheme match yet'), P('We haven’t found a confident match for Appa’s profile. As you add more documents, new matches will appear here — nothing is ever hidden.'), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Add more documents"));
}
function SchemesLoading() {
  return /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 500
    }
  }, "Schemes"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--aayu-surface-card)',
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Skel, {
    w: 40,
    h: 40,
    r: 8
  }), /*#__PURE__*/React.createElement(Skel, {
    w: "80%",
    h: 16
  }), /*#__PURE__*/React.createElement(Skel, {
    w: "50%",
    h: 13
  }), /*#__PURE__*/React.createElement(Skel, {
    w: "100%",
    h: 12,
    mt: 6
  }), /*#__PURE__*/React.createElement(Skel, {
    w: "90%",
    h: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-muted)',
      textAlign: 'center'
    }
  }, "Checking curated schemes against Appa\u2019s profile\u2026"));
}

// ---- UPLOAD / CLAIM ----
function UploadEmpty() {
  return /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(Icn, {
    name: "file-plus-2"
  }), H('Upload your claim documents'), P('Add the rejection letter, your policy, and hospital bills. Photos or PDFs both work.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Add photo or PDF"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "lock"
  }, "Pay only if we win")));
}
function UploadError() {
  return /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 500
    }
  }, "Upload documents"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      border: '0.5px solid var(--aayu-attention)',
      background: 'var(--aayu-attention-bg)',
      borderRadius: 'var(--radius-md)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "image-off",
    style: {
      width: 20,
      height: 20,
      color: 'var(--aayu-attention)',
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "This photo\u2019s a little blurry to read"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)'
    }
  }, "Retake it in good light and we\u2019ll try again."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "Retake photo")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      border: '0.5px solid var(--aayu-danger)',
      background: 'var(--aayu-danger-bg)',
      borderRadius: 'var(--radius-md)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "file-x",
    style: {
      width: 20,
      height: 20,
      color: 'var(--aayu-danger)',
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "This doesn\u2019t look like a medical document"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)'
    }
  }, "Please upload the rejection letter, policy, or a bill."))));
}

// ---- PROCESSING / APPEAL ERROR ----
function AppealError() {
  return /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(Icn, {
    name: "triangle-alert",
    tone: "danger"
  }), H('We couldn’t finish this just now'), P('Something interrupted the analysis — but nothing was lost. Try again and we’ll pick up where we stopped.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Try again"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Contact support"));
}

// ---- SUCCESS ----
function ClaimSuccess() {
  return /*#__PURE__*/React.createElement(Center, null, /*#__PURE__*/React.createElement(Icn, {
    name: "circle-check"
  }), /*#__PURE__*/React.createElement(StatusChip, {
    tone: "success"
  }, "Appeal ready"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 500,
      color: 'var(--aayu-teal-600)'
    }
  }, "\u20B918,400"), P('Your clause-cited appeal for Appa is drafted and ready to review before you send it.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Review appeal"));
}

// ---- HOME EMPTY (first-time) ----
function HomeEmpty() {
  return /*#__PURE__*/React.createElement(Wrap, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500
    }
  }, "Hi Priya"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-secondary)'
    }
  }, "Let\u2019s get started.")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--aayu-surface-card)',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icn, {
    name: "file-plus-2"
  }), H('Fight your first claim'), P('Upload a rejected claim and we’ll draft a clause-cited appeal — you only pay if we win.'), /*#__PURE__*/React.createElement(Button, {
    variant: "primary"
  }, "Fight a claim")), /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "shield-check"
  }, "Your data is encrypted"));
}
Object.assign(window, {
  AayuSkel: Skel,
  HealthEmpty,
  HealthLoading,
  SchemesEmpty,
  SchemesLoading,
  UploadEmpty,
  UploadError,
  AppealError,
  ClaimSuccess,
  HomeEmpty
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/StateScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/UploadScreen.jsx
try { (() => {
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function UploadScreen({
  onNext
}) {
  const [files, setFiles] = React.useState([{
    name: 'rejection-letter.pdf',
    status: 'done'
  }, {
    name: 'policy.pdf',
    status: 'done'
  }]);
  const addFile = () => setFiles(f => [...f, {
    name: 'discharge-summary.jpg',
    status: 'reading'
  }]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minHeight: 520,
      background: 'var(--aayu-surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Upload your documents"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--aayu-text-secondary)',
      marginTop: 4
    }
  }, "Rejection letter, policy, and hospital bills for Appa.")), /*#__PURE__*/React.createElement(TrustBadge, {
    icon: "lock"
  }, "Pay only if we win"), /*#__PURE__*/React.createElement("label", {
    style: {
      border: '1.5px dashed var(--aayu-border-strong)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--aayu-surface-muted)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '32px 16px',
      cursor: 'pointer'
    },
    onClick: addFile
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "upload",
    style: {
      width: 28,
      height: 28,
      color: 'var(--aayu-teal-600)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Add photo or PDF")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, files.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--aayu-surface-card)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "file-text",
    style: {
      width: 18,
      height: 18,
      color: 'var(--aayu-text-secondary)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14,
      color: 'var(--aayu-text-primary)'
    }
  }, f.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: f.status === 'done' ? 'var(--aayu-success)' : 'var(--aayu-text-muted)'
    }
  }, f.status)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-text-muted)'
    }
  }, "This takes about a minute. Your documents are encrypted."), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onNext,
    style: {
      width: '100%'
    }
  }, "Analyze documents"));
}
window.UploadScreen = UploadScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/UploadScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aayu-app/VaultScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  TrustBadge,
  StatusChip,
  MetricCard,
  Input,
  PatientSelector,
  UploadDropzone,
  AssessmentCard,
  LetterCard,
  ListRow,
  BottomSheet
} = window.AayuDesignSystem_84693d;
function VaultScreen({
  onClose
}) {
  const conditions = [{
    icon: 'heart-pulse',
    title: 'Type 2 diabetes',
    subtitle: 'Diagnosed 2022'
  }, {
    icon: 'activity',
    title: 'Hypertension',
    subtitle: 'Diagnosed 2021'
  }];
  const meds = [{
    icon: 'pill',
    title: 'Metformin 500mg',
    subtitle: 'Since Mar 2024'
  }, {
    icon: 'pill',
    title: 'Amlodipine 5mg',
    subtitle: 'Since Jan 2023'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 520,
      background: 'var(--aayu-surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '16px 20px',
      borderBottom: '0.5px solid var(--aayu-border)',
      background: 'var(--aayu-surface-card)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Go back",
    style: {
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--aayu-text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left",
    style: {
      width: 20,
      height: 20
    },
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 500,
      color: 'var(--aayu-text-primary)'
    }
  }, "Appa's Vault")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--aayu-text-muted)',
      marginBottom: 8
    }
  }, "CONDITIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, conditions.map((c, i) => /*#__PURE__*/React.createElement(ListRow, _extends({
    key: i
  }, c))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--aayu-text-muted)',
      marginBottom: 8
    }
  }, "MEDICATIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '0.5px solid var(--aayu-border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden'
    }
  }, meds.map((m, i) => /*#__PURE__*/React.createElement(ListRow, _extends({
    key: i
  }, m))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--aayu-success-bg)',
      borderRadius: 'var(--radius-md)',
      padding: 16,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "badge-indian-rupee",
    style: {
      width: 22,
      height: 22,
      color: 'var(--aayu-teal-600)',
      flexShrink: 0,
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--aayu-teal-900)'
    }
  }, "Ayushman Bharat PM-JAY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--aayu-teal-800)',
      marginTop: 2
    }
  }, "Based on Appa's profile, he may be eligible for coverage up to \u20B95,00,000/year.")))));
}
window.VaultScreen = VaultScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aayu-app/VaultScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.MetricCard = __ds_scope.MetricCard;

__ds_ns.StatusChip = __ds_scope.StatusChip;

__ds_ns.TrustBadge = __ds_scope.TrustBadge;

__ds_ns.AssessmentCard = __ds_scope.AssessmentCard;

__ds_ns.LetterCard = __ds_scope.LetterCard;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.PatientSelector = __ds_scope.PatientSelector;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.UploadDropzone = __ds_scope.UploadDropzone;

__ds_ns.BottomSheet = __ds_scope.BottomSheet;

__ds_ns.ListRow = __ds_scope.ListRow;

})();
