<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/core'
import { ContextMenu } from '../../../mixins/UI/ContextMenu'

export default Vue.extend({
  mixins: [ContextMenu],
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
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
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
