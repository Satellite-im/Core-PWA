import Vue from 'vue'
import { mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

export default Vue.extend({
  computed: {
    ...mapState(['audio', 'ui', 'media', 'friends']),
  },
  created: () => {
    // can add functions here on start-up if needed
  },
  methods: {
    /**
     * @method toggleModal DocsTODO
     * @description
     * @example
     */
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'createServer',
        state: !this.ui.modals.createServer,
      })
    },
    /**
     * @method acceptCall DocsTODO
     * @description
     * @example
     */
    acceptCall() {
      this.$store.dispatch('media/acceptCall')
      this.$store.dispatch('sounds/playSound', Sounds.CONNECTED)
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      this.$store.dispatch('media/denyCall')
      this.$store.dispatch('sounds/playSound', Sounds.HANGUP)
    },
    /**
     * @method toggleMarketPlace DocsTODO
     * @description
     * @example
     */
    toggleMarketPlace() {
      this.$store.commit('ui/toggleModal', {
        name: 'marketplace',
        state: !this.ui.modals.marketplace,
      })
    },
  },
})
