import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  head() {
    return {
      title: this.meta.title,
    }
  },
  computed: {
    ...mapState(['meta']),
  },
})
