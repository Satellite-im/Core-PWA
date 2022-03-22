<template src="./Scroll.html" />

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import { ChevronDownIcon } from 'satellite-lucide-icons'

import { User } from '~/types/ui/user'

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
    user: {
     type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    }
  },
  data() {
    return {
      loaded: false,
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
        'auto-scroll': this.autoScroll,
        dark: this.theme === 'dark',
      }
    },
  },
  watch: {
    'textile.conversationLoading'(newValue, oldValue) {
      if (newValue !== oldValue) {
       this.$nextTick(() => {
           this.autoScrollToBottom()
        })
      }
    },
     messages() {
      this.autoScrollToBottom()
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
      if (this.$el && this.autoScroll) {
        this.$el.scrollTop = this.$el.scrollHeight
        this.loaded = true
        this.$store.dispatch('ui/setIsScrollOver', false)
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
