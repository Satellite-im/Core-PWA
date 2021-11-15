<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue, { PropType }  from 'vue'
import { User } from '~/types/ui/user'

export default Vue.extend({
  props: {
    users: {
      type: Array as PropType<Partial<User>>,
      default: () => [{
        name: '',
        status: '',
      }],
      required: false,
    },
  },
  methods: {
    checkUsersTyping () {
      console.log('Checking', this.users)
    },
    mounted() {
       this.checkUsersTyping()
    }
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
