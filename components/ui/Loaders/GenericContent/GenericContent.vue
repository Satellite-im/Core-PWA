<template>
  <div class="message-loader">
    <div v-for="i in count" :key="i" class="message-loader-item">
      <div class="right">
        <div class="placeholder-item" />
        <div class="placeholder-item bigger" />
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
    &:extend(.background-semitransparent-light);
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
        @midground-alt @half,
        transparent @full
      );
      animation: loadreverse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    position: relative;
    overflow: hidden;
    width: 55px;
    height: 55px;
    border-radius: @full;
    margin: 0.75rem;
    margin-left: 0;
  }
  .right {
    &:extend(.full-width);
  }
  .placeholder-item {
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
        @foreground-alt @half,
        transparent @full
      );
      animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    border-radius: 2px;
    height: 30px;
    position: relative;
    overflow: hidden;
    background: @foreground;
    margin: 0.75rem;
  }
}
</style>
