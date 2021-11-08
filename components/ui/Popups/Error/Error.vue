<template src="./Error.html"></template>

<script>
export default {
  name: 'Error',
  data () {
    return {
      error: false
    }
  },
  methods: {
    confirm () {
      this.error = false
    }
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Error.less"></style>
