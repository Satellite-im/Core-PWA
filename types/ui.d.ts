import { TranslateResult } from 'vue-i18n'

export type ButtonAttributes = {
  label: TranslateResult
  icon: any
  func: () => void
}
