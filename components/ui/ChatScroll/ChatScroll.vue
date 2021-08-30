<template src="./ChatScroll.html"></template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'ChatScroll',
  props: {
    autoScroll: {
      type: Boolean,
      default: true,
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
        if (lastMsg.from === this.$mock.user.address) {
          this.autoScrollToBottom()
        } else {
          this.newMessageAlert = true
        }
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
    autoScrollToBottom() {
      const interval = this.loaded ? 100 : 1000
      const scrollRef = this.$refs.scrollRef
      if (scrollRef && this.autoScroll) {
        setTimeout(() => {
          this.$nextTick(() => {
            scrollRef.scrollTop = scrollRef.scrollHeight
            this.loaded = true
          })
        }, interval)
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ChatScroll.less"></style>
