<template src="./Quick.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ModalWindows } from '~/store/ui/types'
import { Friend } from '~/types/ui/friends'

export default Vue.extend({
  name: 'Quick',
  data() {
    return {
      friends: [] as Friend[],
      isLoading: false,
      error: '',
      name: '',
    }
  },
  computed: {
    isInvalidName(): boolean {
      return (
        !this.name ||
        this.name.trim().length < this.$Config.chat.groupNameMinLength ||
        this.name.trim().length > this.$Config.chat.groupNameMaxLength
      )
    },
  },
  methods: {
    async confirm() {
      // if only 1 friend, direct to DM instead
      if (this.friends.length === 1) {
        this.$router.push(`/chat/direct/${this.friends[0].address}`)
        this.closeModal()
        return
      }
      if (this.isInvalidName) {
        this.error = this.$t('errors.chat.group_name', {
          min: this.$Config.chat.groupNameMinLength,
          max: this.$Config.chat.groupNameMaxLength,
        }) as string
        return
      }
      // create group
      try {
        this.isLoading = true
        this.error = ''
        const groupId = await this.$store.dispatch('groups/createGroup', {
          name: this.name,
        })

        await Promise.all(
          this.friends.map(({ address }: { address: string }) =>
            this.$store.dispatch('groups/sendGroupInvite', {
              group: { id: groupId },
              recipient: address,
            }),
          ),
        )
        this.closeModal()
        this.$router.push(`/chat/groups/${groupId}`)
      } catch (e: any) {
        this.error = `Failed to create group: ${e.message}`
      } finally {
        this.isLoading = false
      }
    },
    closeModal() {
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.QUICK_CHAT,
        state: false,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Quick.less"></style>
