<template src="./Scroll.html" />

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import vueCustomScrollbar from 'vue-custom-scrollbar'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'

import { ChevronDownIcon } from 'satellite-lucide-icons'

import { User } from '~/types/ui/user'

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
    user: {
     type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
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
    messages() {
        return this.textile.conversations[this.user.address]?.messages
    },
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
    messages() {
      this.autoScrollToBottom()
    },
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

      if (!this.ui.isScrollOver) {
        this.$store.dispatch('ui/setIsScrollOver', false)
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Scroll.less"></style>
