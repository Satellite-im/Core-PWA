<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'
import { User } from '~/types/ui/user'

declare module 'vue/types/vue' {
  interface Vue {
    testFunc: () => void
  }
}
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
    isTyping: {
      type: Boolean,
      default: false,
      required: false,
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
    testFunc() {
      console.log('User Func')
    },
    /**
     * @method navigateToUser
     * @description Navigates to chat with specific user by pushing "/chat/direct/" + users ID to the router
     * Pretty sure this is just a placeholder for what will be the actual function?
     * @example ---
     */
    navigateToUser() {
      this.$router.push('/chat/direct')
    },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
