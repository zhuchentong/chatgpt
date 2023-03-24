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

definePageMeta({
  middleware: ["default-assistant"],
});
</script>
