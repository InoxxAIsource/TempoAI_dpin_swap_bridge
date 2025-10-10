import { ReactNode } from "react";

export default function GhostIconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      className="rounded-xl p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}
