<template>
  <div
    :class="['droppableWrapper', dragging ? 'droppableWrapper--active' : '']"
    @drop="handleDrop"
    @dragenter.stop.prevent="handleDragenter"
    @dragleave.stop.prevent="handleDragleave"
    @dragover.stop.prevent
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  name: 'DroppableWrapper',
  data() {
    return {
      target: null,
      dragging: false,
    }
  },
  props: {
    handleDropProp: {
      type: Function as PropType<(e: DragEvent) => void>,
      default: () => () => {},
    },
  },
  methods: {
    handleDrop(e: DragEvent) {
      this.handleDropProp(e)
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

<style lang="less">
.droppableWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    user-select: none;
    pointer-events: none;
    background-color: transparent;
    border: 5px solid transparent;
    transition: 0.2s ease-in-out;
    z-index: 100;
  }
  &.droppableWrapper--active {
    &:after {
      border-color: @primary-color;
      background-color: rgba(@primary-color, 0.25);
    }
  }
}
</style>
