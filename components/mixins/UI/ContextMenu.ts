// @ts-nocheck
import { mapState } from 'vuex'
export const ContextMenu = {
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method contextMenu
     * @description Toggles ContextMenu mixin with related component ContextMenu values
     * @param e Context menu event object
     * @example v-on:context-menu="contextMenu"
     */
    contextMenu(e: Event) {
      e.preventDefault()
      const contextMenuStatus = this.ui.contextMenuStatus
      if (!contextMenuStatus) {
        this.$store.commit('toggleContextMenu', true)
      }
      this.$store.commit('setContextMenuPosition', e)
      this.$store.commit('setContextMenuValues', this.$data.contextMenuValues)
    },
  },
}

export default ContextMenu