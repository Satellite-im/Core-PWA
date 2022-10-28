import { Clipboard } from '@capacitor/clipboard'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'

export function capacitorHooks() {
  async function copyText(text: string) {
    const $nuxt = useNuxtApp()
    try {
      await Clipboard.write({
        string: text,
      })
      $nuxt.$toast.show($nuxt.$t('ui.copied') as string)
    } catch (error) {
      $nuxt.$toast.error(error)
    }
  }

  return { copyText }
}
