import Vue from 'vue'

// Initialize the annoying-background directive.
export const closeOutside = {
  bind: function (el: any, binding: any) {
    // Define Handler and cache it on the element
    const bubble = binding.modifiers.bubble
    const handler = (e: Event) => {
      if (bubble || (!el.contains(e.target) && el !== e.target)) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = handler

    // add Event Listeners
    document.addEventListener('click', handler)
  },

  unbind: function (el: any) {
    // Remove Event Listeners
    document.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  },
}

//make it available globally.
Vue.directive('close-outside', closeOutside)
