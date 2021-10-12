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
    /**
     * @method addEmoji
     * @description Adds emoji to either the users current chatbar or a messages emoji reactions depending on state of this.ui.settingReaction.status
     * TODO: Change reactor in dispatch addReaction to current users name instead of 'Jpanay'
     * @param emoji Emoji-mart emoji event object
     * @example v-on:select="addEmoji"
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
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: string) {
      this.$data.route = route
    },
    /**
     * @method toggleEnhancers DocsTODO
     * @description Toggles enhancers by commiting the opposite of it's current value (this.ui.showEnhancers) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
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
