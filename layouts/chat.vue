<template>
  <div
    id="app-wrap"
    :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
      this.asidebar && this.selectedGroup
        ? 'is-open-aside'
        : 'is-collapsed-aside'
    } ${this.selectedGroup ? 'active-group' : null}`"
  >
    <div
      id="app"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        this.asidebar && this.selectedGroup
          ? 'is-open-aside'
          : 'is-collapsed-aside'
      } ${this.selectedGroup ? 'group' : 'direct'} ${
        $device.isMobile ? 'mobile-app' : ''
      }`"
      v-touch:swipe="sidebarSwipeHandler(this)"
      v-touch-options="{ swipeTolerance: 75 }"
    >
      <UiGlobal />
      <TailoredCoreSlimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :openModal="toggleModal"
      />
      <TailoredCoreSidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
        :users="friends.all"
        :groups="$mock.groups"
      />
      <div
        :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
      >
        <TailoredCoreStatusbar id="statusbar" :user="$mock.users[0]" />
        <TailoredCoreMedia
          v-if="$device.isMobile"
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :maxViewableUsers="10"
          :fullscreenMaxViewableUsers="6"
        />
        <TailoredCoreMedia
          v-else
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :maxViewableUsers="10"
          :fullscreenMaxViewableUsers="20"
        />
        <UiChatScroll
          :contents="ui.messages"
          :preventScrollOffset="500"
          :class="media.activeCall ? 'media-open' : ''"
          enableWrap
        >
          <Nuxt />
        </UiChatScroll>
        <TailoredMessagingEnhancers />
        <TailoredWalletMini v-if="$store.state.ui.modals.walletMini" />
        <TailoredCommandsPreview :message="ui.chatbarContent" />
        <TailoredCoreChatbarReply />
        <TailoredCoreChatbar :recipient="recipient" v-if="recipient" />
      </div>
      <TailoredCoreGroupAside
        :toggle="() => ($data.asidebar = !$data.asidebar)"
        :selectedGroup="
          $mock.groups.find((group) => group.address === this.selectedGroup)
        "
        :friends="$mock.friends"
      />
    </div>
    <TailoredCoreMobileNav v-if="$device.isMobile" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'
import Layout from '~/components/mixins/Layouts/Layout'

export default Vue.extend({
  name: 'ChatLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
      asidebar: !this.$device.isMobile,
    }
  },
  computed: {
    ...mapState(['audio', 'ui', 'media', 'friends']),
    selectedGroup() {
      return this.$route.params.id // TODO: change with groupid
    },
    recipient() {
      // It should not happen that someone tries to write to himself, but we should check
      // anyway
      const isMe =
        this.$route.params.address === this.$typedStore.state.accounts.active

      const recipient = isMe
        ? null
        : this.$typedStore.state.friends.all.find(
            (friend) => friend.address === this.$route.params.address
          )
      return recipient
    },
  },
  mounted() {
    this.$store.dispatch('ui/activateKeybinds')
    this.$Sounds.changeLevels(this.audio.volume / 100)
    this.$store.commit('ui/setTypingUser', this.$mock.users[0])

    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
