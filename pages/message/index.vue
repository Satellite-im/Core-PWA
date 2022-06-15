<template src="./NewMessage.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ArrowLeftIcon, PencilIcon } from 'satellite-lucide-icons'
import { Friend } from '~/types/ui/friends'

declare module 'vue/types/vue' {
  interface Vue {
    selectedAddress: string
  }
}
export default Vue.extend({
  components: {
    ArrowLeftIcon,
    PencilIcon,
  },
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
  watch: {
    search(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.selectedAddress = ''
      }
    },
  },
  methods: {
    async confirm() {
      // if only 1 friend, direct to DM instead
      if (this.friends.length === 1) {
        const friend = this.friends[0]
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
        this.$store.dispatch('conversation/setConversation', {
          id: friend.address,
          type: 'friend',
          participants: [friend],
          calling: false,
        })
        this.$router.push(`/chat/direct/${friend.address}`)
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
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
        this.$store.dispatch('conversation/setConversation', {
          id: groupId,
          type: 'group',
        })
        this.$router.push(`/chat/groups/${groupId}`)
      } catch (e: any) {
        this.error = `Failed to create group: ${e.message}`
      } finally {
        this.isLoading = false
      }
    },
    /**
     * @method goBack
     * @description navigate back
     */
    goBack() {
      this.$router.back()
    },
  },
})
</script>

<style scoped lang="less" src="./NewMessage.less"></style>
