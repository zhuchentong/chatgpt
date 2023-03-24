import { Pinia } from "@pinia/nuxt/dist/runtime/composables";
import { useStore } from "~~/store";

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) {
    return;
  }

  const app = useNuxtApp();
  const store = useStore(app.$pinia as Pinia);

  if (store.assistants.length === 0) {
    const assistants = useAssistants();
    const assistant = assistants.find((x) => x.key === "default");
    store.createAssistant(assistant!);
  }
});
