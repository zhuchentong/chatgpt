<template>
  <div class="page-container flex justify-center items-center">
    <n-card class="form-container" title="设置">
      <n-form ref="form" :model="formModel" :rules="formRules">
        <n-form-item path="apikey" label="OPENAI APIKEY">
          <n-input v-model:value="formModel.apikey" @keydown.enter.prevent />
        </n-form-item>
        <n-form-item path="apiurl" label="OPENAI URL">
          <n-input v-model:value="formModel.apiurl" @keydown.enter.prevent />
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

.form-container {
  width: 40%;
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

definePageMeta({
  requireAuth: false,
});

let formModel = reactive({
  apikey: store.OPENAI_KEY,
  apiurl: store.OPENAI_URL || OPENAI_URL,
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
  const configuration = new Configuration({
    apiKey: formModel.apikey,
    basePath: formModel.apiurl,
  });

  const openai = new OpenAIApi(configuration);

  return openai.listFineTunes();
}
</script>
