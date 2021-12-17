<template>
  <div
    id="app-wrap"
    :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
      asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
    } ${selectedGroup ? 'active-group' : null}`"
  >
    <div
      id="app"
      v-touch:swipe="sidebarSwipeHandler(this)"
      v-touch-options="{ swipeTolerance: 75 }"
      :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
        asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
      } ${selectedGroup ? 'group' : 'direct'} ${
        $device.isMobile ? 'mobile-app' : ''
      }`"
    >
      <UiGlobal />
      <Slimbar
        :servers="$mock.servers"
        :unreads="$mock.unreads"
        :open-modal="toggleModal"
      />
      <Sidebar
        :toggle="() => ($data.sidebar = !$data.sidebar)"
        :users="friends.all"
        :groups="$mock.groups"
      />
      <div
        :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
      >
        <Toolbar
          id="toolbar"
          :server="recipient || $mock.users[0]"
          :user="$mock.users[0]"
        />
        <Media
          v-if="$device.isMobile"
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :max-viewable-users="10"
          :fullscreen-max-viewable-users="6"
        />
        <Media
          v-else
          :fullscreen="ui.fullscreen"
          :users="$mock.callUsers"
          :max-viewable-users="10"
          :fullscreen-max-viewable-users="20"
        />
        <UiChatScroll
          :contents="ui.messages"
          :prevent-scroll-offset="500"
          :class="media.activeCall ? 'media-open' : ''"
          enable-wrap
        >
          <Nuxt />
        </UiChatScroll>
        <Enhancers />
        <WalletMini v-if="ui.modals.walletMini" />
        <ChatbarCommandsPreview :message="ui.chatbarContent" />
        <ChatbarReply v-if="recipient" />
        <Chatbar :recipient="recipient" />
      </div>
      <GroupAside
        :toggle="() => ($data.asidebar = !$data.asidebar)"
        :selected-group="
          $mock.groups.find((group) => group.address === selectedGroup)
        "
        :friends="$mock.friends"
      />
    </div>
    <MobileNav v-if="$device.isMobile" />
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
            (friend) => friend.address === this.$route.params.address,
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
