<template src="./Toolbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import {
  PhoneCallIcon,
  UserPlusIcon,
  MenuIcon,
  VideoIcon,
} from 'satellite-lucide-icons'

import { mapGetters } from 'vuex'
import iridium from '~/libraries/Iridium/IridiumManager'
import Group from '~/libraries/Iridium/groups/Group'
import { TrackKind } from '~/libraries/WebRTC/types'
import type { User } from '~/libraries/Iridium/friends/types'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { GroupMemberDetails } from '~/libraries/Iridium/groups/types'
import { useWebRTC } from '~/libraries/Iridium/webrtc/WebRTCManager'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    MenuIcon,
    VideoIcon,
  },
  setup() {
    const { isActiveCall } = useWebRTC()

    return { isActiveCall }
  },
  data() {
    return {
      friends: iridium.friends.state.details,
      groups: iridium.groups.state,
      isGroupInviteVisible: false,
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    ...mapGetters('ui', ['allUnseenNotifications']),
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[this.conversationId]
    },
    isGroup(): boolean {
      return this.conversation?.type === 'group'
    },
    details(): User | Group | undefined {
      if (!this.conversation) {
        return undefined
      }
      if (this.isGroup) {
        return this.groups[this.conversation.id]
      }
      const friendDid = this.conversation.participants.find(
        (f) => f !== iridium.connector?.id,
      )
      if (!friendDid) {
        return
      }
      return this.friends[friendDid]
    },
    groupMembers(): GroupMemberDetails[] {
      const members = (this.details as Group).members ?? []
      return Object.values(members)
    },
    enableRTC(): boolean {
      // todo- hook up to usermanager
      return false
      // if (this.isGroup) {
      //   const memberIds = this.groupMembers.map((m) => m.id)
      //   return this.friends.some(
      //     (friend: Friend) =>
      //       memberIds.includes(friend.did) && friend.status === 'online',
      //   )
      // }
      // // Check current recipient is on the user's friends list
      // const friend = this.friends.find(
      //   (f) => f.did === (this.details as User)?.did,
      // )
      // return friend?.status === 'online'
    },
  },
  methods: {
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC || !this.details) {
        return
      }
      try {
        await iridium.webRTC.call(this.details, kinds)
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
    async handleCall() {
      if (this.isGroup) {
        return
      }
      if (!this.enableRTC || this.isActiveCall) {
        return
      }
      await this.call(['audio'])
    },
  },
})
</script>

<style scoped lang="less" src="./Toolbar.less"></style>
