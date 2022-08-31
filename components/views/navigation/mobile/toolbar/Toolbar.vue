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
import { TrackKind } from '~/libraries/WebRTC/types'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { GroupMemberDetails } from '~/libraries/Iridium/groups/types'
import { GroupState } from '~/libraries/Iridium/groups/GroupManager'
import { User } from '~/libraries/Iridium/users/types'
import { Friend } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  components: {
    PhoneCallIcon,
    UserPlusIcon,
    MenuIcon,
    VideoIcon,
  },
  data() {
    return {
      users: iridium.users.state,
      userStatus: iridium.users.userStatus,
      groups: iridium.groups.state,
      isGroupInviteVisible: false,
      webrtc: iridium.webRTC.state,
      chat: iridium.chat.state,
    }
  },
  computed: {
    ...mapGetters('ui', ['allUnseenNotifications']),
    isActiveCall(): boolean {
      return iridium.webRTC.isActiveCall(this.$route.params.id)
    },
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return this.chat.conversations[this.conversationId]
    },
    isGroup(): boolean {
      return this.conversation?.type === 'group'
    },
    details(): User | GroupState | undefined {
      if (!this.conversation) {
        return undefined
      }
      if (this.isGroup) {
        return this.groups[this.conversation.id]
      }
      const friendDid = this.conversation?.participants.find(
        (f: string) => f !== iridium.connector?.id,
      )
      if (!friendDid) {
        return
      }
      return this.users[friendDid]
    },
    groupMembers(): GroupMemberDetails[] {
      const members = (this.details as GroupState).members ?? []
      return Object.values(members)
    },
    enableRTC(): boolean {
      if (this.isGroup) {
        const memberIds = this.groupMembers.map((m) => m.id)
        return memberIds.some((id) => this.userStatus[id] === 'online')
      }
      const did = (this.details as User)?.did
      return ((did && this.userStatus[did]) ?? null) === 'online'
    },
  },
  methods: {
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC || !this.details) {
        return
      }
      try {
        await iridium.webRTC.call(this.details as Friend, kinds)
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
