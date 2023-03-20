<template>
  <div
    class="chat-container flex flex-col absolute inset-0 p-2 space-y-5 shadow-2xl"
  >
    <div class="chatbox-container flex-auto relative">
      <div class="absolute inset-0 overflow-auto">
        <div
          class="chat-record-wrapper"
          v-for="record in chats"
          :class="[record.role]"
        >
          <span
            @click="onClickRecord"
            class="chat-record"
            v-html="marked.parse(formatContent(record.content))"
          >
          </span>
        </div>
      </div>
    </div>
    <div class="inputbox-container flex items-end space-x-2">
      <button class="inputbox-clear" @click="() => (chats = [])">
        <CleanSvg style="width: 35px; height: 35px"></CleanSvg>
      </button>
      <div class="inputbox flex-auto">
        <textarea
          @keydown.enter.exact.prevent="submit"
          :style="{
            minHeight: height,
          }"
          ref="textarea"
          placeholder=" 请输入你想提问的问题吧"
          v-model="input"
          rows="1"
        ></textarea>
      </div>
      <button class="inputbox-submit" @click="submit" :class="{ loading }">
        <SubmitSvg style="width: 20px; height: 20px"></SubmitSvg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@keyframes loading {
  /*以百分比来规定改变发生的时间 也可以通过"from"和"to",等价于0% 和 100%*/
  0% {
    /*rotate(2D旋转) scale(放大或者缩小) translate(移动) skew(翻转)*/
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.chat-container {
  margin: 100px;
  background-color: #181818;
  border-radius: 20px;
  padding: 10px;
}

@media (max-width: 800px) {
  .chat-container {
    margin: unset;
    border-radius: 0;
  }
}

.inputbox-container {
  .inputbox {
    background-color: transparent;
    border-radius: 10px;
    max-height: 300px;
    padding: 0 10px;
    margin: 0;
    border: solid 2px #a4c6f8;
    padding-right: 50px;

    textarea {
      box-sizing: border-box;
      vertical-align: baseline;
      line-height: 1.5;
      // padding: 10px 0px;
      font-size: 16px;
      padding: 10px 0;
      background-color: transparent;
      border: none;
      resize: none;
      width: 100%;
      outline: none;
      color: #fff;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .inputbox-submit {
    cursor: pointer;
    width: 35px;
    height: 35px;
    background-color: transparent;
    color: #fff;
    border-radius: 10px;
    border: none;
    position: absolute;
    right: 16px;
    bottom: 17px;
    background-color: #208cec;
    border-radius: 50%;
    padding-top: 5px;

    svg {
      fill: #fff;
    }

    &.loading {
      animation: loading 3s linear infinite;
    }
  }
  .inputbox-clear {
    cursor: pointer;
    width: 50px;
    height: 50px;
    background-color: transparent;
    color: #fff;
    border-radius: 10px;
    border: none;

    svg {
      fill: #f2a266;
    }
  }
}

.chatbox-container {
  .chat-record-wrapper {
    .chat-record {
      max-width: 80%;
      border-radius: 10px;
      background-color: #5966f2;
      margin: 10px;
      padding: 0 10px;
      color: #fff;
      display: inline-block;
    }

    &.assistant {
      text-align: left;
    }
    &.user {
      text-align: right;
    }
  }
}
</style>

<script lang="ts" setup>
import { marked } from "marked";
import hljs from "highlight.js";
import CleanSvg from "@/assets/svgs/clean.svg?component";
import SubmitSvg from "@/assets/svgs/submit.svg?component";

marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
});

interface chatRecord {
  role: "user" | "assistant";
  content: string;
}

let loading = $ref(false);
let textarea = $ref<HTMLElement>();
let height = $ref("40px");
let input = $(useState<string>("input"));
let chats = $(useState<chatRecord[]>("chats", () => []));
let response = $(useState("counter", () => "1000"));

watch(
  () => input,
  () => {
    height = `${(textarea?.scrollHeight || 0) - 20}px`;
  }
);
function formatContent(content: string) {
  const count = content.match(/(^|[^`])(```)/g)?.length;
  if (count && count % 2 === 1) {
    switch (true) {
      case content.endsWith("```"):
        return content.replace(/```$/g, "");
      case !content.endsWith("`"):
        return content + "\r```";
      default:
        return content.replace(/\`{1,2}$/g, "```");
    }
  } else {
    return content;
  }
}

function onClickRecord({ target }: MouseEvent) {
  const element = target as HTMLElement;
  if (element.tagName !== "PRE") {
    return;
  }

  const code = element.querySelector("code");

  if (code?.innerText) {
    navigator.clipboard.writeText(code.innerText);
  }
}

// function appendCodeCopy() {
//   document
//     .querySelectorAll("pre")
//     .forEach((pre) => pre.addEventListener(() => {}));
// }

function appendChatMessage(data: any) {
  try {
    const [
      {
        delta: { content },
      },
    ] = JSON.parse(data).choices;

    if (content) {
      chats[chats.length - 1].content += content;
    }
  } catch (ex) {}
}

function submit() {
  if (!input || input.length < 5 || loading === true) {
    return;
  }

  loading = true;

  chats.push({
    role: "user",
    content: input,
  });

  const sse = new EventSource(
    `/api/openai?messages=${encodeURIComponent(JSON.stringify(chats))}`,
    {}
  );

  sse.onopen = () => {
    response = "";

    chats.push({
      role: "assistant",
      content: response,
    });
  };

  sse.onmessage = (event) => {
    if (event.data === "[DONE]") {
      loading = false;
      sse.close();
    } else {
      appendChatMessage(event.data);
    }
  };

  sse.onerror = () => {
    loading = false;
  };

  input = "";
}
</script>
