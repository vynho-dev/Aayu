import { UserButton } from "@clerk/react";
import type { ReactNode } from "react";

import { Icon, type IconName } from "./Icon";

export type Tab = "home" | "health" | "claim" | "schemes" | "profile";

const NAV: { id: Tab; label: string; icon: IconName; primary?: boolean }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "health", label: "Health", icon: "health" },
  { id: "claim", label: "Claim", icon: "claim", primary: true },
  { id: "schemes", label: "Schemes", icon: "schemes" },
  { id: "profile", label: "Profile", icon: "profile" },
];

const clerkActive = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function Sidebar({ active, onNav }: { active: Tab; onNav: (id: Tab) => void }) {
  return (
    <aside
      className="hidden md:flex"
      style={{
        width: 260,
        flexShrink: 0,
        flexDirection: "column",
        background: "var(--aayu-surface-card)",
        borderRight: "0.5px solid var(--aayu-border)",
        padding: "var(--space-6) var(--space-4)",
      }}
    >
      <div className="aayu-text-display" style={{ fontWeight: 500, color: "var(--aayu-teal-600)", padding: "0 var(--space-3) var(--space-6)" }}>Aayu</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map((n) => {
          const on = active === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNav(n.id)}
              className="aayu-text-body"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "var(--space-3)",
                borderRadius: "var(--radius-sm)",
                border: "none",
                textAlign: "left",
                background: on ? "var(--aayu-success-bg)" : "transparent",
                color: on ? "var(--aayu-teal-800)" : "var(--aayu-text-secondary)",
                fontWeight: 500,
              }}
            >
              <Icon name={n.icon} size={20} color={on ? "var(--aayu-teal-600)" : "var(--aayu-text-muted)"} />
              {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "var(--space-3)",
          borderTop: "0.5px solid var(--aayu-border)",
        }}
      >
        {clerkActive ? (
          <>
            <UserButton />
            <span className="aayu-text-caption" style={{ color: "var(--aayu-text-secondary)" }}>Your account</span>
          </>
        ) : (
          <span className="aayu-text-caption" style={{ color: "var(--aayu-text-muted)" }}>Development session</span>
        )}
      </div>
    </aside>
  );
}

function TabBar({ active, onNav }: { active: Tab; onNav: (id: Tab) => void }) {
  return (
    <nav
      className="flex md:hidden"
      style={{
        alignItems: "flex-end",
        justifyContent: "space-around",
        borderTop: "0.5px solid var(--aayu-border)",
        background: "var(--aayu-surface-card)",
        padding: "8px 6px 10px",
      }}
    >
      {NAV.map((n) => {
        if (n.primary) {
          return (
            <button
              key={n.id}
              onClick={() => onNav(n.id)}
              aria-label={n.label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "none", transform: "translateY(-8px)" }}
            >
              <span
                style={{
                  width: "var(--space-12)",
                  height: "var(--space-12)",
                  borderRadius: "50%",
                  background: "var(--aayu-teal-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--elevation-1)",
                }}
              >
                <Icon name={n.icon} size={24} color="#fff" />
              </span>
              <span className="aayu-text-label" style={{ color: "var(--aayu-text-secondary)", fontWeight: 500 }}>{n.label}</span>
            </button>
          );
        }
        const on = active === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "none", background: "none", padding: "4px 8px" }}
          >
            <Icon name={n.icon} size={22} color={on ? "var(--aayu-teal-600)" : "var(--aayu-text-muted)"} />
            <span className="aayu-text-label" style={{ fontWeight: 500, color: on ? "var(--aayu-teal-600)" : "var(--aayu-text-muted)" }}>{n.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function AppShell({ active, onNav, children }: { active: Tab; onNav: (id: Tab) => void; children: ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <Sidebar active={active} onNav={onNav} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <main style={{ flex: 1, overflowY: "auto" }}>
          <div className="mx-auto w-full max-w-300 px-4 py-6 md:px-12 md:py-14">{children}</div>
        </main>
        <TabBar active={active} onNav={onNav} />
      </div>
    </div>
  );
}
