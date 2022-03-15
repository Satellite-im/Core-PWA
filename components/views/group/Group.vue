<template src="./Group.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Group } from '~/types/ui/core'
import { Message } from '~/types/textile/mailbox'

declare module 'vue/types/vue' {
  interface Vue {
    testFunc: () => void
  }
}
export default Vue.extend({
  mixins: [ContextMenu],
  props: {
    group: {
      type: Object as PropType<Group>,
      default: () => ({
        name: '',
        address: '',
        motd: '',
      }),
      required: true,
    },
  },
  data() {
    return {
      contextMenuValues: [
        { text: 'Send Message', func: this.testFunc },
        { text: 'Voice Call', func: this.testFunc },
        { text: 'Video Call', func: this.testFunc },
        { text: 'Remove Friend', func: this.testFunc },
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
    },
  },
})
</script>

<style scoped lang="less" src="./Group.less"></style>
