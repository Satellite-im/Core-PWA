// @ts-nocheck
import { mapState } from 'vuex'
export const ContextMenu = {
  computed: {
    ...mapState(['ui']),
  },
  methods: {
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