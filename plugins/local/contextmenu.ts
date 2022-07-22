import Vue from 'vue'

const LONG_PRESS_DURATION = 500 // ms

Vue.directive('contextmenu', {
  bind(element, binding) {
    let timeout: NodeJS.Timeout
    let isLongPressed = false

    const start = (e: MouseEvent) => {
      timeout = setTimeout(() => handler(e), LONG_PRESS_DURATION)
    }

    const cancel = () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }

    const handler = (e: MouseEvent) => {
      e.preventDefault()
      binding.value(e)
      isLongPressed = true
    }

    const prevent = (e: MouseEvent) => {
      if (isLongPressed) {
        e.stopPropagation()
        e.preventDefault()
        isLongPressed = false
      }
    }

    element.addEventListener('contextmenu', handler)
    element.addEventListener('mousedown', start)
    element.addEventListener('mouseup', cancel)
    element.addEventListener('mouseleave', cancel)
    element.addEventListener('click', prevent)
  },
})
