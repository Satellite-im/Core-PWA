<template src="./Scroll.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ChevronDownIcon } from 'satellite-lucide-icons'

import { User } from '~/types/ui/user'

function doubleRaf(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

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
    },
  },
  data() {
    return {
      newMessageAlert: false,
      scrollContainerObserver: null,
      scrollContentObserver: null,
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
  },
  watch: {
    // Once a new message is sent
    'textile.messageLoading'(value) {
      if (value === true) {
        this.autoScrollToBottom()
      }
    },
  },
  mounted() {
    const scrollContainerObserver = new ResizeObserver(() => {
      // Autoscroll to the bottom only if the user is at the bottom of the chat
      !this.ui.isScrollOver && this.autoScrollToBottom()
    })

    this.scrollContainerObserver = scrollContainerObserver.observe(
      this.$refs.scrollRef,
    )

    const scrollContentObserver = new ResizeObserver(() => {
      // Autoscroll to the bottom only if the user is at the bottom of the chat
      !this.ui.isScrollOver && this.autoScrollToBottom()
    })

    this.scrollContentObserver = scrollContentObserver.observe(
      this.$refs.scrollContent,
    )
  },
  beforeDestroy() {
    if (this.scrollContainerObserver) this.scrollContainerObserver.disconnect()
    if (this.scrollContentObserver) this.scrollContentObserver.disconnect()
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
          this.$store.dispatch('ui/setIsScrollOver', false)
        })
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
        this.$el.scrollHeight - this.preventScrollOffset >
        this.$el.scrollTop + this.$el.clientHeight
      ) {
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
