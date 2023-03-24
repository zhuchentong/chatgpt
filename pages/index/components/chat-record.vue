<template>
  <div class="chat-record flex items-center space-x-5" :class="record.role">
    <div class="record-avatar">
      <n-avatar
        round
        :src="`/avatars/${assistant.avatar}.svg`"
        v-if="record.role === 'assistant'"
      ></n-avatar>
      <n-avatar round v-else>
        <icon-park:avatar></icon-park:avatar>
      </n-avatar>
    </div>
    <div class="record-content">{{ record.content }}</div>
  </div>
</template>
<style lang="scss" scoped>
.chat-record {
  padding: 0 10px;
  .record-content {
    max-width: 80%;
    border-radius: 10px;
    background-color: #5966f2;
    margin: 10px;
    padding: 10px;
    color: #fff;
    display: inline-block;
    line-height: 1.5;
  }

  &.user {
    justify-content: end;
    .record-content {
      order: 1;
    }
    .record-avatar {
      order: 2;
    }
  }
}
</style>
<script setup lang="ts">
import { ChatRecord } from "~~/interfaces";
import { useStore } from "~~/store";

defineProps<{
  record: ChatRecord;
}>();

const store = useStore();
const chat = computed(() => store.currentChat);
const assistant = computed(() => store.currentAssistant);
</script>
