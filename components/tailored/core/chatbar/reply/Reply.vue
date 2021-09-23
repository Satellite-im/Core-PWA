<template src="./Reply.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method setReplyChatbarContent DocsTODO
     * @description
     * @example
     */
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
