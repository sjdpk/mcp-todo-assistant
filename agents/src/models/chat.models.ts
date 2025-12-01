export type Sender = "user" | "agent" | "system";

export interface ChatThread {
  id: string;
  userId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  sender: Sender;
  category: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
