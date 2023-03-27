<template>
  <div class="chat-list flex flex-col">
    <div class="actions flex justify-between items-center">
      <div
        class="flex items-center space-x-2 cursor-pointer"
        @click="store.toggleAssistantSettingShow()"
      >
        <n-avatar
          round
          bordered
          :src="`/avatars/${assistant.avatar}.svg`"
          class="avatar"
          :class="{ active: store.activeAssistant === assistant.id }"
        />
        <div>{{ assistant.name }}</div>
      </div>
      <div class="flex items-center">
        <n-button
          text
          class="w-20px h-20px"
          @click="store.toggleSystemSettingShow()"
        >
          <icon-park-outline:more-one
            class="w-20px h-20px"
          ></icon-park-outline:more-one>
        </n-button>
      </div>
    </div>
    <n-divider />
    <div class="space-y-2 flex flex-col items-start pl-10 flex-auto">
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
    <n-divider />
    <div class="space-y-2">
      <n-button block @click="onCreateChat">新建会话</n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-list {
  width: 250px;
  padding: 30px 20px 20px 20px;
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
