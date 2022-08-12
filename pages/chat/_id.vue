<template src="./Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'Chat',
  layout: 'desktop',
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
  },
})
</script>

<style lang="less" src="./Chat.less" scoped></style>
