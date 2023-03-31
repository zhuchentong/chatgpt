<template>
  <div class="page-container flex absolute inset-0 space-y-5 shadow-2xl">
    <div class="actions p-5">
      <n-button text class="w-40px h-40px" @click="() => router.back()">
        <icon-park-outline:arrow-circle-left
          class="w-40px h-40px"
        ></icon-park-outline:arrow-circle-left>
      </n-button>
    </div>
    <div class="flex-auto relative">
      <div class="absolute inset-0 overflow-auto px-10 pb-10">
        <div class="mb-5">
          <n-input v-model:value="input" placeholder="搜索你想要的助理">
            <template #suffix>
              <icon-park-outline:search></icon-park-outline:search>
            </template>
          </n-input>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3" class="flex-auto">
          <n-grid-item v-for="(assistant, index) in dataSource">
            <div
              class="assistant-item space-y-4"
              :style="{
                backgroundColor: `rgb(${10 * Math.random()},${
                  132 * Math.random()
                },${255 * Math.random()})`,
              }"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <n-avatar
                    round
                    bordered
                    :src="`/avatars/${assistant.avatar}.svg`"
                  ></n-avatar>
                  <div>{{ assistant.name }}</div>
                </div>
                <div>
                  <n-popconfirm
                    positive-text="确定"
                    negative-text="取消"
                    @positive-click="() => onCreateAssistant(assistant)"
                  >
                    <template #trigger>
                      <n-button
                        circle
                        class="w-30px h-30px"
                        text-color="#fff"
                        @click=""
                      >
                        <icon-park-outline:plus></icon-park-outline:plus>
                      </n-button>
                    </template>
                    <div>添加 {{ assistant.name }} 作为我的小助理</div>
                  </n-popconfirm>
                </div>
              </div>
              <div class="prompt">
                {{
                  assistant.prompt ||
                  "我是一个智能助手,我会按照您的要求去回答提问."
                }}
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  margin: 100px;
  border-radius: 20px;
  background-color: v-bind("theme.bodyColor");
}

.actions {
  width: 40px;
}

.assistant-item {
  cursor: pointer;
  height: 150px;
  border-radius: 10px;
  padding: 20px;
  color: #fff;
}

.prompt {
  font-size: 12px;
  text-indent: 2em;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import { AssistantOptions } from "~~/interfaces";
import { useStore } from "~~/store";

const router = useRouter();
const store = useStore();
const assistants = useAssistants();
const theme = useThemeVars();
const input = $ref("");

const dataSource = computed(() =>
  assistants.filter((assistant) =>
    input ? assistant.name.includes(input) : true
  )
);

function onCreateAssistant(assistant: AssistantOptions) {
  store.createAssistant(assistant);
  navigateTo("/");
}
</script>
