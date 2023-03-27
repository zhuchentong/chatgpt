<template>
  <n-form ref="form" :model="formModel" :rules="formRules">
    <n-form-item path="apikey" label="助手名称">
      <n-input v-model:value="formModel.name" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="apiurl" label="Prompt">
      <n-input
        type="textarea"
        rows="10"
        readonly
        v-model:value="formModel.prompt"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item>
      <div class="w-full space-y-2">
        <n-button type="primary" block @click="onSubmit">确定</n-button>

        <n-popconfirm
          icon="warning"
          placement="bottom"
          positive-text="确定"
          negative-text="取消"
          @positive-click="onDelete"
          v-if="!assistant.default"
        >
          <template #trigger>
            <n-button type="error" block> 删除 </n-button>
          </template>
          <div>确定删除小助理 {{ assistant.name }}</div>
        </n-popconfirm>
      </div>
    </n-form-item>
  </n-form>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import { FormInst, useMessage } from "naive-ui";
import { Configuration, OpenAIApi } from "openai";
import { useStore } from "~~/store";

const message = useMessage();
const store = useStore();
const form = $(templateRef<FormInst>("form"));

const assistant = computed(() => store.currentAssistant);

let formModel = reactive({
  name: assistant.value.name,
  prompt: assistant.value.prompt,
});

const formRules = {
  name: {
    required: true,
  },
};

function onSubmit() {
  form.validate((errors) => {
    if (errors) {
      return;
    }

    assistant.value.name = formModel.name;

    store.toggleAssistantSettingShow();
  });
}

function onDelete() {
  store.deleteAssistant(assistant.value.id);
  store.toggleAssistantSettingShow();
}
</script>
