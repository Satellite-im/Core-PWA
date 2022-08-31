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

import { Friend } from '~/types/ui/friends'
import { ProfileInfo } from '~/types/profile/profile'
import { Tab } from '~/types/ui/tab'

import { AddFriendEnum } from '~/libraries/Enums/enums'
import iridium from '~/libraries/Iridium/IridiumManager'

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
      loading: '' as AddFriendEnum,
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
      // also return if self
      if (
        this.accounts.details.textilePubkey ===
        this.ui.userProfile.textilePubkey
      ) {
        return true
      }
      return this.friends.all.some(
        (e: Friend) => e.textilePubkey === this.ui.userProfile.textilePubkey,
      )
    },
    status() {
      return (
        (this.ui.userProfile &&
          iridium.users.ephemeral.status[this.ui.userProfile.did]) ||
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
    // TODO: update for Iridium
    async createFriendRequest() {
      // this.loading = AddFriendEnum.SENDING
      // try {
      //   await this.$store.dispatch('friends/createFriendRequest', {
      //     friendToKey: new PublicKey(this.ui.userProfile.address),
      //   })
      //   this.$toast.show(this.$t('friends.request_sent') as string)
      // } catch (e: any) {
      //   this.$toast.show(this.$t(e.message) as string)
      // } finally {
      //   this.loading = AddFriendEnum.EMPTY
      // }
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
