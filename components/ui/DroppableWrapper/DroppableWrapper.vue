<template src="./DroppableWrapper.html"></template>

<script lang="ts">
import Vue from 'vue'
import { MessagingTypesEnum } from '~/libraries/Enums/types/messaging-types'

export default Vue.extend({
  name: 'DroppableWrapper',
  data() {
    return {
      target: null,
      dragging: false,
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
      // do not show hovered effect if draggable item type include text
      if (
        Array.prototype.some.call(e.dataTransfer?.items, (item) =>
          item.type.includes(MessagingTypesEnum.TEXT),
        )
      ) {
        return null
      }
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
