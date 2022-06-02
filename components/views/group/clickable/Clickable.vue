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
        { text: this.$t('context.remove'), func: this.testFunc },
      ],
    }
  },
  methods: {
    testFunc(): void {
      this.$Logger.log('Group.vue Context', 'Test Function')
    },
    /**
     * @method navigateToGroup
     * @description Navigates to a groups page by pushing "/chat/groups/" + groups address to router
     * @param address The groups address you'd like to route to
     * @example v-on:click="navigateToGroup(group.address)"
     */
    navigateToGroup(address: string) {
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
