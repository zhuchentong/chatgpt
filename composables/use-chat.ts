import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import { Chat } from "~~/interfaces";
import { useStore } from "~~/store";
import axios from "axios";

let client: OpenAIApi;

export function createAPIClient(
  apiKey?: string,
  apuUrl?: string,
  apiProxy?: string
) {
  const store = useStore();
  const configuration = new Configuration({
    apiKey: store.OPENAI_KEY || apiKey,
  });

  const getAxiosInstance = () => {
    const proxy = store.OPENAI_PROXY || apiProxy;

    if (proxy) {
      const url = new URL(proxy);
      return axios.create({
        baseURL: store.OPENAI_URL || apuUrl,
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

function appendAssistantMessage(
  chat: Chat,
  response: CreateChatCompletionResponse
) {
  chat.inputing = false;

  const {
    choices: [data],
    usage,
  } = response;

  if (data.message?.content) {
    chat.records.push({
      role: "assistant",
      content: data.message?.content,
    });
  }

  chat.usage += usage?.total_tokens || 0;
}

function sendChatMessage(chat: Chat) {
  chat.inputing = true;

  client
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chat.records,
      temperature: 0,
    })
    .then(({ data }) => {
      if (data) {
        appendAssistantMessage(chat, data);
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

  sendChatMessage(chat);
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

  chat.records.push({
    role: "user",
    content: input,
  });

  sendChatMessage(chat);
}

export function useChat() {
  return {
    createAPIClient,
    sendUserMessage,
    sendSystemMessage,
  };
}
