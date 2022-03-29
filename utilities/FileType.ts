import { filetypemime } from 'magic-bytes.js'

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
    return 'image/svg+xml'
  }
  return filetypemime(buffer as any)[0]
}

/**
 * @function isEmbeddableImage
 * @description is file embeddable <img />
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

  const valid = [
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
  ]
  return valid.includes(filetypemime(buffer as any)[0])
}

/**
 * @function isArchive
 * @description is file an archive
 * @param {string} type mime type
 * @returns {boolean}
 * @example test.zip => true, test.txt => false
 */
export function isMimeArchive(type: string): boolean {
  const valid = [
    'application/zip',
    'application/x-7z-compressed',
    'application/vnd.rar',
  ]
  return valid.includes(type)
}
