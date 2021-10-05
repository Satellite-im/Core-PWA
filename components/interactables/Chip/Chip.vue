<template>
  <div v-if="show" class="chip-item">
    {{ text }}
    <x-icon size="1x" @click="hide" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { XIcon } from 'vue-feather-icons'

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
    hide() {
      this.show = false
    },
  },
})
</script>

<style scoped lang="less">
.chip-item {
  display: inline-block;
  margin-right: @light-spacing;
  margin-bottom: @light-spacing;
  padding: @xlight-spacing @light-spacing;
  border-radius: @corner-rounding-xxlarge;
  background-color: @primary-color;
  color: white;
  .fa-times {
    margin-bottom: -2px;
    margin-left: @light-spacing;
    cursor: pointer;
  }
}
</style>
