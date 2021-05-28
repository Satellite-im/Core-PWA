<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'

import FileUpload from './fileupload/FileUpload.vue'

export default Vue.extend({
  components: {
    FileUpload,
  },
  data() {
    return {
      text: '',
      maxChars: 256,
    }
  },
  computed: {
    /**
     * Computes the amount of characters left
     */
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
  },
  methods: {
    /**
     * When textarea for chat is changed, autoGrow handles chat section to grow to allow multiple line display
     */
    handleInputChange() {
      this.autoGrow()
    },
    autoGrow() {
      // made const variables from this.$refs --> HTMLElement through typecasting
      const messageBox = this.$refs.messageuser as HTMLElement
      const chatbarGroup = this.$refs.chatbar as HTMLElement

      // set default height to be auto, so it will expand as needed but NOT on every input
      messageBox.style.height = 'auto'

      if (messageBox.scrollHeight < 112) {
        messageBox.style.height = `${messageBox.scrollHeight + 2}px`
        chatbarGroup.style.height = `${messageBox.scrollHeight + 42}px`

      } else {
        messageBox.style.height = '112px'
        chatbarGroup.style.height = '152px'
      }
      messageBox.scrollTop = messageBox.scrollHeight
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
