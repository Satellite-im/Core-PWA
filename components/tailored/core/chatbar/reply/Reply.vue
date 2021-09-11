<template src="./Reply.html"></template>
<script lang="ts">
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  methods: {
    setReplyChatbarContent() {
      this.$store.commit('setReplyChatbarContent', {
        id: '',
        payload: '',
        from: '',
      })
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
