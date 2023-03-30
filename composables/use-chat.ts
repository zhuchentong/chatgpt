import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import { Chat } from "~~/interfaces";
import { useStore } from "~~/store";
import axios from "axios";
import { ChatRole } from "~~/config/enum.config";
import { keep } from "naive-ui/es/_utils";

let client: OpenAIApi;

export function createAPIClient(
  apiKey?: string,
  apiUrl?: string,
  apiProxy?: string
) {
  const store = useStore();
  const configuration = new Configuration({
    apiKey: store.OPENAI_KEY || apiKey,
    basePath: store.OPENAI_URL || apiUrl,
  });

  const getAxiosInstance = () => {
    const proxy = store.OPENAI_PROXY || apiProxy;
    if (proxy) {
      const url = new URL(proxy);
      return axios.create({
        baseURL: store.OPENAI_URL || apiUrl,
        timeout: 30000,
        proxy: {
          protocol: url.protocol,
          host: url.hostname,
          port: parseInt(url.port),
        },
      });
    }
  };

  client = new OpenAIApi(configuration, store.OPENAI_URL, getAxiosInstance());
  return client;
}

function appendChatMessage(
  chat: Chat,
  role: ChatRole,
  content: string,
  usage = 0
) {
  if (role === ChatRole.Assistant) {
    chat.inputing = false;
  }

  chat.records.push({
    role,
    content,
    datetime: Date.now(),
    usage,
  });

  chat.usage += usage;
}

function sendChatMessage(chat: Chat, keepContext = true) {
  const store = useStore();
  chat.inputing = true;

  client
    .createChatCompletion({
      model: store.OPENAI_MODEL,
      messages: chat.records
        .filter((record) => !record.deleted)
        // 关闭KeepContext后仅发送系统消息和最后一条用户消息
        .filter((record, index) =>
          keepContext
            ? true
            : record.role === ChatRole.System ||
              (record.role === ChatRole.User &&
                index === chat.records.length - 1)
        )
        .map((record) => ({
          role: record.role,
          content: record.content,
        })),
      temperature: 0,
      max_tokens: store.tokenLimit === 0 ? undefined : store.tokenLimit,
    })
    .then(({ data }) => {
      const {
        choices: [{ message }],
        usage,
      } = data;

      if (message) {
        appendChatMessage(
          chat,
          ChatRole.Assistant,
          message?.content,
          usage?.total_tokens
        );
      }
    })
    .catch(() => {
      chat.inputing = false;
    });
}

function sendSystemMessage() {
  if (!client) {
    createAPIClient();
  }

  const store = useStore();

  const assistant = store.currentAssistant;
  const chat = store.currentChat;

  if (!assistant || !chat) {
    return;
  }

  sendChatMessage(chat, assistant.keepContext);
}

function sendUserMessage(input: string) {
  if (!client) {
    createAPIClient();
  }

  const store = useStore();

  const assistant = store.currentAssistant;
  const chat = store.currentChat;

  if (!assistant || !chat) {
    return;
  }

  appendChatMessage(chat, ChatRole.User, input);
  sendChatMessage(chat, assistant.keepContext);
}

export function useChat() {
  return {
    createAPIClient,
    appendChatMessage,
    sendUserMessage,
    sendSystemMessage,
  };
}
