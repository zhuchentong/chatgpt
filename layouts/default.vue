<template>
  <n-config-provider
    :theme="isDarkTheme ? darkTheme : lightTheme"
    :theme-overrides="isDarkTheme ? darkThemeOverrides : lightThemeOverrides"
  >
    <n-dialog-provider>
      <n-message-provider>
        <slot></slot>
      </n-message-provider>
    </n-dialog-provider>
    <n-global-style />
  </n-config-provider>
</template>

<script setup lang="ts">
import { darkTheme, lightTheme } from "naive-ui";
import { useStore } from "~/store";

const store = useStore();
const isDarkTheme = computed(() => store.darkTheme);

const lightThemeOverrides = {
  common: {
    bodyColor: "#f3f3f3",
  },
  // ...
};

const darkThemeOverrides = {
  common: {
    bodyColor: "#101010",
  },
  // ...
};
</script>
