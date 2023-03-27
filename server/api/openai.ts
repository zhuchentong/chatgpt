import { Configuration, OpenAIApi } from "openai";

export default defineEventHandler(async (event) => {
  const isDevelopment = import.meta.env.NODE_ENV === "development";
  const { OPENAI_KEY, OPENAI_URL } = useRuntimeConfig();

  const { messages } = getQuery(event);

  const configuration = new Configuration({
    apiKey: OPENAI_KEY,
    basePath: OPENAI_URL,
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: JSON.parse(decodeURIComponent(messages! as string)),
      temperature: 0,
      max_tokens: 1000,
    },
    { responseType: "stream" }
  );
  setResponseHeader(event, "Content-Type", "text/event-stream");
  return sendStream(event, response.data);
});
