/**
 * @method stripEXIF
 * @description Strips jpeg file of all EXIF data
 * @param file JPEG file
 * @returns Blob stripped of EXIF data
 * @example
 */
export const stripEXIF = (file: File) => {
  if (file.type !== 'image/jpeg') {
    return file
  }

  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(strip(e))
    }
    fr.onerror = (e) => {
      reject(e)
    }
    fr.readAsArrayBuffer(file)
  })
    .then((blob) => {
      return blob || file
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.warn(err)
    })
}

/**
 * @method strip
 * @description Strips EXIF data from FileReader event object
 * @param e FileReader event object
 * @returns Blob stripped of EXIF data
 * @example
 */
const strip = (e: any) => {
  const dv = new DataView(e.target.result)
  let offset = 0
  let recess = 0
  const pieces = []
  let i = 0
  console.log(1, dv.getUint16(offset))
  if (dv.getUint16(offset) === 0xffd8) {
    offset += 2
    let app1 = dv.getUint16(offset)
    offset += 2
    while (offset < dv.byteLength) {
      if (app1 === 0xffe1) {
        pieces[i] = { recess, offset: offset - 2 }
        recess = offset + dv.getUint16(offset)
        i++
      } else if (app1 === 0xffda) {
        break
      }
      offset += dv.getUint16(offset)
      app1 = dv.getUint16(offset)
      offset += 2
    }
    if (pieces.length > 0) {
      const newPieces = []
      pieces.forEach((v) => {
        newPieces.push(e.target.result.slice(v.recess, v.offset))
      }, e.target)
      newPieces.push(e.target.result.slice(recess))
      const br = new Blob(newPieces, { type: 'image/jpeg' })
      return br
    }
  }
}
