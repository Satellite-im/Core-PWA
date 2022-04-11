import Vue from 'vue'

export default Vue.extend({
  setup() {
    const { $store } = useNuxtApp()

    useHead({
      title: $store.state.meta.title,
    })
  },
})
