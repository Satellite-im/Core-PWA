<template src="./Scroll.html"></template>

<script>
import Vue from 'vue'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'

export default Vue.extend({
  name: 'Scroll',
  components: {
    vueCustomScrollbar,
  },
  props: {
    verticalScroll: {
      type: Boolean,
      default: false,
      required: false,
    },
    horizontalScroll: {
      type: Boolean,
      default: false,
      required: false,
    },
    scrollbarVisibility: {
      type: String,
      default: '',
      required: false,
    },
    theme: {
      type: String,
      default: 'light',
      required: false,
    },
    padded: {
      type: Boolean,
      default: false,
      required: false,
    },
    autoScroll: {
      type: Boolean,
      default: false,
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
      settings: {
        suppressScrollY: !this.verticalScroll,
        suppressScrollX: !this.horizontalScroll,
        wheelPropagation: false,
      },
    }
  },
  computed: {
    classObject() {
      return {
        'scrollbar-visible': ['always', 'scroll'].includes(
          this.scrollbarVisibility
        ),
        'enable-wrap': this.enableWrap,
        always: this.scrollbarVisibility === 'always',
        dark: this.theme === 'dark',
      }
    },
  },
  watch: {
    contents: {
      deep: true,
      handler() {
        this.autoScrollToBottom()
      },
    },
  },
  methods: {
    autoScrollToBottom() {
      const scrollRef = this.$refs.scrollRef
      if (scrollRef && this.autoScroll) {
        setTimeout(() => {
          this.$nextTick(() => {
            scrollRef.$el.scrollTop = scrollRef.$el.scrollHeight
          })
        }, 100)
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Scroll.less"></style>
