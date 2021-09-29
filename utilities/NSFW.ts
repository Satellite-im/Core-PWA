// @ts-nocheck
import * as nsfwjs from 'nsfwjs'

/**
 * @method isNSFW
 * @description Checks if an image is NSFW using nsfwjs
 * @param file Image or GIF
 * @returns Boolean based on predictionResults
 * @example
 */
export const isNSFW = (file: File) => {
  const fileTypePrefix = file.type.split('/')[0]
  if (fileTypePrefix !== 'image') {
    return false
  }
  const fileURL = URL.createObjectURL(file)
  const imgElement = document.createElement('IMG')
  imgElement.src = fileURL

  return nsfwjs
    .load()
    .then((model) => {
      return model.classify(imgElement)
    })
    .then((predictionsArr) => {
      const predictionObj = {}
      for (const prediction of predictionsArr) {
        predictionObj[prediction.className] = prediction.probability
      }

      const predictionResults =
        predictionObj.Porn > 0.4 ||
        predictionObj.Hentai > 0.6 ||
        predictionObj.Sexy > 0.7

      return predictionResults
    })
}
