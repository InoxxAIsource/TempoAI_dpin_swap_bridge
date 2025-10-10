import { X, Plus, Settings, User } from "lucide-react";
import { cls } from "./utils";

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  onNewChat,
  isOpen,
  onClose,
}: SidebarProps) {

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cls(
          "fixed left-0 top-0 z-50 h-full w-72 border-r border-zinc-200/60 bg-white/95 backdrop-blur transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950/95",
          "md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200/60 p-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold">Chats</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onNewChat}
                className="rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                aria-label="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="md:hidden rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Empty space for future content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center text-sm text-muted-foreground">
              Start a new conversation
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-200/60 p-2 dark:border-zinc-800">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
