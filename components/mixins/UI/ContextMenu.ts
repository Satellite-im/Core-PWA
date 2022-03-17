import Vue from 'vue'
import { mapState } from 'vuex'
import { ContextMenuItem } from '~/store/ui/types'
declare module 'vue/types/vue' {
  interface Vue {
    contextMenuValues: ContextMenuItem[]
  }
}
export default Vue.extend({
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
        this.$store.commit('ui/toggleContextMenu', true)
      }
      this.$store.commit('ui/setContextMenuPosition', e)
      this.$store.commit('ui/setContextMenuValues', this.contextMenuValues)
    },
  },
})
