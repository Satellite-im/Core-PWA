import { filetypemime } from 'magic-bytes.js'
import { FILE_TYPE } from '~/libraries/Files/types/file'

/**
 * @function mimeType
 * @description checks mime type with magic number https://en.wikipedia.org/wiki/List_of_file_signatures
 * @param {Blob} file
 * @returns {Promise<string>} mime type
 * @example test.png => 'image/png'
 */
export async function mimeType(file: Blob): Promise<string> {
  const buffer = new Uint8Array(await file.slice(0, 256).arrayBuffer())
  // svg byte check returns xml, so we need to manually check
  const decodedFile = new TextDecoder().decode(buffer)
  if (decodedFile.includes('xmlns="http://www.w3.org/2000/svg"')) {
    return FILE_TYPE.SVG
  }
  return filetypemime(buffer as any)[0]
}

/**
 * @function isEmbeddableImage
 * @description is file embeddable in <img />
 * @param {Blob} file
 * @returns {Promise<boolean>}
 * @example test.png => true, test.txt => false
 */
export async function isEmbeddableImage(file: Blob): Promise<boolean> {
  const buffer = new Uint8Array(await file.slice(0, 256).arrayBuffer())
  // svg byte check returns xml, so we need to manually check
  const decodedFile = new TextDecoder().decode(buffer)
  if (decodedFile.includes('xmlns="http://www.w3.org/2000/svg"')) {
    return true
  }
  const valid: string[] = [
    FILE_TYPE.APNG,
    FILE_TYPE.AVIF,
    FILE_TYPE.GIF,
    FILE_TYPE.JPG,
    FILE_TYPE.PNG,
    FILE_TYPE.WEBP,
  ]
  return valid.includes(filetypemime(buffer as any)[0])
}

/**
 * @function isMimeArchive
 * @description is file an archive
 * @param {string} type mime type
 * @returns {boolean}
 * @example application/zip => true, image/png => false
 */
export function isMimeArchive(type: string): boolean {
  const valid: string[] = [FILE_TYPE.RAR, FILE_TYPE.ZIP, FILE_TYPE.SZIP]
  return valid.includes(type)
}

/**
 * @function isMimeEmbeddableImage
 * @description is mime type embeddable in <img />
 * @param {string} type mime type
 * @returns {boolean}
 * @example image/png => true, image/png => false
 */
export function isMimeEmbeddableImage(type: string): boolean {
  const valid: string[] = [
    FILE_TYPE.APNG,
    FILE_TYPE.AVIF,
    FILE_TYPE.GIF,
    FILE_TYPE.JPG,
    FILE_TYPE.PNG,
    FILE_TYPE.WEBP,
    FILE_TYPE.SVG,
  ]
  return valid.includes(type)
}

/**
 * @function isHeic
 * @description is file heic
 * @param {Blob} file
 * @returns {Promise<boolean>}
 * @example test.heic => true, test.txt => false
 */
export async function isHeic(file: Blob): Promise<boolean> {
  const buffer = new Uint8Array(await file.slice(0, 100).arrayBuffer())
  return FILE_TYPE.HEIC === filetypemime(buffer as any)[0]
}
