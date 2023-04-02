import svgLoader from "vite-svg-loader";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import iconsResolver from "unplugin-icons/resolver";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  head: {
    title: "ChatGPT Client",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    scripts: [],
  },
  components: {
    global: true,
    dirs: ["~/components"],
  },
  css: ["@/assets/style.scss", "highlight.js/styles/github.css"],
  experimental: {
    reactivityTransform: true,
  },
  appConfig: {
    OPENAI_URL: process.env.OPENAI_URL,
  },
  modules: [
    "@pinia/nuxt",
    "@unocss/nuxt",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    [
      "unplugin-icons/nuxt",
      {
        autoInstall: true,
      },
    ],
  ],
  unocss: {
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,
    shortcuts: [],
    rules: [],
    theme: {
      breakpoints: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        mobile: "320px",
        desktop: "768px",
      },
    },
  },
  ssr: true,
  build: {
    transpile: ["vueuc"], // fix dev error: Cannot find module 'vueuc'
  },
  vite: {
    plugins: [
      svgLoader(),
      Components({
        resolvers: [
          NaiveUiResolver(),
          iconsResolver({
            prefix: "icon",
            alias: {
              park: "icon-park",
              "park-outline": "icon-park-outline",
            },
            enabledCollections: ["icon-park", "icon-park-outline"],
          }),
        ], // Automatically register all components in the `components` directory
      }),
    ],
    ssr: {
      noExternal: [
        "moment",
        "naive-ui",
        "@juggle/resize-observer",
        "@css-render/vue3-ssr",
      ],
    },
  },
});
