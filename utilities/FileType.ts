import { filetypemime } from 'magic-bytes.js'
import { FileType } from '~/libraries/Enums/enums'

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
    return FileType.SVG
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
    FileType.APNG,
    FileType.AVIF,
    FileType.GIF,
    FileType.JPG,
    FileType.PNG,
    FileType.WEBP,
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
  const valid: string[] = [FileType.RAR, FileType.ZIP, FileType.SZIP]
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
    FileType.APNG,
    FileType.AVIF,
    FileType.GIF,
    FileType.JPG,
    FileType.PNG,
    FileType.WEBP,
    FileType.SVG,
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
  const valid: string[] = [FileType.HEIC, FileType.HEIF]
  return valid.includes(filetypemime(buffer as any)[0])
}
