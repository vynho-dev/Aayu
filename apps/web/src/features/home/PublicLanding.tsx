import { useEffect, useState } from "react";

import { SignInScreen } from "../auth/SignInScreen";
import { Icon, type IconName } from "../app/Icon";

const highlights: [IconName, string, string][] = [
  [
    "claim",
    "Understand a rejected claim",
    "Plain-language reasons, the right evidence, and an appeal draft.",
  ],
  [
    "health",
    "Keep every health record together",
    "Policies, reports, prescriptions, and doctor notes for each person.",
  ],
  [
    "schemes",
    "Find support you may qualify for",
    "A guided check for relevant government health schemes.",
  ],
];

const HEADLINE = "Know what to do next, for every person you care about.??";

function useTypewriter(text: string, speed = 28) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [length, setLength] = useState(reduceMotion ? text.length : 0);

  useEffect(() => {
    if (reduceMotion || length >= text.length) return;
    const timer = setTimeout(() => setLength((n) => n + 1), speed);
    return () => clearTimeout(timer);
  }, [length, text, speed, reduceMotion]);

  return { visible: text.slice(0, length), done: length >= text.length };
}

export function PublicLanding() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [answerSettled, setAnswerSettled] = useState(false);
  const [descriptionSettled, setDescriptionSettled] = useState(false);
  const headline = useTypewriter(HEADLINE, 40);

  function openAuth(value = "") {
    setAuthIdentifier(value);
    setAuthOpen(true);
  }

  return (
    <main className="min-h-screen bg-(--aayu-surface-page) text-(--aayu-text-primary)">
      <header className="mx-auto flex w-full max-w-300 items-center justify-between px-5 py-5 sm:px-8">
        <span className="aayu-text-h1 font-medium text-(--aayu-teal-600)">
          Aayu
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="aayu-text-body-sm font-medium text-(--aayu-teal-700)"
            onClick={() => openAuth()}
          >
            Sign in
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => openAuth()}
          >
            Get started
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-300 px-5 pb-14 pt-8 sm:px-8 lg:pb-24 lg:pt-16">
        <div>
          <h1
            className="w-full text-[clamp(1.875rem,1.6rem+1.4vw,2.5rem)] font-bold leading-tight text-(--aayu-ink-900)"
            aria-label={HEADLINE}
          >
            <span aria-hidden="true">
              {headline.visible}
              <span className="aayu-caret" data-done={headline.done} />
            </span>
          </h1>
          <p
            className={`mt-4 max-w-180 text-[clamp(2.25rem,1.85rem+2vw,3.25rem)] font-bold leading-tight text-(--aayu-teal-700) ${answerSettled ? "opacity-100" : "aayu-popup"}`}
            data-show={headline.done}
            onAnimationEnd={() => setAnswerSettled(true)}
          >
            <span className="text-(--aayu-teal-600)">AAYU</span> - Health care,
            made easier for Indian families
          </p>
          <p
            className={`aayu-text-h2 mt-5 max-w-150 text-(--aayu-text-secondary) ${descriptionSettled ? "opacity-100" : "aayu-popup"}`}
            data-show={answerSettled}
            onAnimationEnd={() => setDescriptionSettled(true)}
          >
            Aayu brings insurance claims, health records, documents, and scheme
            guidance into one calm, organised place.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid w-full max-w-300 gap-4 px-5 py-12 sm:grid-cols-3 sm:px-8">
          {highlights.map(([icon, title, body], index) => (
            <article
              key={title}
              className="aayu-float-card aayu-card aayu-card-transparent"
              style={{
                animationDelay: `${index * 0.35}s`,
                animationDuration: `${4 + index * 0.6}s`,
              }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-(--aayu-teal-50)">
                <Icon name={icon} size={18} color="var(--aayu-teal-600)" />
              </span>
              <h2 className="aayu-text-h2 mt-4 font-medium">{title}</h2>
              <p className="aayu-text-body-sm mt-2 text-(--aayu-text-secondary)">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>
      <SignInScreen
        open={authOpen}
        identifier={authIdentifier}
        onClose={() => setAuthOpen(false)}
      />
    </main>
  );
}
