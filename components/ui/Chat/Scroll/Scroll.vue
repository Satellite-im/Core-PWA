<template src="./Scroll.html" />

<script>
import Vue from 'vue'

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
      default: 500,
      required: false,
    },
    enableWrap: {
      type: Boolean,
      default: false,
      required: false,
    },
    contents: {
      /* Content Type could be any value in below array */
      type: [Array, Object, String, Number],
      default: '',
      required: false,
    },
  },
  data() {
    return {
      loaded: false,
      newMessageAlert: false,
    }
  },
  computed: {
    classObject() {
      return {
        'enable-wrap': this.enableWrap,
        'auto-scroll': this.autoScroll,
        dark: this.theme === 'dark',
      }
    },
  },
  watch: {
    contents: {
      deep: true,
      handler() {
        const lastMsg = this.contents[this.contents.length - 1]
        if (
          (lastMsg.from === this.$mock.user.address ||
            !this.$store.state.ui.unreadMessage) &&
          !this.$store.state.ui.isReacted
        ) {
          this.autoScrollToBottom()
          return
        }
        this.newMessageAlert = true
        this.$store.dispatch('ui/setIsReacted', false)
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.autoScrollToBottom()
    })
  },
  beforeDestroy() {
    this.loaded = false
  },
  methods: {
    /**
     * @method autoScrollToBottom DocsTODO
     * @description
     * @example
     */
    autoScrollToBottom() {
      const interval = this.loaded ? 100 : 1000
      if (this.$el && this.autoScroll) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$el.scrollTop = 0
            this.loaded = true
            this.$store.dispatch('ui/setIsScrollOver', false)
          })
        }, interval)
      }
    },
    /**
     * @method onScrolled DocsTODO
     * @description
     * @example
     */
    onScrolled() {
      if (!this.$el) return

      if (
        Math.abs(this.$el.scrollTop) > this.preventScrollOffset &&
        !this.$store.state.ui.isScrollOver
      ) {
        this.$store.dispatch('ui/setIsScrollOver', true)
        return
      }

      if (this.$store.state.ui.isScrollOver) {
        this.$store.dispatch('ui/setIsScrollOver', false)
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Scroll.less"></style>
