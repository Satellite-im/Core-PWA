import { computed } from 'vue'

const useMeta = () => {
  const title = computed(() => 'Satellite.im')

  useHead({
    title,
  })
}

export default useMeta
