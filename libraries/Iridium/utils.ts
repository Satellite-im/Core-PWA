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

  return new Promise((resolve) => {
    if (!iridium.connector?.p2p.primaryNodeID) {
      throw new Error('not connected to primary node')
    }

    iridium.connector
      ?.store(
        { fileBuffer, name: file.name, size: file.size, type: file.type },
        {
          syncPin: true,
          encrypt: {
            recipients: [...participants, iridium.connector?.p2p.primaryNodeID],
          },
        },
      )
      .then((cid) => {
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
        }, 30000)
      })
  })
}
