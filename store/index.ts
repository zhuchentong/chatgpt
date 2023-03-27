import { defineStore } from "pinia";
import { Assistant, AssistantOptions, Chat } from "~~/interfaces";

type State = {
  OPENAI_KEY: string;
  OPENAI_URL: string;
  OPENAI_PROXY: string;
  assistantSettingShow: boolean;
  systemSettingShow: boolean;
  assistants: Assistant[];
  activeAssistant: string;
  activeChat: string;
  customAssistants: Assistant[];
};

const initialState: State = {
  OPENAI_KEY: "",
  OPENAI_URL: "",
  OPENAI_PROXY: "",
  assistantSettingShow: false,
  systemSettingShow: false,
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
      return this.assistants.find((x) => x.id === this.activeAssistant)!;
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
    deleteAssistant(id: string) {
      const target = this.assistants.find((x) => x.default);

      this.changeAssistant(target?.id!);

      this.assistants = this.assistants.filter((x) => x.id !== id);
    },
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
      let content = "";

      if (assistant.prompt) {
        content = assistant.prompt;
      }

      if (content) {
        chat.records.push({
          role: "system",
          content,
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
    toggleAssistantSettingShow() {
      this.assistantSettingShow = !this.assistantSettingShow;
    },
    toggleSystemSettingShow() {
      this.systemSettingShow = !this.systemSettingShow;
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
