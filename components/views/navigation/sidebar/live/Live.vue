<template src="./Live.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RadioIcon, XIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { TrackKind } from '~/libraries/WebRTC/types'
import { GroupMemberDetails } from '~/libraries/Iridium/groups/types'
import Group from '~/libraries/Iridium/groups/Group'
import type { Friend, User } from '~/libraries/Iridium/friends/types'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  components: {
    RadioIcon,
    XIcon,
  },
  data() {
    return {
      webrtc: iridium.webRTC,
      users: iridium.users.state,
      groups: iridium.groups.state,
      chat: iridium.chat.state,
    }
  },
  computed: {
    ...mapState(['ui']),
    existLiveChat(): boolean {
      // return Object.values(this.friends.state.details).some(
      //   (friend) => friend.did === this.webrtc.state.activeCall?.did,
      // )
      return false // TODO : Fix later
    },
    selUserName(): string {
      const sUser = Object.values(this.users).find(
        (friend) => friend.did === this.webrtc.state.activeCall?.did,
      )
      return sUser?.name ?? ''
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
    details(): User | Group | undefined {
      if (!this.conversation) {
        return undefined
      }
      if (this.isGroup) {
        return this.groups[this.conversation.id]
      }
      const participant = this.conversation?.participants.find(
        (f) => f !== iridium.connector?.id,
      )
      if (!participant) {
        return
      }
      return Object.values(this.users).find((f) => f.did === participant)
    },
    groupMembers(): GroupMemberDetails[] {
      const members = (this.details as Group).members ?? []
      return Object.values(members)
    },
    enableRTC(): boolean {
      if (this.isGroup) {
        const memberIds = this.groupMembers.map((m) => m.id)
        return Object.values(this.users).some(
          (friend: Friend) =>
            memberIds.includes(friend.did) && friend.status === 'online',
        )
      }
      // Check current recipient is on the user's friends list
      const friend = Object.values(this.users).find(
        (f) => f.did === (this.details as User)?.did,
      )
      return friend?.status === 'online'
    },
  },
  methods: {
    hangUp() {
      this.webrtc.hangUp()
    },
    async call(kinds: TrackKind[]) {
      if (!this.enableRTC || !this.details) {
        return
      }
      try {
        await this.webrtc.call(this.details, kinds)
      } catch (e: any) {
        this.$toast.error(this.$t(e.message) as string)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Live.less"></style>
