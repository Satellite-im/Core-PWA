<template src="./Error.html"></template>

<script>
import VModal from 'vue-js-modal'
import Vue from "vue";

Vue.use(VModal, { componentName: 'Error' })

export default {
  name: 'Error',
  title: {
    type: String,
    default: '',
    required: false,
  },
  data () {
    return {
      error: false
    }
  },
  closeModal: {
    type: Function,
    default: () => {},
    required: false,
  },
  methods: {
    confirm () {
      this.error = false
      this.closeModal()
    },
    close() {
      this.closeModal()
    },
  },
  mounted () {
    window.onerror = (message, source, lineno, colno, error) => {
      this.error = {
        message,
        source,
        lineno,
        colno,
        error,
        userAgent: navigator.userAgent
      }
    }
  },
  selfTimeOut () {
    setTimeout({
      closeModal()
    }, 10000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Error.less"></style>
