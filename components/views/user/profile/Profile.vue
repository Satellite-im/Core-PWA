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
import { ProfileInfo } from '~/types/profile/profile'
import { Tab } from '~/types/ui/tab'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'

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
    user: {
      type: Object as Partial<User> | undefined,
      default: () => {
        return {
          name: iridium.profile.state?.name ?? '',
          did: iridium.profile.state?.did ?? '',
          status: iridium.profile.state?.status ?? '',
          about: iridium.profile.state?.about ?? '',
          location: iridium.profile.state?.location ?? '',
          note: iridium.profile.state?.note ?? '',
        }
      },
    },
  },
  data() {
    return {
      loading: false as Boolean,
      route: 'about' as string,
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
      ] as Tab[],
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'accounts']),
    sample(): ProfileInfo {
      return sampleProfileInfo
    },
    profilePictureSrc(): string {
      const hash = this.ui.userProfile.profilePicture
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    // temp until we get real badges
    badgeColors(): string[] {
      return ['', '#F6CC6B', '#61CEA4', '#DA716F']
    },
    isFriend(): boolean {
      return (
        (this.user?.did &&
          !!iridium.friends.state.friends.find((f) => f === this.user.did)) ||
        iridium.profile.state?.did === this.user.did
      )
    },
    status() {
      return (
        (this.user?.did && iridium.users.ephemeral.status[this.user.did]) ||
        'offline'
      )
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
    // TODO: confirm that this works once you can view profiles of non-friends
    async createFriendRequest() {
      this.loading = true
      await iridium.friends.requestCreate(this.user, false)
      this.loading = false
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
