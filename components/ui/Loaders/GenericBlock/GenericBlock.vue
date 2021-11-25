<template>
  <div :class="`${inverted ? 'inverted' : ''} generic-block-loader`">
    <div v-for="i in count" :key="i" class="generic-block-loader-item">
      <div class="right">
        <div class="placeholder-item shortest" />
        <div class="placeholder-item" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    inverted: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 1,
    },
  },
})
</script>
<style scoped lang="less">
.generic-block-loader {
  padding: @light-spacing;
  .generic-block-loader-item {
    width: 100%;
    display: flex;
  }

  .placeholder-profile {
    position: relative;
    overflow: hidden;
    width: 35px;
    height: 35px;
    border-radius: 100%;
    background: @light-gray;
    margin: 0.75rem;
    margin-left: 0;

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: -150px;
      top: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(
        to right,
        transparent 0%,
        @light-gray-alt 50%,
        transparent 100%
      );
      animation: loadreverse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  .right {
    width: 100%;
  }
  .placeholder-item {
    border-radius: 2px;
    height: 30px;
    position: relative;
    overflow: hidden;
    background: @dark-gray;
    margin: 0.75rem;

    &.shortest {
      height: 15px;
      width: 30%;
    }
    &.bigger {
      height: 55px;
    }

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
        @dark-gray-alt 50%,
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
.inverted {
  .placeholder-item,
  .placeholder-profile {
    background: @darker;
    &::before {
      background: linear-gradient(
        to right,
        transparent 0%,
        @darker-alt 50%,
        transparent 100%
      );
    }
  }
}
</style>
