<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'

import FileUpload from './fileupload/FileUpload.vue'

// @ts-ignore
import data from 'emoji-mart-vue-fast/data/all.json'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
// @ts-ignore
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
let emojiIndex = new EmojiIndex(data)


export default Vue.extend({
  components: {
    FileUpload,
    Picker,
  },
  data() {
    return {
      text: '',
      maxChars: 256,
      emojiIndex: emojiIndex,
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
    toggleEmojiPicker(e: any) {
      this.$data.showEmojiPicker = !this.$data.showEmojiPicker
      if (!this.$data.showEmojiPicker) {
        let div = this.$refs.emojiPicker
        // @ts-ignore
        div.$el.style.opacity = 0
      } else {
        let divChecker = setInterval(() => {
          let div = this.$refs.emojiPicker
          if (div) {
            // @ts-ignore
            let divProps = div.$el.getBoundingClientRect()
            this.$data.emojiPos.y = e.y - divProps.height - 24
            this.$data.emojiPos.x = e.x - divProps.width + 36
            // @ts-ignore
             div.$el.style.opacity = 1
            clearInterval(divChecker)
          }
        }, 10)
      }
    },
    addEmoji(emoji: any) {
      this.$data.text += emoji.native
      this.$data.showEmojiPicker = false
    }
  }
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>
