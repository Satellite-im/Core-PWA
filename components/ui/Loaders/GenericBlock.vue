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
  &:extend(.light-padding);
  .generic-block-loader-item {
    &:extend(.full-width);
    display: flex;
  }

  .placeholder-profile {
    position: relative;
    overflow: hidden;
    width: 35px;
    height: 35px;
    border-radius: @full;
    background: @foreground;
    margin: 0.75rem;
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
        @foreground-alt @half,
        transparent @full
      );
      animation: loadreverse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  .right {
    &:extend(.full-width);
  }
  .placeholder-item {
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
      height: @full;
      width: 75%;
      background: linear-gradient(
        to right,
        transparent 0%,
        @midground-alt @half,
        transparent @full
      );
      animation: load 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    border-radius: 2px;
    height: 30px;
    position: relative;
    overflow: hidden;
    background: @midground;
    margin: 0.75rem;
  }
}
.inverted {
  .placeholder-item,
  .placeholder-profile {
    &::before {
      background: linear-gradient(
        to right,
        transparent 0%,
        @darker-alt @half,
        transparent @full
      );
    }
    background: @darker;
  }
}
</style>
