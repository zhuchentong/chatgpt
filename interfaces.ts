export interface ChatRecord {
  role: "assistant" | "user" | "system";
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  inputing: boolean;
  usage: number;
  records: ChatRecord[];
}

export interface Assistant extends AssistantOptions {
  id: string;
  chats: Chat[];
  default?: boolean;
}

export interface AssistantOptions {
  /**
   * 唯一主键
   */
  key: string;
  /**
   * 头像 avatar-000 - avatar-050
   */
  avatar: string;
  /**
   * 显示名称
   */
  name: string;
  /**
   * 提示词
   */
  prompt: string;
  /**
   * 主动聊天
   */
  auto: boolean;
  /**
   * 输入提示
   */
  placeholder?: string;
  /**
   * 示例
   */
  examples?: string[];
}
