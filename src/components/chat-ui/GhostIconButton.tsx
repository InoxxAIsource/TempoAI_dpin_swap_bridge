import { ReactNode } from "react";

export default function GhostIconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}
