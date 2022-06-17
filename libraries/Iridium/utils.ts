import { Base64 } from './encoders'

export const stringToTypedBase64 = (s: string): Base64 =>
  Buffer.from(s).toString('base64') as Base64
