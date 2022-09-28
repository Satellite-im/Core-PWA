/**
 * @function blobToStream
 * @description convert Blob to ReadableStream. helpful for large uploads to avoid hitting the browser blob size limit
 * @param {Blob} file
 * @returns {ReadableStream} base64 thumbnail
 */
export function blobToStream(file: Blob): ReadableStream {
  // @ts-ignore
  const reader = file.stream().getReader()
  const stream = new ReadableStream({
    start(controller) {
      function push() {
        return reader
          .read()
          .then(({ done, value }: { done: boolean; value: Uint8Array }) => {
            if (done) {
              controller.close()
              return
            }
            controller.enqueue(value)
            push()
          })
      }
      push()
    },
  })
  return stream
}

/**
 * @method blobToBase64
 * @description convert File/Blob to base64 string
 * @param {Blob} file
 * @returns {Promise<string>} base64 thumbnail
 */
export function blobToBase64(file: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() || '')
    reader.onerror = (error) => reject(error)
  })
}
