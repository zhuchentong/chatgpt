import { AssistantOptions } from "~~/interfaces";

export function useAssistants(): AssistantOptions[] {
  const modules = import.meta.glob<any, any>("../assistants/*.assistant.ts", {
    eager: true,
  });

  return Object.values(modules).map((module: any) => module.default);
}
