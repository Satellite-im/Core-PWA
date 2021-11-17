<template src="./Quick.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Quick',
  data() {
    return {
      friends: [],
    }
  },
  watch: {
    friends(newFriends) {
      console.log(newFriends)
    },
  },
})
</script>

<style scoped lang="less" src="./Quick.less"></style>
