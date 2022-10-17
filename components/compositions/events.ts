import { nextTick, onMounted, onUnmounted, Ref, ref } from 'vue'
import { createFocusTrap, FocusTrap, Options } from 'focus-trap'

export function handleEsc(func: Function) {
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      func()
    }
  }
  onMounted(() => document.addEventListener('keydown', handleKeydown))
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
}

export function handleFocusTrap(el: Ref<HTMLElement | null>) {
  const trap: Ref<FocusTrap | null> = ref(null)
  const options: Options = {
    allowOutsideClick: true,
    escapeDeactivates: false,
  }

  onMounted(() => {
    // next tick to handle any conditionally rendered, focusable elements
    nextTick(() => {
      if (!el.value) {
        return
      }
      trap.value = createFocusTrap(el.value, options)
      trap.value.activate()
    })
  })
  onUnmounted(() => trap.value?.deactivate())
}
