import Vue from 'vue'

Vue.component('VStyle', {
  render(createElement) {
    return createElement('style', this.$slots.default)
  },
})
