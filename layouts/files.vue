<template src="./files/Files.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import Layout from '~/components/mixins/Layouts/Layout'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'

export default Vue.extend({
  name: 'FilesLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  computed: {
    ...mapState(['friends']),
  },
})
</script>

<style lang="less" src="./files/Files.less"></style>
