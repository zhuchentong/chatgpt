export interface ChatRecord {
  role: "assistant" | "user" | "system";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  inputing: boolean;
  usage: number;
  records: ChatRecord[];
}

export interface Assistant extends AssistantOptions {
  id: string;
  chats: Chat[];
  default?: boolean;
}

export interface AssistantOptions {
  key: string;
  avatar: string;
  name: string;
  prompt: string;
  auto: boolean;
}
