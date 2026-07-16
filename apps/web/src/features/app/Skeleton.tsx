import type { CSSProperties } from "react";

export function Skeleton({ width = "100%", height = 16, radius = "var(--radius-sm)", style }: { width?: number | string; height?: number | string; radius?: string; style?: CSSProperties }) {
  return <div className="aayu-skeleton" style={{ width, height, borderRadius: radius, ...style }} aria-hidden="true" />;
}

function CardSkeleton() {
  return (
    <div className="aayu-card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton width={40} height={40} />
      <Skeleton width="55%" height={20} />
      <Skeleton height={14} />
      <Skeleton width="80%" height={14} />
    </div>
  );
}

// Mirrors the dashboard's own shape (sidebar + greeting + card grid) so the
// loading state reads as "this page, not yet filled in" rather than a
// generic spinner unrelated to what's about to appear.
export function AppLoadingSkeleton() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }} aria-busy="true" aria-live="polite">
      <div
        className="hidden md:flex"
        style={{
          width: 260,
          flexShrink: 0,
          flexDirection: "column",
          gap: 10,
          padding: "24px 16px",
          background: "var(--aayu-surface-card)",
          borderRight: "0.5px solid var(--aayu-border)",
        }}
      >
        <Skeleton width={72} height={30} style={{ marginBottom: 14 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={40} radius="var(--radius-sm)" />
        ))}
      </div>
      <div className="mx-auto w-full max-w-300 px-4 py-6 md:px-12 md:py-14" style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Skeleton width={160} height={28} />
            <Skeleton width={220} height={14} />
          </div>
          <Skeleton width={120} height={36} radius="var(--radius-pill)" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
