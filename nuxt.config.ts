import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/style.scss", "highlight.js/styles/github.css"],
  experimental: {
    reactivityTransform: true,
  },
  runtimeConfig: {
    OPENAI_KEY: process.env.OPENAI_KEY,
    OPENAI_URL: process.env.OPENAI_URL,
  },
  modules: ["@pinia/nuxt", "@unocss/nuxt"],
  unocss: {
    // presets
    uno: true, // enabled `@unocss/preset-uno`
    icons: true, // enabled `@unocss/preset-icons`
    attributify: true, // enabled `@unocss/preset-attributify`,

    // core options
    shortcuts: [],
    rules: [],
  },
  vite: {
    plugins: [svgLoader()],
  },
});
