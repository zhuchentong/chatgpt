<template>
  <div>
    <div
      class="chat-container flex absolute inset-0 shadow-2xl overflow-hidden"
    >
      <ChatList></ChatList>
      <ChatBox></ChatBox>
    </div>
    <AssistantList></AssistantList>
  </div>
  <n-drawer
    v-model:show="store.assistantSettingShow"
    :width="400"
    placement="right"
  >
    <n-drawer-content title="助手设置">
      <AssistantSetting></AssistantSetting>
    </n-drawer-content>
  </n-drawer>
  <n-drawer
    v-model:show="store.systemSettingShow"
    :width="400"
    placement="right"
  >
    <n-drawer-content>
      <n-tabs>
        <n-tab-pane name="API设置"> <APISetting></APISetting></n-tab-pane>
        <n-tab-pane name="系统设置">
          <SystemSetting></SystemSetting
        ></n-tab-pane>
      </n-tabs>
    </n-drawer-content>
  </n-drawer>
</template>
<style lang="scss" scoped>
.chat-container {
  margin: 100px;
  background-color: #fff;
  border-radius: 20px;
}
</style>
<script setup lang="ts">
import AssistantList from "./components/assistant-list.vue";
import ChatList from "./components/chat-list.vue";
import ChatBox from "./components/chat-box.vue";
import { useStore } from "~~/store";
import AssistantSetting from "./components/assistant-setting.vue";
import SystemSetting from "./components/system-setting.vue";
import APISetting from "./components/api-setting.vue";

definePageMeta({
  middleware: ["default-assistant"],
});

const store = useStore();
</script>
