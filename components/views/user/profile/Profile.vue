<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { UserPlusIcon, MoreVerticalIcon } from 'satellite-lucide-icons'
import { sampleProfileInfo } from '~/mock/profile'

declare module 'vue/types/vue' {
  interface Vue {
    closeModal: () => void
    route: string
  }
}

export default Vue.extend({
  components: {
    UserPlusIcon,
    MoreVerticalIcon,
  },
  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      route: 'about',
      tabs: [
        {
          text: 'About',
          route: 'about',
        },
        {
          text: 'Accounts',
          route: 'accounts',
        },
        {
          text: 'Activity',
          route: 'activity',
        },
        {
          text: 'Mutual',
          route: 'mutual',
        },
      ],
    }
  },
  computed: {
    ...mapState(['ui']),
    sample() {
      return sampleProfileInfo
    },
    profilePictureSrc() {
      const hash = this.ui.userProfile.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    closeProfileModal() {
      this.closeModal()
      this.$store.commit('ui/setUserProfile', {})
    },
    setRoute(route: string) {
      this.route = route
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
