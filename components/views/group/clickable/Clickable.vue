<template src="./Clickable.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Group } from '~/store/groups/types'
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
    console.log('gg', this.group)
    return {
      contextMenuValues: [
        { text: this.$t('context.send'), func: this.testFunc },
        { text: this.$t('context.voice'), func: this.testFunc },
        { text: this.$t('context.video'), func: this.testFunc },
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
    },
  },
})
</script>

<style scoped lang="less" src="./Clickable.less"></style>
