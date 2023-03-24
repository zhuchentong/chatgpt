<template>
  <div class="chat-header flex justify-between items-center">
    <div class="title">
      <div v-if="editing" class="flex space-x-2">
        <n-input size="small" v-model:value="title" :maxlength="18"></n-input>
        <n-button
          text
          size="large"
          @click="() => ((chat.title = title), (editing = false))"
        >
          <icon-park-outline:check
            style="color: #17a058"
          ></icon-park-outline:check>
        </n-button>
      </div>
      <div v-else class="flex space-x-2">
        <div>{{ chat.title }}</div>
        <n-button text size="large" @click="() => (editing = true)">
          <icon-park-outline:edit></icon-park-outline:edit>
        </n-button>
      </div>
    </div>
    <div class="flex items-center">
      <n-button text size="large" @click="onClear">
        <icon-park-outline:clear></icon-park-outline:clear>
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-header {
  padding: 15px 20px;
  background-color: #f3f3f3;
}
</style>

<script setup lang="ts">
import { useStore } from "~~/store";

const store = useStore();
const chat = computed(() => store.currentChat);

const title = $ref(chat.value.title);
const editing = $ref(false);

function onClear() {
  store.clearChat();
}
</script>
