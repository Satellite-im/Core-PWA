<template src="./Error.html" />

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

/**
 * @component Error
 * @description Component that takes an error message to display including source and extra details.
 * setTimeout prop is a bool that if true will auto close the modal after 5 seconds
 * @example
 */
export default Vue.extend({
  name: 'Error',
  title: {
    type: String,
    default: '',
    required: false,
  },
  props: {
    errorText: {
      type: String,
      default: 'An Error has Occurred',
      required: false,
    },
    setCloseTimeout: {
      type: Number,
      default: () => {
        this.timeout()
      },
      required: false,
    },
  },
  data() {
    return {
      source: '',
      error: '',
      details: '',
      time: null,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.timeout()
    window.onerror = (message, source, lineno, colno, error) => {
      this.error = {
        message,
        source,
        lineno,
        colno,
        error,
        userAgent: this.$envinfo.navigator.userAgent,
      }
    }
  },
  methods: {
    confirm() {
      this.error = false
      this.close()
    },
    close() {
      this.$store.commit('ui/toggleModal', {
        name: 'error',
        state: !this.ui.modals.error,
      })
    },
    timeout() {
      if (this.setCloseTimeout) {
        setTimeout(this.close, this.setCloseTimeout)
      } else {
        setTimeout(this.close, 5000)
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Error.less"></style>
