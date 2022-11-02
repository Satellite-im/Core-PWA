import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
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
      obj[parts[index]] = value
    }
    obj = obj[part]
    return true
  })
}

/**
 * @function delay
 * @description Let's you wait for a specific amount of milliseconds
 * @param ms number of milliseconds to wait
 * @returns a promise that resolves when the time has passed
 */
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function uploadFile(
  file: File,
  participants: User['did'][],
): Promise<{ cid: string; valid: boolean } | undefined> {
  const fileBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(fileBuffer)
  return new Promise((resolve) => {
    if (!iridium.connector?.p2p.primaryNodeID) {
      throw new Error('not connected to primary node')
    }

    iridium.connector
      ?.fileStore(
        { file: buffer, name: file.name, type: file.type },
        {
          syncPin: true,
          encrypt: {
            recipients: [...participants, iridium.connector?.p2p.primaryNodeID],
          },
        },
      )
      .then((cid: string) => {
        const onSyncPin = (msg: any) => {
          const { payload } = msg
          const { body } = payload
          const { result } = body
          if (result.originalCID === cid.toString()) {
            resolve({ cid: result.cid, valid: result.valid })
          }
          iridium.connector?.p2p?.off('node/message/sync/pin', onSyncPin)
        }

        iridium.connector?.p2p.on('node/message/sync/pin', onSyncPin)
        setTimeout(() => {
          iridium.connector?.p2p?.off('node/message/sync/pin', onSyncPin)
          resolve(undefined)
        }, 60000)
      })
  })
}

/**
 * @function isShortDid
 * @description check if the string is in the shortDID format
 * @param str string to check
 * @returns boolean
 */
export function isShortDid(str: string) {
  const lastIndex = str.lastIndexOf('#')
  if (lastIndex === -1) return false

  const firstPart = str.substring(0, lastIndex)
  const secondPart = str.substring(lastIndex + 1)

  return firstPart.length !== 0 && secondPart.length === 6
}

/**
 * @function isDid
 * @description check if the string is in the did format
 * @param str string to check
 * @returns boolean
 */
export function isDid(str: string) {
  return str.startsWith('did:key:') && str.length === 8 + 48
}
