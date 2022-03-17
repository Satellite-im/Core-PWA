// @ts-ignore
import Fuse from 'fuse.js'
// @ts-ignore
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'
import { Friend } from '~/types/ui/friends'

/**
 * @ported
 * Ported from Satellite Legacy
 */

/**
 * @method getAlphaSorted
 * @description Sort friends by name and groups them by the first letter of the name
 * @param friends array of friends
 * @returns
 * @example
 */
export function getAlphaSorted(friends: Array<Friend>) {
  const sorted = sortBy(friends, ['name'])
  const grouped = groupBy(sorted, (f: Friend) => {
    if (f.name && f.name.length) {
      return f.name.toUpperCase()[0]
    }
    return '-'
  })

  return grouped
}

/**
 * @method filterFriends
 * @description Filter friends by stored keyword and rebind the friends data
 * @param friends Array of friends to filter
 * @param keyword string keyword to search for
 * @returns
 * @example
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
  }
  return friends
}
