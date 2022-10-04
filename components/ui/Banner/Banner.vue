<template>
  <div class="banner" :class="{ tall: !!$slots.content }">
    <div class="header">
      <slot name="icon"></slot>

      <TypographyText color="warning" size="sm">
        <slot name="header"></slot>
      </TypographyText>
    </div>

    <TypographyText
      v-show="!!$slots.content"
      font="heading"
      color="warning"
      class="content"
    >
      <slot name="content"></slot>
    </TypographyText>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.banner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  user-select: none;
  &:extend(.background-semitransparent-light);
  &:extend(.round-corners);

  &.tall {
    padding: 12px;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    text-align: center;
    &:extend(.color-warning);
  }

  .content {
    text-align: center;
    font-size: 0.7rem;
  }
}
</style>
