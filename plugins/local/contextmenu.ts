import Vue from 'vue'

const LONG_PRESS_DURATION = 500 // ms

Vue.directive('contextmenu', {
  bind(element, binding) {
    let timeout: NodeJS.Timeout
    let isLongPressed = false

    const start = (e: MouseEvent | TouchEvent) => {
      timeout = setTimeout(() => handler(e), LONG_PRESS_DURATION)
    }

    const cancel = () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }

    const handler = (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      binding.value(e)
      isLongPressed = true
    }

    const prevent = (e: MouseEvent | TouchEvent) => {
      if (isLongPressed) {
        e.stopPropagation()
        e.preventDefault()
        isLongPressed = false
      }
    }

    element.addEventListener('contextmenu', handler)
    element.addEventListener('mousedown', start)
    element.addEventListener('touchstart', start)
    element.addEventListener('mouseup', cancel)
    element.addEventListener('touchend', cancel)
    element.addEventListener('mouseleave', cancel)
    element.addEventListener('click', prevent)
  },
})
