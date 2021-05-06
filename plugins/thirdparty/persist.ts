/**
 * This plugin enables persistant storage to the state.
 */

import VuexPersistence from 'vuex-persist'

// Add mutations here to blacklist saving to store
const blacklist = ['setPin', 'setPhrase']

// @ts-ignore
export default ({ store }) => {
  new VuexPersistence({
    key: 'Satellite-Store',
    filter: (mutation) => {
      // Allows blacklisting of data we don't want stored
      return !blacklist.includes(mutation.type)
    },
  }).plugin(store)
}
