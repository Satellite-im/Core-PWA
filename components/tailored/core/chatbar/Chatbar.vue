<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
// @ts-ignore
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
// @ts-ignore
import data from 'emoji-mart-vue-fast/data/all.json'
import FileUpload from './fileupload/FileUpload.vue'

const emojiIndex = new EmojiIndex(data)

export default Vue.extend({
  components: {
    FileUpload,
    Picker,
  },
  data() {
    return {
      text: '',
      maxChars: 256,
      emojiIndex,
      emojiPos: { x: 0, y: 0 },
      showEmojiPicker: false,
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
     * Toggles emoji div: <picker/>
     * (e: any) Comes from <picker/> contextmenu event
     */
    toggleEmojiPicker() {
      this.$data.showEmojiPicker = !this.$data.showEmojiPicker
      const emojiDiv = (this.$refs.emojiPicker as Vue).$el as SVGElement
      const chatbarDiv = (this.$refs
        .chatbar as Element).getBoundingClientRect() as DOMRect
      this.$data.emojiPos.y = chatbarDiv.bottom - emojiDiv.clientHeight - 72
      this.$data.emojiPos.x = window.innerWidth - emojiDiv.clientWidth - 36
    },
    /**
     * Adds emoji to current text input
     * (emoji: any) Comes from <picker/> select event
     */
    addEmoji(emoji: any) {
      this.$data.text += emoji.native + ' '
      this.$data.showEmojiPicker = false
    },
    /*
     * When textarea for chat is changed, autoGrow handles chat section to grow to allow multiple line display
     */
    autoGrow() {
      // made const variables from this.$refs --> HTMLElement through typecasting
      const messageBox = this.$refs.messageuser as HTMLElement
      const chatbarGroup = this.$refs.chatbar as HTMLElement
      const wrap = this.$refs.wrap as HTMLElement

      // set default height to be auto, so it will expand as needed but NOT on every input
      messageBox.style.height = 'auto'
      if (this.$data.text.split('\n').length > 1) {
        wrap.classList.add('expanded')
      } else {
        wrap.classList.remove('expanded')
      }
      if (messageBox.scrollHeight < 112) {
        messageBox.style.height = `${messageBox.scrollHeight + 2}px`
        chatbarGroup.style.height = `${messageBox.scrollHeight + 42}px`
      } else {
        messageBox.style.height = '112px'
        chatbarGroup.style.height = '152px'
      }
      messageBox.scrollTop = messageBox.scrollHeight
    },
    handleInputChange() {
      // @ts-ignore
      this.autoGrow()
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
<style lang="less" src="./EmojiMart.less"></style>
