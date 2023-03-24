import { defineStore } from "pinia";
import { Assistant, AssistantOptions, Chat } from "~~/interfaces";

type State = {
  OPENAI_KEY: string;
  OPENAI_URL: string;
  assistants: Assistant[];
  activeAssistant: string;
  activeChat: string;
  customAssistants: Assistant[];
};

const initialState: State = {
  OPENAI_KEY: "",
  OPENAI_URL: "",
  assistants: [],
  activeAssistant: "",
  activeChat: "",
  customAssistants: [],
};

export const useStore = defineStore("app", {
  state: () => initialState,
  getters: {
    currentChat(): Chat {
      return this.currentAssistant.chats.find((x) => x.id === this.activeChat)!;
    },
    currentAssistant(): Assistant {
      console.log(this.assistants, this.activeAssistant);

      const a = this.assistants.find((x) => x.id === this.activeAssistant)!;
      console.log(1111, a, 333);
      return a;
    },
  },
  actions: {
    updateAPIKEY(value: string) {
      this.OPENAI_KEY = value;
    },
    updateAPIURL(value: string) {
      this.OPENAI_URL = value;
    },
    createAssistant(options: AssistantOptions) {
      const id = `ASSISTANT_${Math.random()
        .toString(32)
        .slice(2)
        .toUpperCase()}`;

      const assistant: Assistant = {
        id,
        chats: [],
        default: this.assistants.length === 0 && options.key === "default",
        ...options,
      };

      this.assistants.push(assistant);
      this.activeAssistant = id;

      this.createChat();
    },
    deleteAssistant() {},
    createChat() {
      const assistant = this.currentAssistant;
      const id = `ASSISTANT_${Math.random()
        .toString(32)
        .slice(2)
        .toUpperCase()}`;

      const chat: Chat = {
        id,
        title: "New Chat",
        usage: 0,
        inputing: false,
        records: [],
      };

      assistant.chats.push(chat);
      this.activeChat = id;

      if (assistant.prompt) {
        chat.records.push({
          role: "system",
          content: assistant.prompt,
        });
      }

      if (assistant.auto) {
        const { sendSystemMessage } = useChat();
        sendSystemMessage();
      }
    },
    deleteChat() {},
    clearChat() {
      this.currentChat.records = this.currentChat.records.filter(
        (record) => record.role === "system"
      );
    },
    changeChat(id: string) {
      this.activeChat = id;
    },
    changeAssistant(id: string) {
      const assistant = this.assistants.find((x) => x.id === id);
      const [chat] = assistant?.chats || [];
      this.activeAssistant = id;
      this.activeChat = chat.id;
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
