import { SignIn, SignUp } from "@clerk/react";
import { useState } from "react";


const HERO_IMG =
  "https://images.unsplash.com/photo-1762955911431-4c44c7c3f408?auto=format&fit=crop&w=900&q=80";


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
    card: { boxShadow: "none", border: "none", backgroundColor: "transparent" },
    headerTitle: { fontWeight: 500 },
    formButtonPrimary: { fontWeight: 500 },
    footer: { background: "transparent" },
    footerAction: { display: "none" }, // our own toggle sits below, prototype-style
  },
};

function AvatarStack() {
  const tints = ["#9FE1CB", "#1D9E75", "#0F6E56"];
  return (
    <div className="flex items-center">
      {tints.map((c, i) => (
        <span
          key={c}
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-full border-2 border-white"
          style={{ background: c, marginLeft: i === 0 ? 0 : -10 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function SignInScreen() {
  const [signup, setSignup] = useState(true);

  return (
    <main className="grid min-h-screen w-full place-items-center p-4 sm:p-8">
      <div className="grid w-full max-w-7xl overflow-hidden rounded-2xl bg-(--aayu-surface-card) shadow-(--elevation-2) md:grid-cols-2">
        {/* Brand panel */}
        <aside className="hidden flex-col gap-6 bg-(--aayu-teal-50) p-8 md:flex md:h-full">
          <span className="aayu-text-h1 font-medium text-(--aayu-teal-600)">Aayu</span>
          <h1 className="aayu-text-display font-medium leading-tight text-(--aayu-ink-900)">
            Your family&rsquo;s health,
            <br />
            in the <span className="underline decoration-(--aayu-teal-400) decoration-2 underline-offset-4">best hands</span>
          </h1>
          <div className="flex w-fit items-center gap-3 rounded-full border border-(--aayu-border) bg-(--aayu-surface-card) px-3 py-2 shadow-(--elevation-1)">
            <AvatarStack />
            <span className="aayu-text-body-sm font-medium text-(--aayu-text-primary)">
              1,293 families protected
            </span>
          </div>
          <img
            src={HERO_IMG}
            alt="A caregiver helping an elderly couple at home"
            loading="lazy"
            className="min-h-64 w-full flex-1 rounded-xl object-cover"
          />
        </aside>

        {/* Auth panel */}
        <section className="flex flex-col items-center justify-center gap-5 px-4 py-6 sm:p-10">
          <span className="aayu-text-h1 font-medium text-(--aayu-teal-600) md:hidden">Aayu</span>

          <div className="flex w-full max-w-100 justify-center">
            {signup ? (
              <SignUp routing="hash" appearance={appearance} />
            ) : (
              <SignIn routing="hash" appearance={appearance} />
            )}
          </div>

          <button
            type="button"
            onClick={() => setSignup((s) => !s)}
            className="aayu-text-body-sm text-(--aayu-teal-600)"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {signup ? "Already have an account? Log in" : "New here? Create an account"}
          </button>

          <span className="aayu-text-caption inline-flex items-center gap-1.5 rounded-full bg-(--aayu-teal-50) px-3 py-1.5 font-medium text-(--aayu-teal-900)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Your data is encrypted
          </span>
        </section>
      </div>
    </main>
  );
}
