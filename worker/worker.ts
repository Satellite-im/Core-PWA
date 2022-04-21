import textile, { textileActions } from './textile'
import db, { dbActions } from './db'
import fs from './fs'

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, action, data }: { type: string; action: string; data: any } =
    event.data
  if (type === 'initialize') {
    const { id, pass, wallet } = data
    await db.initializeSchema()
    await db.initializeSearchIndexes()
    await textile.init({ id, pass, wallet })

    const pubkey = textile.getIdentityPublicKey()
    self.postMessage({ type: 'accounts/updateTextilePubkey', pubkey })

    const fsi = textile.bucket?.index
    if (fsi) {
      fs.import(fsi)
    }

    return
  }

  if (type === 'textile') {
    if (textileActions[action]) {
      await textileActions[action]({ action, ...data })
    } else {
      console.warn(`Unknown worker action: ${action}`)
    }
    return
  }

  if (type === 'db') {
    if (dbActions[action]) {
      await dbActions[action]({ action, ...data })
    } else {
      console.warn(`Unknown worker action: ${action}`)
    }
  }
})
