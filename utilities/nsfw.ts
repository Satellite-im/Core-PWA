// @ts-nocheck
import * as nsfwjs from 'nsfwjs'

export const isNSFW = (file: File) => {
  console.log('Checking NSFW')
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
      console.log('Results')
      const predictionObj = {}
      for (const prediction of predictionsArr) {
        console.log(prediction)
        predictionObj[prediction.className] = prediction.probability
      }

      const predictionResults =
        predictionObj.Porn > 0.4 ||
        predictionObj.Hentai > 0.6 ||
        predictionObj.Sexy > 0.7

      console.log(predictionResults)
      return predictionResults
    })
}
