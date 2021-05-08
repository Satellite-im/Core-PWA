<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      text: '',
      maxChars: 256,
    }
  },
  computed: {
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
