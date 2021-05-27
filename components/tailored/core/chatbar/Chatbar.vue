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
    methods: {
    handleInputChange () {
      this.autoGrow ()
    },
    autoGrow () {
      let messageBox = document.querySelector('.messageuser')!;
      let messElem = messageBox.getBoundingClientRect();
      let chatGroup = document.querySelector('#chatbar')!;
      let chatElem = chatGroup.getBoundingClientRect();



      messageBox.style.height = 'auto'
      console.log(chatElem.height)
      console.log(messElem.height)


      if (messageBox.scrollHeight < 112) {
        messageBox.style.height = messageBox.scrollHeight + 2 + 'px'
        chatGroup.style.height = messageBox.scrollHeight + 42 + 'px'
      } else {
        messageBox.style.height = '112px'
        chatGroup.style.height = '152px'
      }
      messageBox.style.scrollTop = messageBox.style.scrollHeight
    },
  },
  computed: {
    /**
     * Computes the amount of characters left
     */
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
