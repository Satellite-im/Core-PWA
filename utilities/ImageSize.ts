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

const baseSize = 300
// size to which if exceeds, we will resize accordingly to the aspect ratio
const maxSize = 400

export const getSizeFromAspectRatio = ({
  width,

  height,
}: {
  width: number

  height: number
}) => {
  if (width > maxSize || height > maxSize) {
    const ratio = width / height

    if (ratio < 1) {
      return { width: baseSize, height: baseSize / ratio }
    }

    if (ratio > 1) {
      return { width: baseSize * ratio, height: baseSize }
    }

    return { width: baseSize, height: baseSize }
  }

  return { width, height }
}
