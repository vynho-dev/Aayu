import type { ReactNode } from "react";

// ponytail: ~8 inline lucide-style glyphs instead of pulling in an icon dependency for the nav + tiles.
export type IconName =
  | "home"
  | "health"
  | "claim"
  | "schemes"
  | "profile"
  | "shield"
  | "chevron"
  | "plus"
  | "chat"
  | "trash";

const paths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3 9.5 12 3l9 6.5" />
      <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
    </>
  ),
  health: (
    <>
      <path d="M12 20s-6.5-4.35-6.5-9A3.5 3.5 0 0 1 12 8.5 3.5 3.5 0 0 1 18.5 11c0 4.65-6.5 9-6.5 9Z" />
      <path d="M8 12.5h2l1-2 1.5 3 1-1.5H16" />
    </>
  ),
  claim: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M12 12v5" />
      <path d="M9.5 14.5h5" />
    </>
  ),
  schemes: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10M9 21V10M15 21V10M19 21V10" />
      <path d="M12 3 3 8h18Z" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  chat: <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
};

export function Icon({ name, size = 22, color = "currentColor" }: { name: IconName; size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
