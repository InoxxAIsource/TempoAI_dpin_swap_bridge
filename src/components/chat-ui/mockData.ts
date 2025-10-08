import { makeId } from "./utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  editedAt?: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
  pinned: boolean;
  folder: string;
  messages: Message[];
}

export interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
}

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Marketing plan for launch",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    messageCount: 12,
    preview: "Drafting a 4-week GTM plan with channels, KPIs, and budget...",
    pinned: true,
    folder: "Work Projects",
    messages: [
      {
        id: makeId("m"),
        role: "user",
        content: "Draft a 4-week GTM plan.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: makeId("m"),
        role: "assistant",
        content: "Sure — phases, owners, risks, and KPIs coming up.",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString(),
      },
    ],
  },
  {
    id: "c2",
    title: "Research: vector databases vs RAG",
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    messageCount: 22,
    preview: "Compare pgvector, Milvus, and Weaviate. Cost + latency notes...",
    pinned: false,
    folder: "Code Reviews",
    messages: [],
  },
  {
    id: "c3",
    title: "Trip checklist – Paris with family",
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messageCount: 9,
    preview: "Packing list, museum tickets, metro pass options, and cafés...",
    pinned: false,
    folder: "Personal",
    messages: [],
  },
];

export const INITIAL_TEMPLATES: Template[] = [
  {
    id: "t1",
    name: "Product Review",
    content: "Please provide a detailed product review including pros, cons, and rating.",
    category: "Work",
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_FOLDERS: Folder[] = [
  { id: "f1", name: "Work Projects" },
  { id: "f2", name: "Code Reviews" },
  { id: "f3", name: "Personal" },
];
