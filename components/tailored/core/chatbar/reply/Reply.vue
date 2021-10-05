<template src="./Reply.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'

// @ts-ignore
import { XIcon } from 'vue-feather-icons'

export default Vue.extend({
  components: {
    VueMarkdown,
    XIcon,
  },
  computed: {
    ...mapState(['ui']),
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
