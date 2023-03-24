import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import { Chat } from "~~/interfaces";
import { useStore } from "~~/store";

let client: OpenAIApi;

function createAPIClient() {
  const store = useStore();
  const configuration = new Configuration({
    apiKey: store.OPENAI_KEY,
    basePath: store.OPENAI_URL,
  });

  client = new OpenAIApi(configuration);
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

export function useChat() {
  return {
    sendUserMessage,
    sendSystemMessage,
  };
}
