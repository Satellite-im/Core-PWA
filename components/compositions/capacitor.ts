import { Clipboard } from '@capacitor/clipboard'

export function capacitorHooks() {
  async function copyText(text: string) {
    // @ts-ignore
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
