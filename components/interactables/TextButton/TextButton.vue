<template>
  <button class="text-button" v-bind="$attrs">
    <TypographyText>
      <slot />
    </TypographyText>
  </button>
</template>

<script lang="ts"></script>

<style lang="less" scoped>
.text-button {
  font-style: italic;
  white-space: nowrap;
  color: @text-muted;
  transition: @animation-speed-long ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}
</style>
