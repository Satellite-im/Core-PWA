import fileSize from 'filesize'
import { Config } from '~/config'

export function filesize(bytes: number) {
  return fileSize(bytes, {
    base: 2,
    standard: 'jedec', // shows in terms of SI units, even though its base 2
    locale: Config.locale,
  })
}
