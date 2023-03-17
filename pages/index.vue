<template>
  <div class="chat-container flex flex-col absolute inset-0 p-2 space-y-5">
    <div class="chatbox-container flex-auto relative">
      <div class="absolute inset-0 overflow-auto">
        <div
          class="chat-record-wrapper"
          v-for="record in chats"
          :class="[record.role]"
        >
          <span class="chat-record">
            {{ record.content }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="inputbox-container flex items-center space-x-2"
      @keydown.enter.prevent="submit"
    >
      <button class="inputbox-clear" @click="() => (chats = [])">
        <CleanSvg style="width: 40px; height: 40px"></CleanSvg>
      </button>
      <input
        class="inputbox flex-auto"
        contenteditable
        placeholder=" 请输入你想提问的问题吧"
        v-model="input"
      />
      <button class="inputbox-submit" @click="submit">
        <SubmitSvg style="width: 25px; height: 25px"></SubmitSvg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
    border-radius: 30px;
    height: 50px;
    padding: 0 10px;
    margin: 0;
    border: solid 2px #a4c6f8;
    font-size: 16px;
    outline: none;
    color: #fff;
  }
  .inputbox-submit {
    cursor: pointer;
    width: 40px;
    height: 40px;
    background-color: transparent;
    color: #fff;
    border-radius: 10px;
    border: none;
    position: absolute;
    right: 16px;
    background-color: #208cec;
    border-radius: 50%;
    padding-top: 5px;

    svg {
      fill: #fff;
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
      border-radius: 10px;
      background-color: #5966f2;
      margin: 10px;
      padding: 10px;
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
import CleanSvg from "@/assets/svgs/clean.svg?component";
import SubmitSvg from "@/assets/svgs/submit.svg?component";

interface chatRecord {
  role: "user" | "assistant";
  content: string;
}

let input = $(useState<string>("input"));
let chats = $(useState<chatRecord[]>("chats", () => []));
let response = $(useState("counter", () => "1000"));

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
      sse.close();
    } else {
      appendChatMessage(event.data);
    }
  };

  input = "";
}

onMounted(() => {});
</script>
