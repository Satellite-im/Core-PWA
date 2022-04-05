export type UploadDropItemType = {
  file: File
  url: string
  nsfw: {
    checking: boolean
    status: boolean
  }
}
