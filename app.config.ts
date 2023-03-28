console.log(`version: 12`);
export default defineAppConfig(() => ({
  OPENAI_URL: process.env.OPENAI_URL,
}));
