<template src="./TypingIndicator.html" />

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    users: {
      type: Array,
      default: () => [],
      required: false,
    },
  },
  mounted() {
    this.checkUsersTyping()
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
      if (this.users.length <= 3 && this.users.length) {
        return 1
      }
      if (this.users.length > 3) {
        return 2
      }
      return 0
    },
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
