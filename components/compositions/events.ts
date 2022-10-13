import { onMounted, onUnmounted } from 'vue'

export function handleEsc(func: Function) {
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      func()
    }
  }
  onMounted(() => document.addEventListener('keydown', handleKeydown))
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
}
