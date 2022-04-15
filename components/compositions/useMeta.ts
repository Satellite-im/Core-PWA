const useMeta = () => {
  const { $store } = useNuxtApp()
  const title = computed(() => $store.state.meta.title)

  useHead({
    title,
  })
}

export default useMeta
