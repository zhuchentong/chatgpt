<template>
  <div class="chat-input">
    <div class="toolbar"></div>
    <div class="input-container p-5 flex items-end">
      <n-input
        v-model:value="inputText"
        class="flex-auto"
        :placeholder="assistant.placeholder || '请输入消息'"
        type="textarea"
        @keypress.exact.enter.stop.prevent="onSubmit"
        :autosize="{
          minRows: 1,
          maxRows: 5,
        }"
      />
      <n-button text class="w-50px h-35px" size="large" @click="onSubmit">
        <template #icon>
          <icon-park-outline:send></icon-park-outline:send>
        </template>
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup lang="ts">
import { useStore } from "~~/store";

const store = useStore();
const { sendUserMessage } = useChat();
let inputText = $ref("");
const assistant = computed(() => store.currentAssistant);

function onSubmit() {
  if (!inputText) {
    return;
  }

  sendUserMessage(inputText);
  inputText = "";
}
</script>
