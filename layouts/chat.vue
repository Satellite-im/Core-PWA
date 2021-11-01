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
      <TailoredCoreServersList
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
        <TailoredCommandsPreview :message="ui.chatbarContent" />
        <TailoredCoreChatbarReply />
        <TailoredCoreChatbar />
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
      asidebar: true,
    }
  },
  computed: {
    ...mapState(['audio', 'ui', 'media', 'friends']),
    selectedGroup() {
      return this.$route.params.id
    },
  },
  mounted() {
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
