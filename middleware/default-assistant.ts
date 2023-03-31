import { Pinia } from "@pinia/nuxt/dist/runtime/composables";
import { AssistantOptions } from "~~/interfaces";
import { useStore } from "~~/store";

const defaultAssistant: AssistantOptions = {
  avatar: "avatar-000",
  name: "智能助手",
  prompt: "",
  auto: true,
};

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) {
    return;
  }

  const app = useNuxtApp();
  const store = useStore(app.$pinia as Pinia);

  if (store.assistants.length === 0) {
    store.createAssistant(defaultAssistant, true);
  }
});
