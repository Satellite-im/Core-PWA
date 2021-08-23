import { stripEXIF } from '../Security/exif'
import { isNSFW } from '../Security/nsfw'

export default class Security {
  stripEXIF: Function = stripEXIF
  isNSFW: Function = isNSFW
}
