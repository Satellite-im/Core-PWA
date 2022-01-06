<template>
  <div class="message-loader">
    <div
v-for="i in count" :key="i"
class="message-loader-item"
>
      <div class="left">
        <div class="placeholder-profile" />
      </div>
      <div class="center">
        <div class="placeholder-item shortest" />
        <div class="placeholder-item" />
      </div>
      <div class="right">
        <div class="placeholder-item" />
        <div class="placeholder-item" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    count: {
      type: Number,
      default: 1,
    },
  },
})
</script>
<style scoped lang="less">
.message-loader {
  &:extend(.light-padding);
  .message-loader-item {
    &:extend(.full-width);
    display: flex;
    padding: 0.4rem 0.35rem;
  }

  .placeholder-profile {
    &:extend(.background-semitransparent-light);
    position: relative;
    overflow: hidden;
    width: 35px;
    height: 35px;
    border-radius: @full;
    margin-left: 0;
    margin-right: 0.75rem;

    &::before {
      &:extend(.full-width);
      content: '';
      display: block;
      position: absolute;
      left: -150px;
      top: 0;
      height: @full;
      background: linear-gradient(
        to right,
        transparent 0%,
        @semitransparent-lightest-gradient @half,
        transparent @full
      );
      animation: loadreverse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  .center {
    width: 60%;
  }
  .right {
    .placeholder-item {
      width: 36px;
      height: 28px;
    }
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .placeholder-item {
    &:extend(.background-semitransparent-light);
    border-radius: 2px;
    height: 24px;
    position: relative;
    overflow: hidden;
    margin-left: 0.5rem;
    margin-bottom: 0.6rem;

    &.shortest {
      height: 15px;
      width: 70%;
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: -150px;
      top: 0;
      height: @full;
      width: 75%;
      background: linear-gradient(
        to right,
        transparent 0%,
        @semitransparent-lightest-gradient @half,
        transparent @full
      );
      animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  overflow: hidden;
}
</style>
