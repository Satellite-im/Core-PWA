import { Config } from '~/config'

export const getOriginalSizeFromDataUrl = (
  file: File,
): Promise<{ width: number; height: number }> => {
  const fileAsDataURL = window.URL.createObjectURL(file)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      })
    }
    img.src = fileAsDataURL
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
