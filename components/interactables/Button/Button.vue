<template>
  <button
    ref="button"
    class="button"
    :class="`size-${size} color-${color}`"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
    @mousemove.stop="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <UiLoadersSpinner v-if="loading" class="spinner" spinning />
    <div v-else class="content">
      <slot></slot>
      <span v-if="text.length">{{ text }}</span>
    </div>
    <div class="cursor-glow" :style="cursorGlowStyle"></div>
  </button>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { ButtonColor, ButtonSize, ButtonType } from './types.d'

type CursorGlow = {
  backgroundPosition: string
  opacity: number
}

interface Props {
  size?: ButtonSize
  color?: ButtonColor
  text?: string
  loading?: boolean
  type?: ButtonType
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  text: '',
  loading: false,
  type: 'button',
  disabled: false,
})

interface Emits {
  (e: 'click', event: MouseEvent): void
}
const emit = defineEmits<Emits>()

const cursorX: Ref<number> = ref(0)
const cursorY: Ref<number> = ref(0)
const showCursorGlow: Ref<boolean> = ref(false)
const button: Ref<HTMLButtonElement | null> = ref(null)

const cursorGlowStyle: ComputedRef<CursorGlow> = computed(() => {
  return {
    backgroundPosition: `left ${cursorX.value - 150}px top ${
      cursorY.value - 150
    }px`,
    opacity: !props.disabled && showCursorGlow.value ? 1 : 0,
  }
})

function handleClick(event: MouseEvent) {
  emit('click', event)
}
function handleMouseEnter() {
  showCursorGlow.value = true
}
function handleMouseLeave() {
  showCursorGlow.value = false
}
function handleMouseMove(event: MouseEvent) {
  if (!button.value) {
    return
  }
  const bounds = button.value.getBoundingClientRect()
  cursorX.value = event.clientX - bounds.left
  cursorY.value = event.clientY - bounds.top
}
</script>
<style scoped lang="less" src="./Button.less"></style>
