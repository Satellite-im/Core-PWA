/**
 * This plugin enables persistant storage to the state.
 */

import VuexPersistence from 'vuex-persist'

// Add mutations here to blacklist saving to store
const blacklist = ['unlock', 'setAccountError', 'setPhrase', 'files']

export default ({ store }: { store: any }) => {
  new VuexPersistence({
    key: 'Satellite-Store',
    filter: (mutation) => {
      // Allows blacklisting of data we don't want stored
      return !blacklist.includes(mutation.type)
    },
  }).plugin(store)
}
