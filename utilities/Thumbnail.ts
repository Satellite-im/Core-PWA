import skaler from 'skaler'
import { FileType } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { EnvInfo } from '~/utilities/EnvInfo'
import { isHeic, isMimeEmbeddableImage, mimeType } from '~/utilities/FileType'
const convert = require('heic-convert')

/**
 * @method _createThumbnail
 * @description create thumbnail if embeddable image format
 * @param {File} file
 * @param {number} width desired thumbnail width px
 * @returns {Promise<File | undefined>} scaled down file IF embeddable image. undefined if not
 */
export default async function createThumbnail(
  file: File,
  width: number,
): Promise<File | undefined> {
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
    return await skaler(fileJpg, { width })
  }

  const type = await mimeType(file)
  // if non embeddable image, set no thumbnail
  if (!isMimeEmbeddableImage(type)) {
    return
  }

  // svg cannot be used with skaler, set thumbnail based on full size
  if (type === FileType.SVG) {
    return file
  }
  if (await _tooLarge(file)) {
    return
  }
  return await skaler(file, { width })
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
      URL.revokeObjectURL(img.src)
      if (maxDimension > Config.canvasLimits[envInfo.currentPlatform]) {
        resolve(true)
      }
      resolve(false)
    }
  })
}
