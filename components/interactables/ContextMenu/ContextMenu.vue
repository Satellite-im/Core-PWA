<template src="./ContextMenu.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { ContextMenuItem, EmojiUsage } from '~/store/ui/types'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters('ui', ['getSortedMostUsedEmojis']),
    ...mapState(['settings', 'ui']),
    mostUsedEmojis(): EmojiUsage[] {
      return this.getSortedMostUsedEmojis.slice(0, 4)
    },
  },
  mounted() {
    this.handleOverflow()
    const el = document.querySelector('body')
    if (el) {
      el.addEventListener('contextmenu', this.handleOverflow)
    }
  },
  beforeDestroy() {
    const el = document.querySelector('body')
    if (el) {
      el.removeEventListener('contextmenu', this.handleOverflow)
    }
  },
  methods: {
    /**
     * @method close
     * @description Closes context menu by setting toggleContextMenu in state to false
     */
    close() {
      this.$store.commit('ui/toggleContextMenu', false)
    },
    /**
     * @method handle
     * @description Executes callback function and closes the ContextMenu component
     * @param func Function to execute
     * @example @click="handle(item.func)"
     */
    handle(func: Function) {
      func()
      this.close()
    },
    /**
     * @method isRedText
     * @description sets red text class based on text value
     * @param {ContextMenuItem} item context item
     */
    isRedText(item: ContextMenuItem): boolean {
      const redTextList = [
        this.$t('context.delete'),
        this.$t('context.remove'),
        this.$t('context.leave_group'),
      ]
      return redTextList.includes(item.text)
    },
    /**
     * @method handleOverflow
     * @description Ensures contextMenu is positioned correctly by calculating if the div overflows the page and respositioning as needed.
     * Corrects position by committing an adjusted position to setContextMenuPosition in state
     * @example
     */
    handleOverflow() {
      const contextMenu = this.$refs.contextMenu as HTMLElement
      if (!contextMenu) return
      const position = this.ui.contextMenuPosition
      let clickX = position.x
      let clickY = position.y
      const widthOverflow = clickX + contextMenu.clientWidth - window.innerWidth
      const heightOverflow =
        clickY + contextMenu.clientHeight - window.innerHeight
      if (widthOverflow > -8) {
        clickX -= contextMenu.clientWidth
        this.$store.commit('ui/setContextMenuPosition', {
          x: clickX,
          y: clickY,
        })
      }
      if (heightOverflow > -8) {
        clickY -= heightOverflow + 12
        this.$store.commit('ui/setContextMenuPosition', {
          x: clickX,
          y: clickY,
        })
      }
    },
  },
})
</script>
<style scoped lang="less" src="./ContextMenu.less"></style>
