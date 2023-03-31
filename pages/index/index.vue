<template>
  <div>
    <div
      class="chat-container flex absolute inset-0 shadow-2xl overflow-hidden desktop:m-100px desktop:rounded-20px"
    >
      <ChatList class="desktop:block mobile:hidden"></ChatList>
      <ChatBox></ChatBox>
    </div>
    <div class="desktop:block mobile:hidden">
      <AssistantList></AssistantList>
    </div>
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
  background-color: v-bind("theme.bodyColor");
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
import { useThemeVars } from "naive-ui";

definePageMeta({
  middleware: ["default-assistant"],
});

const store = useStore();
const theme = useThemeVars();
</script>
