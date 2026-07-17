import { SignIn } from "@clerk/react";

const appearance = {
  variables: {
    colorPrimary: "#0F6E56",
    colorText: "#1F2421",
    colorTextSecondary: "#5F5E5A",
    colorInputText: "#1F2421",
    borderRadius: "8px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
  },
  elements: {
    rootBox: { width: "100%" },
    card: { boxShadow: "none", border: "none", backgroundColor: "transparent", width: "100%" },
    header: { display: "none" },
    footer: { background: "transparent" },
    formButtonPrimary: { fontWeight: 500 },
  },
};

function initialValues(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return undefined;
  if (trimmed.includes("@")) return { emailAddress: trimmed };
  const digits = trimmed.replace(/[^\d+]/g, "");
  return { phoneNumber: digits.startsWith("+") ? digits : `+91${digits}` };
}

export function SignInScreen({ open, identifier, onClose }: { open: boolean; identifier: string; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/45 p-0 sm:place-items-center sm:p-6" role="presentation">
      <section aria-labelledby="auth-title" aria-modal="true" role="dialog" className="max-h-[92vh] w-full max-w-115 overflow-y-auto rounded-t-3xl bg-(--aayu-surface-card) p-6 shadow-2xl sm:rounded-2xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="aayu-text-h1 font-medium text-(--aayu-teal-600)">Aayu</span>
            <h1 id="auth-title" className="aayu-text-h2 mt-4 font-medium text-(--aayu-ink-900)">Continue to your care space</h1>
            <p className="aayu-text-body-sm mt-2 text-(--aayu-text-secondary)">Use your email or mobile number. New and returning users continue in one simple flow.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close sign in" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-(--aayu-border) text-(--aayu-text-secondary)">×</button>
        </div>
        <SignIn key={identifier} routing="hash" withSignUp initialValues={initialValues(identifier)} appearance={appearance} fallbackRedirectUrl="/" />
        <p className="aayu-text-caption mt-5 text-center text-(--aayu-text-secondary)">Your medical information is private and used only to provide Aayu&rsquo;s services.</p>
      </section>
    </div>
  );
}
