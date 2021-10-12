<template src="./Enhancers.html"></template>
<script lang="ts">
import Vue from 'vue'
import 'emoji-mart-vue-fast/css/emoji-mart.css'
import { mapState } from 'vuex'
import { SmileIcon, GridIcon, ImageIcon } from 'satellite-lucide-icons'
// @ts-ignore
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
// @ts-ignore
import data from 'emoji-mart-vue-fast/data/all.json'

const emojiIndex = new EmojiIndex(data)

export default Vue.extend({
  components: {
    Picker,
    SmileIcon,
    GridIcon,
    ImageIcon,
  },
  data() {
    return {
      emojiIndex,
      route: 'emoji',
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * Adds emoji to current text input
     * (emoji: any) Comes from <picker/> select event
     */
    addEmoji(emoji: any) {
      if (this.ui.settingReaction.status) {
        this.$store.dispatch('addReaction', {
          emoji: emoji.native,
          reactor: this.$mock.user.name,
          groupID: this.ui.settingReaction.groupID,
          messageID: this.ui.settingReaction.messageID,
          replyID: this.ui.settingReaction.replyID,
        })
        this.toggleEnhancers()
      } else {
        this.$store.commit(
          'chatbarContent',
          this.ui.chatbarContent + emoji.native
        )
      }
    },
    setRoute(route: string) {
      this.$data.route = route
    },
    toggleEnhancers() {
      this.$store.commit('toggleEnhancers', !this.ui.showEnhancers)
      if (this.ui.settingReaction.status) {
        this.$store.commit('settingReaction', {
          status: false,
          groupID: null,
          messageID: null,
        })
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
<style lang="less" src="./EmojiMart.less"></style>
