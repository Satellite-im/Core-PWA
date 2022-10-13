import { onMounted, onUnmounted } from 'vue'

export function handleEsc(callback: Function) {
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      callback()
    }
  }
  onMounted(() => document.addEventListener('keydown', handleKeydown))
  onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
}
