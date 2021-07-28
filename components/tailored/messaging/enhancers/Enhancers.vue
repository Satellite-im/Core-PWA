<template src="./Enhancers.html"></template>
<script lang="ts">
import Vue from 'vue'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
// @ts-ignore
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
// @ts-ignore
import data from 'emoji-mart-vue-fast/data/all.json'

const emojiIndex = new EmojiIndex(data)

export default Vue.extend({
  components: {
    Picker,
  },
  data() {
    return {
      emojiIndex,
      route: 'emoji',
    }
  },
  methods: {
    /**
     * Adds emoji to current text input
     * (emoji: any) Comes from <picker/> select event
     *
     */
    addEmoji(emoji: any) {
      this.$store.commit(
        'chatbarContent',
        this.$store.state.ui.chatbarContent + emoji.native
      )
    },
    setRoute(route: string) {
      this.$data.route = route
    },

    outside: function (e: Event) {
      this.$store.commit('toggleEnhancers', !this.$store.state.ui.showEnhancers)
    },
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
<style lang="less" src="./EmojiMart.less"></style>
