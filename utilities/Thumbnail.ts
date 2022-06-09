import skaler from 'skaler'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { Config } from '~/config'
import { EnvInfo } from '~/utilities/EnvInfo'
import { isHeic, isMimeEmbeddableImage, mimeType } from '~/utilities/FileType'
import blobToBase64 from '~/utilities/BlobToBase64'
const convert = require('heic-convert')

/**
 * @method _createThumbnail
 * @description create thumbnail if embeddable image format
 * @param {File} file
 * @returns {Promise<string>} base64 thumbnail
 */
export default async function createThumbnail(
  file: File,
): Promise<string | undefined> {
  if (await isHeic(file)) {
    const buffer = new Uint8Array(await file.arrayBuffer())
    const outputBuffer = await convert({
      buffer,
      format: 'JPEG',
      quality: 1,
    })
    const fileJpg = new File([outputBuffer.buffer], file.name, {
      type: 'image/jpeg',
    })
    if (await _tooLarge(fileJpg)) {
      return
    }
    return blobToBase64(await skaler(fileJpg, { width: 400 }))
  }

  const type = await mimeType(file)
  // if non embeddable image, set no thumbnail
  if (!isMimeEmbeddableImage(type)) {
    return
  }

  // svg cannot be used with skaler, set thumbnail based on full size
  if (type === FILE_TYPE.SVG) {
    return blobToBase64(file)
  }
  if (await _tooLarge(file)) {
    return
  }
  return blobToBase64(await skaler(file, { width: 400 }))
}

/**
 * @method _tooLarge
 * @description determine if image exceeds platform canvas limits
 * @param {File} file needs to be an embeddable image type
 * @returns {Promise<boolean>}
 */
function _tooLarge(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const envInfo = new EnvInfo()
      const maxDimension = Math.max(img.width, img.height)
      if (maxDimension > Config.canvasLimits[envInfo.currentPlatform]) {
        resolve(true)
      }
      resolve(false)
    }
  })
}
