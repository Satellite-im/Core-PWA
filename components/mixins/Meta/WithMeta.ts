import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  head() {
    const isUserRegistered = this.accounts.registrationStatus === 'registered'

    return {
      title: isUserRegistered ? this.meta.title : 'Satellite-Absolute',
    }
  },
  computed: {
    ...mapState(['accounts', 'meta']),
  },
})
