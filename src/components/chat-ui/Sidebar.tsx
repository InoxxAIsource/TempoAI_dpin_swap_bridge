import { X, Plus, MessageSquare, Folder, Settings, User } from "lucide-react";
import { cls, timeAgo } from "./utils";
import { Conversation } from "./mockData";

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  conversations,
  selectedId,
  onSelectConversation,
  onNewChat,
  isOpen,
  onClose,
}: SidebarProps) {
  const groupedConversations = conversations.reduce((acc, conv) => {
    const folder = conv.folder || "General";
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

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

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedConversations).map(([folder, convs]) => (
              <div key={folder} className="border-b border-zinc-200/60 p-2 dark:border-zinc-800">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <Folder className="h-3.5 w-3.5" />
                  {folder}
                </div>
                <div className="space-y-0.5">
                  {convs.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        onClose();
                      }}
                      className={cls(
                        "w-full rounded-lg px-2 py-2 text-left text-sm transition-colors",
                        selectedId === conv.id
                          ? "bg-zinc-100 dark:bg-zinc-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                        <div className="flex-1 overflow-hidden">
                          <div className="truncate font-medium">{conv.title}</div>
                          <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {conv.preview}
                          </div>
                          <div className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                            {timeAgo(conv.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
