/**
 * @function setInObject
 * @description Update an element's value in a deep nested object given a path
 * @param obj The deeply nested object
 * @param path The path to the deeply nested property in obj
 * @param value The new value for the property
   @returns true if the property's value was changed
 */
export function setInObject(obj: any, path: string, value: any): boolean {
  const parts = path.split('/').filter((p) => p !== '')
  const lastIndex = parts.length - 1
  return parts.every((part, index) => {
    if (index === lastIndex) {
      if (obj[parts[index]] === value) {
        return false
      }
      console.log(obj, parts, index)
      obj[parts[index]] = value
    }
    obj = obj[part]
    return true
  })
}
