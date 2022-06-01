<template src="./Clickable.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Group } from '~/store/groups/types'

export default Vue.extend({
  mixins: [ContextMenu],
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      contextMenuValues: [
        { text: this.$t('context.send'), func: this.testFunc },
        // { text: this.$t('context.voice'), func: this.testFunc },
        // { text: this.$t('context.video'), func: this.testFunc },
        { text: this.$t('context.leave_group'), func: this.leaveGroup },
      ],
    }
  },
  methods: {
    testFunc(): void {
      this.$Logger.log('Group.vue Context', 'Test Function')
    },
    async leaveGroup(): Promise<void> {
      try {
        await this.$store.dispatch('groups/leaveGroup', {
          group: this.group,
        })
      } catch (e) {
        // this.$toast.success(
        //   this.$t('errors.friends.friend_not_removed') as string,
        // )
      }
    },
    /**
     * @method navigateToGroup
     * @description Navigates to a groups page by pushing "/chat/groups/" + groups address to router
     * @param address The groups address you'd like to route to
     * @example v-on:click="navigateToGroup(group.address)"
     */
    navigateToGroup(address: string): void {
      this.$router.push(`/chat/groups/${address}`)
      this.$store.dispatch('conversation/setConversation', {
        id: this.group.id,
        type: 'group',
        calling: false,
        participants: this.group.members,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Clickable.less"></style>
