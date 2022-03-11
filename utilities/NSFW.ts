import * as nsfwjs from 'nsfwjs'
import { FILE_TYPE } from '~/libraries/Files/types/file'

/**
 * @method isNSFW
 * @description Checks if an image is NSFW using nsfwjs
 * @param {File} file File object to be scanned
 * @returns {Promise} nsfw status
 */
export default async function isNSFW(file: File): Promise<boolean> {
  const vidTypes = [FILE_TYPE.MP4, FILE_TYPE.WEBM, FILE_TYPE.OGV]
  const imgTypes = [
    FILE_TYPE.APNG,
    FILE_TYPE.AVIF,
    FILE_TYPE.GIF,
    FILE_TYPE.JPG,
    FILE_TYPE.PNG,
    FILE_TYPE.SVG,
    FILE_TYPE.WEBP,
  ]
  // if unscannable/unembeddable type - return false
  if (![...vidTypes, ...imgTypes].includes(file.type as FILE_TYPE)) {
    return false
  }

  let predictions: nsfwjs.predictionType[]

  // if embeddable video, handle appropriately
  if (vidTypes.some((type) => file.type.includes(type))) {
    const vid = document.createElement('video')
    vid.src = URL.createObjectURL(file)
    const model = await nsfwjs.load()
    predictions = await model.classify(vid)
  }
  // else, it's an embeddable image
  else {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    const model = await nsfwjs.load()
    predictions = await model.classify(img)
  }

  const results: { [key: string]: number } = {}
  for (const p of predictions) {
    results[p.className] = p.probability
  }

  return results.Porn > 0.4 || results.Hentai > 0.6 || results.Sexy > 0.7
}
