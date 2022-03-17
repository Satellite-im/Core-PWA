import { stripEXIF } from '~/utilities/EXIF'
import isNSFW from '~/utilities/NSFW'

export default class Security {
  stripEXIF: Function = stripEXIF
  isNSFW: Function = isNSFW
}
