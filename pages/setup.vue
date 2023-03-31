<template>
  <div class="page-container flex justify-center items-center">
    <n-card class="form-container desktop:w-40% mobile:w-90%" title="设置">
      <n-form ref="form" :model="formModel" :rules="formRules">
        <n-form-item path="apikey" label="APIKEY">
          <n-input
            v-model:value="formModel.apikey"
            @keydown.enter.prevent
            placeholder="请输入OPENAI APIKEY"
          />
        </n-form-item>
        <n-form-item path="apiurl" label="API域名">
          <n-input
            v-model:value="formModel.apiurl"
            @keydown.enter.prevent
            placeholder="请输入OPENAI API域名"
          />
        </n-form-item>
        <n-form-item
          path="apiurl"
          label="代理URL(可选)"
          :show-require-mark="false"
        >
          <n-input
            v-model:value="formModel.proxyurl"
            @keydown.enter.prevent
            placeholder="请输入代理URL"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" block @click="onSubmit">确定</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
<style lang="scss">
.page-container {
  position: absolute;
  inset: 0;
}
</style>
<script setup lang="ts">
import { FormInst, useMessage } from "naive-ui";
import { Configuration, OpenAIApi } from "openai";
import { useStore } from "~~/store";

const { OPENAI_URL } = useAppConfig();
const message = useMessage();
const store = useStore();
const form = $(templateRef<FormInst>("form"));
const { createAPIClient } = useChat();

definePageMeta({
  requireAuth: false,
});

let formModel = reactive({
  apikey: store.OPENAI_KEY,
  apiurl: store.OPENAI_URL || OPENAI_URL,
  proxyurl: store.OPENAI_PROXY || "",
});

const formRules = {
  apikey: {
    required: true,
  },
  apiurl: {
    required: true,
  },
};

function onSubmit() {
  form.validate((errors) => {
    if (errors) {
      return;
    }

    validateApiKey()
      .then(() => {
        store.updateAPIKEY(formModel.apikey);
        store.updateAPIURL(formModel.apiurl);
        message.success("验证成功");
        navigateTo("/");
      })
      .catch(() => {
        message.error("验证失败");
      });
  });
}

async function validateApiKey() {
  const openai = createAPIClient(
    formModel.apikey,
    formModel.apiurl,
    formModel.proxyurl
  );

  return openai.listFineTunes();
}
</script>
