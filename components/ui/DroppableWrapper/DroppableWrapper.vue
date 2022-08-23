<template src="./DroppableWrapper.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DroppableWrapper',
  data() {
    return {
      target: null as EventTarget | null,
      dragging: false as boolean,
    }
  },
  methods: {
    handleDrop(e: DragEvent) {
      this.$emit('handle-drop-prop', e)
      this.dragging = false
    },
    /**
     * @method handleDragenter
     * @description Event handler that define target that was entered
     */
    handleDragenter(e: DragEvent) {
      this.target = e.target
      this.dragging = true
    },
    /**
     * @method handleDragleave
     * @description Event handler that check current target
     * and if it equals to already entered - it leaves
     */
    handleDragleave(e: DragEvent) {
      if (this.target === e.target) {
        this.dragging = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./DroppableWrapper.less"></style>
