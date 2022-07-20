import Vue from 'vue'

const LONG_PRESS_DURATION = 500 // ms

Vue.directive('contextmenu', {
  bind(element, binding) {
    console.log('bind')
    let timeout: number

    const start = (e: MouseEvent) => {
      console.log('start')
      timeout = setTimeout(() => handler(e), LONG_PRESS_DURATION)
    }

    const cancel = () => {
      if (timeout) {
        console.log('cancelled')
        clearTimeout(timeout)
      }
    }

    const handler = (e: MouseEvent) => {
      e.preventDefault()
      console.log('handler')
      binding.value(e)
    }

    const prevent = (e: MouseEvent) => {
      console.log('prevent!')
      e.stopPropagation()
      e.preventDefault()
    }

    element.addEventListener('contextmenu', handler)
    element.addEventListener('mousedown', start)
    element.addEventListener('mouseup', cancel)
    element.addEventListener('mouseleave', cancel)
    element.addEventListener('click', prevent)
  },
})
