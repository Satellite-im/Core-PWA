import * as nsfwjs from 'nsfwjs'
import skaler from 'skaler'
import { Config } from '~/config'
import { EnvInfo } from '~/utilities/EnvInfo'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { mimeType } from '~/utilities/FileType'

/**
 * @method isNSFW
 * @description Checks if an image is NSFW using nsfwjs
 * @param {File} file File object to be scanned
 * @returns {Promise} nsfw status
 */
export default async function isNSFW(file: File): Promise<boolean> {
  const vidTypes = [FILE_TYPE.MP4, FILE_TYPE.MOV, FILE_TYPE.WEBM, FILE_TYPE.OGV]
  const imgTypes = [
    FILE_TYPE.APNG,
    FILE_TYPE.AVIF,
    FILE_TYPE.GIF,
    FILE_TYPE.JPG,
    FILE_TYPE.PNG,
    FILE_TYPE.SVG,
    FILE_TYPE.WEBP,
  ]
  const mime = await mimeType(file)

  // if unscannable/unembeddable type
  if (![...vidTypes, ...imgTypes].includes(mime as FILE_TYPE)) {
    return false
  }

  let predictions: nsfwjs.predictionType[]

  // if embeddable video
  if (vidTypes.some((type) => file.type.includes(type))) {
    // if too big to scan, allow upload
    if (file.size > Config.nsfwVideoLimit) {
      return false
    }
    const vid = document.createElement('video')
    vid.src = URL.createObjectURL(file)
    await (async () => {
      return new Promise((resolve) => {
        vid.onloadeddata = () => {
          vid.muted = true
          vid.play()
          resolve(true)
        }
      })
    })()

    const model = await nsfwjs.load()
    predictions = await model.classify(vid)
  }
  // else, it's an embeddable image
  else {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    // determine if image is too big to be scanned
    const isTooBig: boolean = await (async () => {
      return new Promise((resolve) => {
        img.onload = () => {
          const envInfo = new EnvInfo()
          const maxDimension = Math.max(img.width, img.height)
          if (maxDimension > Config.canvasLimits[envInfo.currentPlatform]) {
            resolve(true)
          }
          resolve(false)
        }
      })
    })()

    // if too big to scan, allow upload
    if (isTooBig) {
      return false
    }
    // if image is somewhat large, scale down so we don't approach RAM limits
    img.src = URL.createObjectURL(
      file.size > Config.nsfwPictureLimit
        ? await skaler(file, { width: 400 })
        : file,
    )
    const model = await nsfwjs.load()
    predictions = await model.classify(img)
  }

  const results: { [key: string]: number } = {}
  for (const p of predictions) {
    results[p.className] = p.probability
  }

  return results.Porn > 0.4 || results.Hentai > 0.6 || results.Sexy > 0.7
}
