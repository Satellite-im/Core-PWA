<template src="./Scroll.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ChevronDownIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'Scroll',
  components: {
    ChevronDownIcon,
  },
  props: {
    autoScroll: {
      type: Boolean,
      default: true,
      required: false,
    },
    preventScrollOffset: {
      type: Number,
      default: 10,
      required: false,
    },
    olderMessagesScrollOffset: {
      type: Number,
      default: 300,
      required: false,
    },
    enableWrap: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      newMessageAlert: false,
      scrollObserver: null,
    }
  },
  computed: {
    ...mapState(['ui', 'textile']),
    classObject() {
      return {
        'enable-wrap': this.enableWrap,
        'auto-scroll': this.autoScroll,
        dark: this.theme === 'dark',
      }
    },
    isMediaOpen() {
      return this.$store.state.ui.showMedia
    },
  },
  watch: {
    // Once a new message is sent
    'textile.messageLoading'(value) {
      if (value === true) {
        this.autoScrollToBottom()
      }
    },
    'textile.activeConversation'() {
      this.autoScrollToBottom()
    },
  },
  mounted() {
    this.scrollObserver = new ResizeObserver(() => {
      // Autoscroll to the bottom only if the user is at the bottom of the chat
      !this.ui.isScrollOver && this.autoScrollToBottom()
    })
    this.scrollObserver.observe(this.$refs.scrollRef)
    this.scrollObserver.observe(this.$refs.scrollContent)
  },
  beforeDestroy() {
    if (this.scrollObserver) this.scrollObserver.disconnect()
  },
  methods: {
    /**
     * @method autoScrollToBottom DocsTODO
     * @description
     * @example
     */
    autoScrollToBottom() {
      if (this.$el && this.autoScroll) {
        this.$nextTick(() => {
          this.$el.scrollTop = this.$el.scrollHeight
          this.$store.commit('ui/setIsScrollOver', false)
        })
      }
    },
    /**
     * @method hideKeyboard
     * @description hide virtual keyboard on mobile
     */
    hideKeyboard() {
      if (this.$device.isMobile) {
        document.activeElement.blur()
      }
    },
    /**
     * @method onScrolled DocsTODO
     * @description
     * @example
     */
    onScrolled() {
      if (!this.$el) return

      const scrollHeight = this.$el.scrollHeight - this.preventScrollOffset
      const scrolled = this.$el.scrollTop + this.$el.clientHeight

      if (scrollHeight - this.olderMessagesScrollOffset > scrolled) {
        if (!this.ui.showOlderMessagesInfo) {
          this.$store.commit('ui/setShowOlderMessagesInfo', true)
        }
      } else if (this.ui.showOlderMessagesInfo) {
        this.$store.commit('ui/setShowOlderMessagesInfo', false)
      }

      if (scrollHeight > scrolled) {
        if (!this.ui.isScrollOver)
          this.$store.dispatch('ui/setIsScrollOver', true)
        return
      }

      if (this.ui.isScrollOver) {
        this.$store.dispatch('ui/setIsScrollOver', false)
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Scroll.less"></style>
