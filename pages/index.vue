<template>
  <div class="flex flex-col absolute inset-0 p-10 space-y-10">
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
      class="inputbox-container flex items-center space-x-2 m-x-5"
      @keydown.enter.prevent="submit"
    >
      <input
        class="inputbox flex-auto"
        contenteditable
        placeholder="test"
        v-model="input"
      />
      <button class="inputbox-submit" @click="submit">提交</button>
      <button class="inputbox-clear" @click="() => (chats = [])">清除</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inputbox-container {
  .inputbox {
    height: 50px;
    padding: 0 10px;
    margin: 0;
    border-color: #5966f2;
    font-size: 16px;
    outline: none;
  }
  .inputbox-submit {
    width: 200px;
    height: 50px;
    background-color: #5966f2;
    color: #fff;
    border-radius: 10px;
    border: none;
  }
  .inputbox-clear {
    width: 50px;
    height: 50px;
    background-color: #f2a266;
    color: #fff;
    border-radius: 10px;
    border: none;
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
