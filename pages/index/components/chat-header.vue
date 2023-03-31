<template>
  <div class="chat-header flex items-center justify-between space-x-5">
    <div class="title flex space-x-5">
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

    <div class="flex items-center space-x-2">
      <n-popover trigger="hover">
        <template #trigger>
          <n-button text size="large">
            <icon-park-outline:finance></icon-park-outline:finance>
          </n-button>
        </template>
        <span>已消耗Token: {{ chat.usage }}</span>
      </n-popover>

      <n-button text size="large" @click="onExport">
        <icon-park-outline:export></icon-park-outline:export>
      </n-button>

      <n-button text size="large" @click="onClear">
        <icon-park-outline:clear></icon-park-outline:clear>
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-header {
  padding: 15px 20px;
}
</style>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useStore } from "~~/store";

const { exportToPng } = useExport();
const store = useStore();
const chat = $(computed(() => store.currentChat));

const message = useMessage();
const title = $ref(chat.title);
const editing = $ref(false);

function onClear() {
  store.clearChat();
}

function onExport() {
  if (chat.records.filter((record) => !record.deleted).length == 0) {
    message.warning("暂无可导出的消息");
    return;
  }

  const element = document.getElementById("chat-content") as HTMLDivElement;
  exportToPng(element);
}
</script>
