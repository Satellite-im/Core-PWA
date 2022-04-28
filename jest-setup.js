import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer
Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer

function myArrayBuffer() {
  // this: File or Blob
  return new Promise((resolve) => {
    let fr = new FileReader()
    fr.onload = () => {
      resolve(fr.result)
    }
    fr.readAsArrayBuffer(this)
  })
}
