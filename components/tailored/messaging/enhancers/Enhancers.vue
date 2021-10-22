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
    mounted() {
      console.log("mounted in Enhancers dot vue")
      this.$store.commit('toggleEnhancers', { show: false, floating: true, position: [0,0] })
      this.handleOverflow()
    //    const el = document.querySelector('body')
       
    // if (el) {
    //   el.addEventListener('tester', this.handleOverflow)

    // }
    
  },
  destroyed() {
      console.log("destroyed")
    const el = document.querySelector('body')
    if (el) {
      el.removeEventListener('tester', this.handleOverflow)
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
        this.$store.dispatch('ui/addReaction', {
          emoji: emoji.native,
          reactor: this.$mock.user.name,
          groupID: this.ui.settingReaction.groupID,
          messageID: this.ui.settingReaction.messageID,
          replyID: this.ui.settingReaction.replyID,
        })
        console.log("addEmoji in Enhancers.vue")
        this.toggleEnhancers()

      } else {
        this.$store.commit(
          'ui/chatbarContent',
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
     * @description Toggles enhancers by commiting the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers() {
<<<<<<< HEAD
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
      })
=======
        console.log("toggleEnhancers in Enhancers.vue")
        console.log(this.$refs.enhancers)
  
      this.$store.commit('toggleEnhancers', { show: !this.ui.enhancers.show })
>>>>>>> b9599aa (feat(glyphOnClick): have Enhancer window render closer to enhancer button in chat)
      if (this.ui.settingReaction.status) {
        this.$store.commit('ui/settingReaction', {
          status: false,
          groupID: null,
          messageID: null,
        })
      }
    },
    handleOverflow(){
      const testerRef = this.$refs.enhancers as HTMLElement

      console.log(testerRef)

      return
    }
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
<style lang="less" src="./EmojiMart.less"></style>
