const useMeta = () => {
  const { $store } = useNuxtApp()

  useHead({
    title: $store.state.meta.title,
  })
}

export default useMeta
