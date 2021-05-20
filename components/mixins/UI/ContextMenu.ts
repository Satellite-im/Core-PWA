// @ts-nocheck
export const ContextMenu = {
  methods: {
    contextMenu(e: any) {
      e.preventDefault()
      let contextMenuStatus = this.$store.state.ui.contextMenuStatus
      if (!contextMenuStatus) {
        this.$store.commit('toggleContextMenu', true)
      }
      this.$store.commit('setContextMenuPosition', { x: e.x, y: e.y })
      this.$store.commit('setContextMenuValues', this.$data.contextMenuValues)
    },
  },
}
