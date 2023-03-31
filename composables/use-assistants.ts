import { AssistantOptions } from "~~/interfaces";
import { assistants } from "~/config/assistants.config";

export function useAssistants(): AssistantOptions[] {
  assistants.forEach(
    (assistant, index) =>
      (assistant.avatar = `avatar-${(index % 51).toString().padStart(3, "0")}`)
  );

  return assistants;
}
