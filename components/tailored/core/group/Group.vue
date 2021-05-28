<template src="./Group.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'
import { Group } from '~/types/ui/core'

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
        // @ts-ignore
        { text: 'Send Message', func: this.testFunc },
        // @ts-ignore
        { text: 'Voice Call', func: this.testFunc },
        // @ts-ignore
        { text: 'Video Call', func: this.testFunc },
        // @ts-ignore
        { text: 'Remove Friend', func: this.testFunc },
      ],
    }
  },
  methods: {
    testFunc() {
      console.log('User Func')
    },
    navigateToGroup() {
      this.$router.push('/chat/direct')
    },
  },
})
</script>

<style scoped lang="less" src="./Group.less"></style>
