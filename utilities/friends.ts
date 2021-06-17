// @ts-ignore
import sortBy from 'lodash/sortBy'
// @ts-ignore
import groupBy from 'lodash/groupBy'
import Fuse from 'fuse.js'

import { Friend } from '~/types/ui/core'

/**
 * @ported
 * Ported from Satellite Legacy
 */

/** @method
 * Sort friends by name and groups them by the first
 * letter of the name
 * @name getAlphaSorted
 * @param friends array of friends
 */
export function getAlphaSorted(friends: Array<Friend>) {
  const sorted = sortBy(friends, ['name'])
  const grouped = groupBy(sorted, (f: Friend) => {
    if (f.name && f.name.length) {
      return f.name.toUpperCase()[0]
    } else {
      return '-'
    }
  })

  return grouped
}

/** @method
 * Filter friends by stored keyword and
 * rebind the friends data
 * @name filterFriends
 * @param friends Array of friends to filter
 * @param keyword string keyword to search for
 */
export function getFilteredFriends(friends: Array<Friend>, keyword: string) {
  if (keyword) {
    const options = {
      includeScore: false,
      keys: ['name'],
    }
    const fuse = new Fuse(friends, options)
    const result = fuse.search(keyword)
    return result.map((i: any) => i.item)
  } else {
    return friends
  }
}
