// @ts-ignore
// import FileIconMapper from '@/utils/FileIconMapper'

export default class FileC {
  modified: number
  url: string
  hash: string
  filename: any
  size: any
  type: any

  constructor (url: string, hash: string, file: File) {
    this.modified = Date.now()
    this.url = url
    this.hash = hash
    this.filename = file.name
    this.size = file.size
    this.type = file.type
  }
  /** @function
   * @name getFileIcon
   * @returns returns the mapped fontawesome icon
   */
  // getFileIcon () {
  //   return FileIconMapper.translateFiletype(this.type, FileIconMapper.mappings)
  // }
  /** @function
   * @name getObject
   * @returns returns the file as an object
   */
  getObject () {
    return {
      url: this.url,
      hash: this.hash,
      type: this.type,
      size: this.size,
      filename: this.filename,
      at: this.modified
    }
  }
}
