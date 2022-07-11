import { Base64 } from './encoders'

export const stringToTypedBase64 = (s: string): Base64 =>
  Buffer.from(s).toString('base64') as Base64

/**
 * @function setInObject
 * @description Update an element's value in a deep nested object given a path
 * @param obj The deeply nested object
 * @param path The path to the deeply nested property in obj
 * @param value The new value for the property
 */
export function setInObject(obj: any, path: string, value: any) {
  const parts = path.split('/').filter((p) => p !== '')
  const lastIndex = parts.length - 1
  parts.forEach((part, index) => {
    if (index === lastIndex) {
      obj[parts[lastIndex]] = value
      return
    }
    obj = obj[part]
  })
}
