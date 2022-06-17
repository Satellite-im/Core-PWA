<template>
  <div class="message-loader">
    <div v-for="i in count" :key="i" class="message-loader-item">
      <div class="left">
        <div class="placeholder-profile" />
      </div>
      <div class="right">
        <div class="placeholder-item shortest" />
        <div class="placeholder-item" />
        <div class="placeholder-item bigger" />
        <div class="placeholder-item shorter" />
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
  .message-loader-item {
    &:extend(.full-width);
    display: flex;
  }

  .placeholder-profile {
    position: relative;
    overflow: hidden;
    width: 35px;
    height: 35px;
    border-radius: @full;
    background: rgba(36, 40, 57, 0.5);
    margin-top: 0.5rem;
    margin-right: 0.3rem;
    margin-left: 0;

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: -150px;
      top: 0;
      height: @full;
      &:extend(.full-width);
      background: linear-gradient(
        to right,
        transparent 0%,
        rgba(34, 44, 63, 0.5) @half,
        transparent @full
      );
      animation: loadreverse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  .right {
    &:extend(.full-width);
  }
  .placeholder-item {
    border-radius: 2px;
    height: 30px;
    position: relative;
    overflow: hidden;
    background: rgba(36, 40, 57, 0.5);
    margin: 0.5rem;

    &.bigger {
      height: 55px;
    }

    &.shorter {
      width: 73%;
    }

    &.shortest {
      height: 15px;
      width: 30%;
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
        rgba(34, 44, 63, 0.5) @half,
        transparent @full
      );
      animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
}
</style>
