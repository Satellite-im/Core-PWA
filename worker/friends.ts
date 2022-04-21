import db from './db'
import { commit, dispatch } from './helpers'
import state from './state'
import { WorkerActions } from './types'

export const friendsActions: WorkerActions = {
  async initialize() {
    const friends = await db.friends.toArray()
    db.search.friends.update(friends)
    friends.forEach((friend) => {
      const friendExists = state.friends.find(
        (f) => f.address === friend.address,
      )

      if (!friendExists) {
        dispatch('friends/addFriend', { ...friend, stored: true })
        return
      }
      dispatch('friends/updateFriend', { ...friend, stored: true })
    })
  },
  async upsert({ friend }) {
    db.search.friends.add(friend)
    if (
      (await db.friends.where('address').equals(friend.address).count()) === 0
    ) {
      await db.friends.add(friend)
    }
    await db.friends.update(friend.address, friend)

    // update stored state
    commit('friends/setStored', friend)
  },
}
