<template>
  <div class="message-loader">
    <div class="message-loader-row header">
      <div v-for="j in cols" :key="j" class="placeholder-item"></div>
    </div>
    <div v-for="i in rows" :key="i" class="message-loader-row">
      <div v-for="j in cols" :key="j" class="placeholder-item"></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    rows: {
      type: Number,
      default: 1,
    },
    cols: {
      type: Number,
      default: 1,
    },
  },
})
</script>
<style scoped lang="less">
.message-loader {
  .message-loader-row {
    width: 100%;
    display: flex;
    padding: 0.6rem 0.35rem;
    border-bottom: 1px solid @light-gray;

    &.header {
      border-bottom-color: @text-muted;
    }
  }
  .placeholder-item {
    flex: 1;
    border-radius: 2px;
    height: 18px;
    position: relative;
    overflow: hidden;
    background: @light-gray;
    margin-left: 0.5rem;

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: -150px;
      top: 0;
      height: 100%;
      width: 75%;
      background: linear-gradient(
        to right,
        transparent 0%,
        @light-gray-alt 50%,
        transparent 100%
      );
      animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  @keyframes load {
    from {
      left: -75%;
    }
    to {
      left: 100%;
    }
  }
  @keyframes loadreverse {
    from {
      left: -100%;
    }
    to {
      left: 200%;
    }
  }
}
</style>
