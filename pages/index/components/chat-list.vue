<template>
  <div class="chat-list">
    <div class="space-y-2">
      <n-button block @click="onCreateChat">新建会话</n-button>
    </div>
    <n-divider />
    <div class="space-y-2 flex flex-col items-start pl-10">
      <n-button
        @click="() => onChangeChat(chat.id)"
        text
        v-for="chat in assistant.chats"
        :type="store.activeChat === chat.id ? 'primary' : 'default'"
      >
        <template #icon>
          <icon-park-outline:message-one></icon-park-outline:message-one>
        </template>
        <span>{{ chat.title }}</span>
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-list {
  width: 250px;
  padding: 30px 20px;
  background-color: #f3f3f3;
  // background-color: red;
}
</style>
<script setup lang="ts">
import { useStore } from "~~/store";

const store = useStore();

const assistant = computed(() => store.currentAssistant);

function onCreateChat() {
  store.createChat();
}

function onChangeChat(id: string) {
  store.changeChat(id);
}
</script>
