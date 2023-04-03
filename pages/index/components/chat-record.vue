<template>
  <div class="text-center message-date" v-if="messageDate">
    {{ messageDate }}
  </div>
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

    <div class="record-content inputing" v-if="inputing">
      <div class="loading">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div
      v-else
      @click="onRecordCopy"
      class="record-content"
      v-html="marked.parse(record.content)"
    ></div>
    <div class="m-0! delete hidden">
      <n-button
        v-if="!inputing"
        text
        size="small"
        class="w-14px h-14px"
        @click="() => (record.deleted = true)"
      >
        <icon-park-outline:delete></icon-park-outline:delete>
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.message-date {
  font-size: 12px;
  color: #7f7f7f;
  padding: 5px;
}

.chat-record {
  padding: 0 10px;
  .record-content {
    max-width: 75%;
    border-radius: 10px;
    background-color: #5966f2;
    margin: 10px;
    padding: 0px 10px;
    color: #fff;
    display: inline-block;
    line-height: 1.5;
  }

  &:hover {
    .delete {
      display: block;
    }
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

.loading,
.loading > div {
  position: relative;
  box-sizing: border-box;
}

.loading {
  display: block;
  font-size: 0;
  color: #000;
  margin: 10px;

  div {
    width: 10px;
    height: 10px;
    margin: 4px;
    border-radius: 100%;
    animation: ball-beat 0.7s -0.15s infinite linear;

    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
  }
}
.loading > div:nth-child(2n-1) {
  animation-delay: -0.5s;
}

@keyframes ball-beat {
  50% {
    opacity: 0.2;
    transform: scale(0.75);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
<script setup lang="ts">
import { ChatRecord } from "~~/interfaces";
import { useStore } from "~~/store";
import dayjs, { Dayjs } from "dayjs";
import { marked } from "marked";
import hljs from "highlight.js";
import { useMessage } from "naive-ui";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(isToday);

const props = defineProps<{
  index?: number;
  record: ChatRecord;
  inputing?: boolean;
}>();

const store = useStore();
const chat = $(computed(() => store.currentChat));
const assistant = computed(() => store.currentAssistant);
const message = useMessage();

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  },
});

function onRecordCopy({ target }: MouseEvent) {
  const element = target as HTMLElement;
  if (element.tagName !== "PRE") {
    return;
  }

  const code = element.querySelector("code");

  if (code?.innerText) {
    navigator.clipboard.writeText(code.innerText);
    message.info("已复制到粘贴板");
  }
}

const messageDate = computed(() => {
  if (props.index === undefined || !props.record.datetime) {
    return "";
  }

  const [last] = chat.records
    .filter((record) => !record.deleted)
    .slice(0, props.index)
    .reverse();

  const date = dayjs(props.record.datetime);

  if (
    last &&
    last.datetime &&
    (props.record.datetime - last.datetime) / 1000 <= 120
  ) {
    return "";
  }

  if (date.isToday()) {
    return date.format("hh:mm");
  } else {
    return date.format("YYYY-MM-DD hh:mm");
  }
});
</script>
