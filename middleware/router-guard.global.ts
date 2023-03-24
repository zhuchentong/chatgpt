import { Pinia } from "@pinia/nuxt/dist/runtime/composables";
import { useStore } from "~~/store";

export default defineNuxtRouteMiddleware((to) => {
  if (!process.client) {
    return;
  }
  const app = useNuxtApp();
  const store = useStore(app.$pinia as Pinia);
  console.log(store.OPENAI_KEY, to.meta.requireAuth);
  if (!store.OPENAI_KEY && to.meta.requireAuth !== false) {
    return navigateTo("/setup");
  }
});
