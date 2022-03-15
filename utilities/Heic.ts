/**
 * @method isHeic
 * @description check if file is .heic (iOS Image)
 * @param file {File}
 * @returns return if file is .heic (iOS Image)
 * @example
 */
export const isHeic = (file: File) => {
  return file.type === 'image/heic'
}
