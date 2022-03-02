import fileSize from 'filesize'
import { Config } from '~/config'

export function filesize(bytes: number) {
  return fileSize(bytes, {
    base: 2,
    locale: Config.locale,
  })
}
