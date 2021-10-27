<template src="./server/Server.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import Layout from '~/components/mixins/Layouts/Layout'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'

export default Vue.extend({
  name: 'ServerLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  computed: {
    ...mapState(['ui', 'media']),
  },
})
</script>

<style lang="less" src="./server/Server.less"></style>
