module.exports = {
  apps: [
    {
      name: "chatgpt-demo",
      port: "3000",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
