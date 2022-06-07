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
    enableWrap: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      newMessageAlert: false,
    }
  },
  computed: {
    classObject() {
      return {
        'scrollbar-visible': ['always', 'scroll'].includes(
          this.scrollbarVisibility,
        ),
        'enable-wrap': this.enableWrap,
        always: this.scrollbarVisibility === 'always',
        dark: this.theme === 'dark',
      }
    },
    settings() {
      return {
        suppressScrollY: !this.verticalScroll,
        suppressScrollX: !this.horizontalScroll,
        wheelPropagation: false,
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Scroll.less"></style>
