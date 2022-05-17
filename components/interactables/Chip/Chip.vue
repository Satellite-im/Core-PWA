<template>
  <div v-if="show" class="chip-item">
    {{ text }}
    <x-icon size="1x" @click="hide" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import { XIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    XIcon,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: true,
    }
  },
  methods: {
    /**
     * @method hide
     * @description Hides chip element
     */
    hide() {
      this.show = false
    },
  },
})
</script>

<style scoped lang="less">
.chip-item {
  .fa-times {
    margin-bottom: -2px;
    margin-left: @light-spacing;
    cursor: pointer;
  }
  display: inline-block;
  margin-right: @light-spacing;
  margin-bottom: @light-spacing;
  padding: @xlight-spacing @light-spacing;
  border-radius: @corner-rounding-xxlarge;
  color: white;
}
</style>
