<template>
  <div class="chat-box flex flex-col">
    <div class="chat-header-container">
      <ChatHeader></ChatHeader>
    </div>
    <div class="chat-record-container flex-auto relative">
      <div
        class="chat-record-list absolute inset-0 overflow-auto space-y-2"
        ref="record-list"
      >
        <div id="chat-content">
          <ChatRecord v-for="record in records" :record="record"></ChatRecord>
          <ChatRecord
            v-if="chat.inputing"
            :record="{ role: ChatRole.Assistant, content: '' }"
            inputing
          ></ChatRecord>
        </div>
      </div>
    </div>

    <div class="chat-input-container">
      <ChatInput></ChatInput>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.chat-box {
  flex: auto;
}
.chat-input-container {
  background-color: #f3f3f3;
}
</style>
<script setup lang="ts">
import { useStore } from "~~/store";
import ChatRecord from "./chat-record.vue";
import ChatInput from "./chat-input.vue";
import ChatHeader from "./chat-header.vue";
import { ChatRole } from "~~/config/enum.config";
const store = useStore();

const records = computed(() => {
  return store.currentChat.records.filter(
    (record) => record.role !== "system" && !record.deleted
  );
});

const recordListRef = $(templateRef<HTMLElement>("record-list"));

const chat = computed(() => store.currentChat);

watch(
  () => [records, chat.value.inputing],
  () => {
    nextTick(() => {
      recordListRef.scrollTop = recordListRef.scrollHeight;
    });
  }
);

onMounted(() => {
  nextTick(() => {
    recordListRef.scrollTop = recordListRef.scrollHeight;
  });
});
</script>
