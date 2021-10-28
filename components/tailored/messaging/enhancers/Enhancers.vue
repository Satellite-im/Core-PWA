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
      styleforEnhancer: {
        "background-color" : "red",
        "position" : "fixed",
        "left" : "calc(this.$store.state.ui.enhancers.position[0] + @enhancers-width - 100vw)",
        "bottom" : "calc(this.$store.state.ui.enhancers.position[1] + @enhancers-height - 100vh)",
      },
       styleTest: {
        "background-color" : "blue"
      },
    }

//     @enhancers-height: 30rem;
// @enhancers-width: 24rem;
    // calc(100vh - 200px)
    // clickX + contextMenu.clientWidth - window.innerWidth
  },
    mounted() {
      console.log("mounted in Enhancers dot vue")
      console.log(typeof this.$store.state.ui.enhancers.floating)
      console.log(this.$store.state.ui.enhancers.position[0])
    
  },
  destroyed() {
      console.log("destroyed")
    const el = document.querySelector('body')
    if (el) {
      // el.removeEventListener('tester', this.handleOverflow)
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  watch: {
    'this.$store.state.ui.enhancers': function() {
    console.log("watched data: " + this.$store.state.ui.enhancers.floating)
  }
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
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
      })
      if (this.ui.settingReaction.status) {
        this.$store.commit('ui/settingReaction', {
          status: false,
          groupID: null,
          messageID: null,
        })
      }
    },
    handleOverflow(event: MouseEvent){
      // const testerRef = this.$refs.enhancers as HTMLElement
          console.log(event)
      // console.log("in handleOverflow" + testerRef)
      // const contextMenu = this.$refs.contextMenu as HTMLElement
      // const position = this.ui.contextMenuPosition
      // let clickX = position.x
      // let clickY = position.y
      // console.warn("in ContextMenu.vue : " , [clickX, clickY])
      // const widthOverflow = clickX + contextMenu.clientWidth - window.innerWidth
      // const heightOverflow =
      //   clickY + contextMenu.clientHeight - window.innerHeight
      // if (widthOverflow > -8) {
      //   clickX -= contextMenu.clientWidth
      //   this.$store.commit('setContextMenuPosition', { x: clickX, y: clickY })
      // }
      // if (heightOverflow > -8) {
      //   clickY -= heightOverflow + 12
      //   this.$store.commit('setContextMenuPosition', { x: clickX, y: clickY })
      // }
      // return
    }
  },
})
</script>
<style scoped lang="less" src="./Enhancers.less"></style>
<style lang="less" src="./EmojiMart.less"></style>
