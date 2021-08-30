<template>
  <div v-if="show" class="chip-item">
    {{ text }}
    <font-awesome-icon :icon="['far', 'times']" @click="hide" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 24px;
  background-color: @primary-color;
  color: white;
  .fa-times {
    margin-bottom: -2px;
    margin-left: 8px;
    cursor: pointer;
  }
}
</style>
