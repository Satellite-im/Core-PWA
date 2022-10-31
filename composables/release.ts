import { ref, Ref } from 'vue'

export async function fetchReleaseData(): Promise<any> {
  const data: Ref<any> = ref(null)

  if (!data.value) {
    const res = await fetch(
      'https://api.github.com/repos/Satellite-im/Core-PWA/releases/latest',
    )
    data.value = await res.json()
  }
  return data
}
