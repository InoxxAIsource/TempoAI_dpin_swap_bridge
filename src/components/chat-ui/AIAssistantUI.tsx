import React, { useEffect, useMemo, useRef, useState } from "react";
import ChatPane from "./ChatPane";
import ChatHeader from "./ChatHeader";
import { INITIAL_CONVERSATIONS } from "./mockData";
import type { Conversation } from "./mockData";

export default function AIAssistantUI() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });

  useEffect(() => {
    try {
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingConvId, setThinkingConvId] = useState<string | null>(null);

  const composerRef = useRef<{ insertTemplate: (content: string) => void }>(null);

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      createNewChat();
    }
  }, []);

  function createNewChat() {
    const id = Math.random().toString(36).slice(2);
    const item: Conversation = {
      id,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "Say hello to start...",
      pinned: false,
      folder: "Work Projects",
      messages: [],
    };
    setConversations((prev) => [item, ...prev]);
    setSelectedId(id);
    setSidebarOpen(false);
  }

  function sendMessage(convId: string, content: string) {
    if (!content.trim()) return;
    const now = new Date().toISOString();
    const userMsg = { id: Math.random().toString(36).slice(2), role: "user" as const, content, createdAt: now };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = [...(c.messages || []), userMsg];
        return {
          ...c,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        };
      })
    );

    setIsThinking(true);
    setThinkingConvId(convId);

    const currentConvId = convId;
    setTimeout(() => {
      setIsThinking(false);
      setThinkingConvId(null);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== currentConvId) return c;
          const ack = `Got it — I'll help with that.`;
          const asstMsg = {
            id: Math.random().toString(36).slice(2),
            role: "assistant" as const,
            content: ack,
            createdAt: new Date().toISOString(),
          };
          const msgs = [...(c.messages || []), asstMsg];
          return {
            ...c,
            messages: msgs,
            updatedAt: new Date().toISOString(),
            messageCount: msgs.length,
            preview: asstMsg.content.slice(0, 80),
          };
        })
      );
    }, 2000);
  }

  function editMessage(convId: string, messageId: string, newContent: string) {
    const now = new Date().toISOString();
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = (c.messages || []).map((m) => (m.id === messageId ? { ...m, content: newContent, editedAt: now } : m));
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        };
      })
    );
  }

  function resendMessage(convId: string, messageId: string) {
    const conv = conversations.find((c) => c.id === convId);
    const msg = conv?.messages?.find((m) => m.id === messageId);
    if (!msg) return;
    sendMessage(convId, msg.content);
  }

  function pauseThinking() {
    setIsThinking(false);
    setThinkingConvId(null);
  }

  const selected = conversations.find((c) => c.id === selectedId) || null;

  return (
    <div className="h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex h-full max-w-[1400px] flex-col">
        <ChatHeader createNewChat={createNewChat} sidebarCollapsed={sidebarCollapsed} setSidebarOpen={setSidebarOpen} />
        <ChatPane
          ref={composerRef}
          conversation={selected}
          onSend={(content) => selected && sendMessage(selected.id, content)}
          onEditMessage={(messageId, newContent) => selected && editMessage(selected.id, messageId, newContent)}
          onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
          isThinking={isThinking && thinkingConvId === selected?.id}
          onPauseThinking={pauseThinking}
        />
      </div>
    </div>
  );
}
