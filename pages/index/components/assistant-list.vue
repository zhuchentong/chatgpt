<template>
  <div class="assistant-list flex space-x-5">
    <div
      v-for="assistant in store.assistants"
      class="assistant"
      @click="() => onChangeAssistant(assistant.id)"
    >
      <n-avatar
        round
        bordered
        :src="`/avatars/${assistant.avatar}.svg`"
        class="avatar"
        :class="{ active: store.activeAssistant === assistant.id }"
      />
    </div>
    <n-button
      strong
      secondary
      circle
      type="primary"
      class="button"
      @click="() => navigateTo('/assistant')"
    >
      <template #icon>
        <icon-park-outline:plus
          :style="{ color: '#fff' }"
        ></icon-park-outline:plus>
      </template>
    </n-button>
  </div>
</template>
<style lang="scss" scoped>
.assistant-list {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  margin: 0 150px;
}
.assistant {
  cursor: pointer;
  .avatar {
    display: inline-block;
    height: 50px;
    width: 50px;
    &.active {
      border-color: #17a058;
    }
  }
}

.button {
  height: 50px;
  width: 50px;
}
</style>
<script setup lang="ts">
import { useStore } from "~~/store";

const store = useStore();

function onChangeAssistant(id: string) {
  store.changeAssistant(id);
}
</script>
