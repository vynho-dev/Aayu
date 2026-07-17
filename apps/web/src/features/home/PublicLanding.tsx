import { type FormEvent, useState } from "react";

import { SignInScreen } from "../auth/SignInScreen";
import { Icon } from "../app/Icon";

const highlights = [
  ["Understand a rejected claim", "Plain-language reasons, the right evidence, and an appeal draft."],
  ["Keep every health record together", "Policies, reports, prescriptions, and doctor notes for each person."],
  ["Find support you may qualify for", "A guided check for relevant government health schemes."],
];

export function PublicLanding() {
  const [identifier, setIdentifier] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authIdentifier, setAuthIdentifier] = useState("");

  function openAuth(value = "") {
    setAuthIdentifier(value);
    setAuthOpen(true);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openAuth(identifier);
  }

  return (
    <main className="min-h-screen bg-(--aayu-surface-page) text-(--aayu-text-primary)">
      <header className="mx-auto flex w-full max-w-300 items-center justify-between px-5 py-5 sm:px-8">
        <span className="aayu-text-h1 font-medium text-(--aayu-teal-600)">Aayu</span>
        <div className="flex items-center gap-3">
          <button type="button" className="aayu-text-body-sm font-medium text-(--aayu-teal-700)" onClick={() => openAuth()}>Sign in</button>
          <button type="button" className="primary-button" onClick={() => openAuth()}>Get started</button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-300 gap-10 px-5 pb-14 pt-8 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pb-24 lg:pt-16">
        <div>
          <p className="aayu-text-body-sm mb-4 font-medium text-(--aayu-teal-700)">Health care, made easier for Indian families</p>
          <h1 className="aayu-text-display max-w-180 font-medium leading-tight text-(--aayu-ink-900)">Know what to do next, for every person you care about.</h1>
          <p className="aayu-text-body mt-5 max-w-150 text-(--aayu-text-secondary)">Aayu brings insurance claims, health records, documents, and scheme guidance into one calm, organised place.</p>
          <form className="mt-8 grid max-w-150 gap-3 sm:grid-cols-[1fr_auto]" onSubmit={submit}>
            <label className="sr-only" htmlFor="aayu-identifier">Email or mobile number</label>
            <input id="aayu-identifier" required value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Email or mobile number" autoComplete="username" />
            <button className="primary-button" type="submit">Continue</button>
          </form>
          <p className="aayu-text-caption mt-3 text-(--aayu-text-secondary)">Use email, mobile number, Google, or Apple. No separate caregiver account is needed.</p>
        </div>

        <div className="rounded-3xl border border-(--aayu-teal-100) bg-(--aayu-teal-50) p-5 shadow-(--elevation-2) sm:p-7">
          <div className="flex items-center justify-between">
            <div><p className="aayu-text-label font-medium uppercase tracking-wide text-(--aayu-text-secondary)">Aayu home</p><h2 className="aayu-text-h2 mt-1 font-medium">A clearer view of care</h2></div>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white"><Icon name="health" size={22} color="var(--aayu-teal-600)" /></span>
          </div>
          <div className="mt-6 grid gap-3">
            <div className="rounded-xl bg-white p-4"><p className="aayu-text-body-sm font-medium">One family, separate private profiles</p><p className="aayu-text-caption mt-1 text-(--aayu-text-secondary)">Switch between yourself, a parent, a child, or another dependant.</p></div>
            <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-white p-4"><p className="aayu-text-label text-(--aayu-text-secondary)">Claims</p><p className="aayu-text-h2 mt-2 font-medium">Clear next steps</p></div><div className="rounded-xl bg-white p-4"><p className="aayu-text-label text-(--aayu-text-secondary)">Health</p><p className="aayu-text-h2 mt-2 font-medium">Documents together</p></div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-(--aayu-border) bg-white">
        <div className="mx-auto grid w-full max-w-300 gap-4 px-5 py-12 sm:grid-cols-3 sm:px-8">
          {highlights.map(([title, body]) => <article key={title} className="rounded-xl p-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-(--aayu-teal-50)"><Icon name="shield" size={18} color="var(--aayu-teal-600)" /></span><h2 className="aayu-text-h2 mt-4 font-medium">{title}</h2><p className="aayu-text-body-sm mt-2 text-(--aayu-text-secondary)">{body}</p></article>)}
        </div>
      </section>
      <SignInScreen open={authOpen} identifier={authIdentifier} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
