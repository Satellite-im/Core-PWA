<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Typing Indicator',
  props: {
    users: {
      type: Array,
      default: () => [
],
      required: false,
    },
  },
    /**
     * @methods checkUsersTyping
     * @description Checks the length of the users names array being fed to component
     * returns a numeric value that the template checks in order to display the correct ui to the user
     * @example <div id="text-container" v-if="checkUsersTyping() === 1">
     *          </div>
     */
  methods: {
    checkUsersTyping() {
      if(this.users.length <= 3 && this.users.length != 0) {
        return 1
      } else if (this.users.length > 3){
        return 0
      } else {
        return 2
      }
    }
  },
  mounted() {
    this.checkUsersTyping();
  }
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>