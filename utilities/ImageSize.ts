import { isEmbeddableImage } from '~/utilities/FileType'
import { Config } from '~/config'

export const getGlyphSource = ({
  source,
  sizeType,
}: {
  source: string
  sizeType: string
}): string => {
  if (source.includes('/$1/')) {
    return source.replace('$1', sizeType)
  }
  return source
}

export const getOriginalSizeFromDataUrl = (
  dataUrl: File | Blob,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = window.URL.createObjectURL(dataUrl)

    img.onload = () => {
      URL.revokeObjectURL(img.src)

      resolve({
        height: img.height,
        width: img.width,
      })
    }
  })
}

export const getSizeFromAspectRatio = async (
  file: File | Blob,
): Promise<{
  width: number
  height: number
} | void> => {
  if (await isEmbeddableImage(file)) {
    const { width, height } = await getOriginalSizeFromDataUrl(file)

    if (
      width > Config.chat.imageDimensions.maxWidth ||
      height > Config.chat.imageDimensions.maxHeight
    ) {
      const ratio = width / height

      if (ratio < 1) {
        return {
          width: Math.round(Config.chat.imageDimensions.maxHeight * ratio),
          height: Config.chat.imageDimensions.maxHeight,
        }
      }

      if (ratio > 1) {
        return {
          width: Config.chat.imageDimensions.maxWidth,
          height: Math.round(Config.chat.imageDimensions.maxWidth / ratio),
        }
      }

      return {
        width: Config.chat.imageDimensions.base,
        height: Config.chat.imageDimensions.base,
      }
    }

    return { width, height }
  }
}
