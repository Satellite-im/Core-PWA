<template src="./Chat.html"></template>

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
  mounted() {
    setTimeout(() => {
      this.$data.loading = false
      this.$store.dispatch('setMessages', this.$mock.messages)
    }, 3000)
  },
})
</script>

<style lang="less" src="./Chat.less"></style>
