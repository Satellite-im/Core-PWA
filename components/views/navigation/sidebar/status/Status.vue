<template src="./Status.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['accounts']),
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
