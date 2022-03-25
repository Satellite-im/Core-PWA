<template src="./Chat.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { KeyIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'ServerChat',
  components: {
    KeyIcon,
  },
  layout: 'server',
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {},
})
</script>

<style lang="less" src="./Chat.less"></style>
