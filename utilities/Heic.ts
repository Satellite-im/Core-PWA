/**
 * @method isHeic
 * @description check if file is .heic (ios Image)
 * @param buffer Buffer
 * @returns return if file is .heic (ios Image)
 * @example
 */
export const isHeic = (buffer: any) => {
  const uint8Buffer: any = new Uint8Array(buffer)
  if (!uint8Buffer || uint8Buffer.length < 24) return false
  return (
    uint8Buffer[20] === 0x68 &&
    uint8Buffer[21] === 0x65 &&
    uint8Buffer[22] === 0x69 &&
    uint8Buffer[23] === 0x63
  )
}
