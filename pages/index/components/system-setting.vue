<template>
  <n-form ref="form">
    <n-form-item label="model">
      <n-select
        :value="store.OPENAI_MODEL"
        placeholder="选择Model"
        :options="models"
        @update:value="onChangeModel"
      />
    </n-form-item>
    <n-form-item label="Token Limit (0:不限制,最小1000)">
      <n-input-number
        :update-value-on-input="false"
        :show-button="false"
        :min="0"
        :value="store.tokenLimit"
        @change="onChangeLimit"
      >
        <template #suffix>
          <icon-park-outline:finance></icon-park-outline:finance>
        </template>
      </n-input-number>
    </n-form-item>
    <n-form-item label="主题">
      <n-switch :value="store.darkTheme" @change="store.toggleDarkTheme">
        <template #checked> 深色 </template>
        <template #unchecked> 浅色 </template>
      </n-switch>
    </n-form-item>
  </n-form>
</template>
<style lang="scss"></style>
<script setup lang="ts">
import { FormInst, useMessage } from "naive-ui";
import { useStore } from "~~/store";

const { OPENAI_URL } = useAppConfig();
const message = useMessage();
const store = useStore();
const form = $(templateRef<FormInst>("form"));

const models = [
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-0301",
  "gpt-4",
  "gpt-4-0314",
  "gpt-4-32k",
].map((v) => ({
  label: v,
  value: v,
}));

function onChangeModel(value: string) {
  store.updateAPIMODEL(value);
}

function onChangeLimit(value: unknown) {
  if (value == 0 || (value as number) >= 1000) {
    store.updateTokenLimit(value as number);
  }
}
</script>
