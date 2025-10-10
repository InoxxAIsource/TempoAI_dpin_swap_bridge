import { cls } from "./utils";
import { ReactNode } from "react";

export default function Message({ role, children }: { role: "user" | "assistant"; children: ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={cls("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          AI
        </div>
      )}
      <div
        className={cls(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground border border-border",
        )}
      >
        {children}
      </div>
      {isUser && (
        <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          JD
        </div>
      )}
    </div>
  );
}
