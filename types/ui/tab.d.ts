import { TranslateResult } from 'vue-i18n'

export interface Tab {
  text: string | TranslateResult
  route: string
  badge?: number
}
