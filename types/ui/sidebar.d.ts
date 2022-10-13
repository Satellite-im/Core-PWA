import { TranslateResult } from 'vue-i18n'
import { FileRouteEnum } from '~/libraries/Enums/enums'

export interface SimpleItem {
  text: string | TranslateResult
  route: FileRouteEnum
  icon: string
}
