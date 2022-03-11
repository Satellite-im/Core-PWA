<template src="./Scroll.html" />

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import vueCustomScrollbar from 'vue-custom-scrollbar'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'

import { ChevronDownIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'Scroll',
  components: {
    ChevronDownIcon,
    vueCustomScrollbar,
  },
  props: {
    verticalScroll: {
      type: Boolean,
      default: true,
      required: false,
    },
    horizontalScroll: {
      type: Boolean,
      default: false,
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
    scrollbarVisibility: {
      type: String,
      default: 'always',
      required: false,
    },
  },
  data() {
    return {
      settings: {
        suppressScrollY: !this.verticalScroll,
        suppressScrollX: !this.horizontalScroll,
        wheelPropagation: false,
      },
      newMessageAlert: false,
    }
  },
  computed: {
    ...mapState(['ui', 'textile']),
    classObject() {
      return {
        'enable-wrap': this.enableWrap,
        'scrollbar-visible': ['always', 'scroll'].includes(
          this.scrollbarVisibility,
        ),
        always: this.scrollbarVisibility === 'always',
        dark: this.theme === 'dark',
      }
    },
  },
  watch: {
    'textile.conversationLoading'(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.autoScrollToBottom()
      }
    },
    /* contents: {
      deep: true,
      handler() {
        console.log('contents changed')
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
    }, */
  },
  methods: {
    /**
     * @method autoScrollToBottom DocsTODO
     * @description
     * @example
     */
    autoScrollToBottom() {
      if (this.$el) {
        setTimeout(() => {
          this.$el.scrollTop = this.$el.scrollHeight
          this.$store.dispatch('ui/setIsScrollOver', false)
        }, 100)
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
        !this.ui.isScrollOver
      ) {
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
