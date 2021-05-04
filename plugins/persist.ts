import VuexPersistence from 'vuex-persist'

const blacklist = ['setPin', 'setPhrase']

// @ts-ignore
export default ({ store }) => {
  new VuexPersistence({
    key: 'Satellite-Store',
    filter: (mutation) => {
      return !blacklist.includes(mutation.type)
    },
  }).plugin(store)
}
