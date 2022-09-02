<template>
  <div class="friend-loader">
    <div v-for="i in count" :key="i" class="loader-item">
      <div class="picture" />
      <div class="text">
        <div />
        <div />
      </div>
      <div class="timestamp" />
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
.friend-loader {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  * {
    overflow: hidden;
  }

  .loader-item {
    display: flex;
    align-items: center;
    height: 64px;
    gap: 8px;

    .picture {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      flex-shrink: 0;
      background: @semitransparent-lighter-gradient;
      position: relative;
    }

    .text {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      width: 100%;
      gap: 8px;
      > div {
        height: 20px;
        background: @semitransparent-lighter-gradient;
        position: relative;
      }
    }

    .timestamp {
      flex-shrink: 0;
      height: 18px;
      width: 40px;
      align-self: flex-start;
      background: @semitransparent-lighter-gradient;
      position: relative;
    }
  }
}
</style>
