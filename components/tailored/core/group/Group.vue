<template src="./Group.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'
import { Group } from '~/types/ui/core'

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
      console.log('User Func')
    },
    navigateToGroup(address: string) {
      this.$router.push(`/chat/direct?group=${address}`)
    },
  },
})
</script>

<style scoped lang="less" src="./Group.less"></style>
