import { StringToHashBucketFastInputs } from '@tensorflow/tfjs'
import { Config } from '~/config'

export const shouldFileSizeBeFixed = (type: string) => {
  if (type.match('image.*')) {
    return true
  }

  return false
}

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
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      })
    }
    img.src = url
  })
}

export const getSizeFromAspectRatio = ({
  width,

  height,
}: {
  width: number

  height: number
}) => {
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
