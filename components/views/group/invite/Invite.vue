<template src="./Invite.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Friend } from '~/types/ui/friends'
import { Group } from '~/store/groups/types'
import { Conversation } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'GroupInvite',
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
  },
  data() {
    return {
      recipients: [] as Friend[],
      isLoading: false,
      recipient: '',
      error: '',
    }
  },
  computed: {
    groupMembers(): string[] {
      return this.conversation?.participants ?? []
    },
    conversationId(): Conversation['id'] | undefined {
      return this.$route.params.id
    },
    conversation(): Conversation | undefined {
      if (!this.conversationId) {
        return undefined
      }
      return iridium.chat.state.conversations[this.conversationId]
    },
  },
  methods: {
    async confirm() {
      if (!this.recipients.length) {
        return
      }
      try {
        this.error = ''
        this.isLoading = true

        const groupId = this.$route.params.id

        await Promise.all(
          this.recipients.map(async (recipient) => {
            console.log('add', recipient.did, groupId)
            await iridium.groups.addMemberToGroup(groupId, recipient.did)
          }),
        )

        this.$store.commit('ui/toggleModal', {
          name: 'groupInvite',
          state: { isOpen: false },
        })
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Invite.less"></style>
