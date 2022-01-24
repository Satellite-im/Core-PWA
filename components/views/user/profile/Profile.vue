<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  UserPlusIcon,
  MoreVerticalIcon,
  AwardIcon,
} from 'satellite-lucide-icons'
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
    AwardIcon,
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
          text: this.$t('modal.profile.about.tab'),
          route: 'about',
        },
        {
          text: this.$t('modal.profile.accounts'),
          route: 'accounts',
        },
        {
          text: this.$t('modal.profile.activity.tab'),
          route: 'activity',
        },
        {
          text: this.$t('modal.profile.mutual.tab'),
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
    // temp until we get real badges
    badgeColors() {
      return ['', '#F6CC6B', '#61CEA4', '#DA716F']
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
