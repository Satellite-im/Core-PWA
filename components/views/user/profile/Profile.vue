<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { UserPlusIcon, AwardIcon, EditIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { SettingsRoutes } from '~/store/ui/types'
import { Tab } from '~/types/ui/tab'
import { RootState } from '~/types/store/store'
import { sampleProfileInfo } from '~/mock/profile'
import { ProfileInfo } from '~/types/profile/profile'

export default Vue.extend({
  components: {
    UserPlusIcon,
    AwardIcon,
    EditIcon,
  },
  data() {
    return {
      loading: false,
      route: 'about',
      friends: iridium.friends.state.friends,
    }
  },
  computed: {
    ...mapState({
      user: (state) => (state as RootState).ui.fullProfile,
    }),
    sample(): ProfileInfo {
      return sampleProfileInfo
    },
    tabs(): Tab[] {
      return [
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
      ]
    },
    isFriend(): boolean {
      return this.user ? this.friends.includes(this.user.did) : false
    },
    isMe(): boolean {
      return this.user?.did === iridium.id
    },
  },
  methods: {
    closeProfileModal() {
      this.$store.commit('ui/setFullProfile', undefined)
    },
    setRoute(route: string) {
      this.route = route
    },
    async createFriendRequest() {
      if (!this.user) {
        return
      }
      this.loading = true
      await iridium.friends.requestCreate(this.user, false)
      this.loading = false
      this.$toast.show(this.$t('friends.request_sent') as string)
    },
    openSettings() {
      if (this.$device.isMobile) {
        this.$router.push('/mobile/settings')
      }
      this.closeProfileModal()
      this.$store.commit('ui/setSettingsRoute', SettingsRoutes.PERSONALIZE)
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
