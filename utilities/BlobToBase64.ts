/**
 * @method blobToBase64
 * @description convert File/Blob to base64 string
 * @param {File} file
 * @returns {Promise<string>} base64 thumbnail
 */
export default function blobToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() || '')
    reader.onerror = (error) => reject(error)
  })
}
