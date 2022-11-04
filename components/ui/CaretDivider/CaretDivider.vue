<template>
  <div class="caret_divider">
    <TypographyText class="caret_text" size="xs">
      {{ text }}
      <div class="triangle"></div>
    </TypographyText>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<style scoped lang="less">
.caret_divider {
  border-bottom: 1px solid @red;
  position: relative;
  margin: 1.25rem 0;
  pointer-events: none;
  .caret_text {
    background: @red;
    border-radius: @corner-rounding-smaller;
    position: absolute;
    top: -9.5px;
    padding: 0 0.5rem;
    line-height: 20px;
    .glow-danger();

    .triangle {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 1px;
      top: 0px;
      transform: translate(50%, 0%) rotate(45deg) scale(0.7);
      border-radius: @corner-rounding-smaller;
      background: linear-gradient(45deg, transparent 40%, @red 41%);
    }
  }
}
</style>
