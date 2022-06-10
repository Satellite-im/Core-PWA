<template src="./Preview.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      getFiles: 'chat/getFiles',
      recipient: 'conversation/recipient',
    }),
  },
  methods: {
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    removeUploadItem(index: number) {
      this.$store.commit('chat/removeFile', {
        address: this.recipient.address,
        index,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Preview.less"></style>
