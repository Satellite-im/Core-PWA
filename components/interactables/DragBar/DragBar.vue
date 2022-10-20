<template>
  <div
    ref="dragBar"
    class="drag-bar"
    :class="`side-${side} ${overlay ? 'drag-bar-overlay' : ''}`"
    @mousedown="handleMouseDown"
  >
    <div v-if="showHandle" class="handle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onUnmounted, Ref, ref } from 'vue'
import { SideType } from './types'

interface Props {
  side: SideType
  showHandle?: boolean
  overlay?: boolean
}

interface Emits {
  (e: 'resize', val: string): void
}
const props = withDefaults(defineProps<Props>(), {
  showHandle: false,
  overlay: false,
})
const emit = defineEmits<Emits>()

const isDragging: Ref<boolean> = ref(false)
const initialEvent: Ref<MouseEvent | null> = ref(null)
const initialClientRect: Ref<DOMRect | undefined> = ref(undefined)
const dragBar: Ref<HTMLElement | null> = ref(null)

const isVertical: ComputedRef<boolean> = computed(() => {
  return props.side === 'top' || props.side === 'bottom'
})

onUnmounted(removeEventListeners)

function handleMouseDown(event: MouseEvent) {
  addEventListeners()
  isDragging.value = true
  initialEvent.value = event
  initialClientRect.value =
    dragBar.value?.parentElement?.getBoundingClientRect()
}
function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value || !initialEvent.value || !initialClientRect.value) {
    return
  }
  const delta = isVertical.value
    ? event.y - initialEvent.value.y
    : event.x - initialEvent.value.x

  const emitValue = isVertical.value
    ? initialClientRect.value.height + delta
    : initialClientRect.value.width + delta

  emit('resize', `${emitValue}px`)
}
function handleMouseUp() {
  removeEventListeners()
  isDragging.value = false
  initialEvent.value = null
}
function addEventListeners() {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
function removeEventListeners() {
  if (!isDragging.value) {
    return
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
</script>
<style scoped lang="less" src="./DragBar.less"></style>
