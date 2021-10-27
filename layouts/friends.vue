<template src="./friends/Friends.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'
import Layout from '~/components/mixins/Layouts/Layout'

export default Vue.extend({
  name: 'ChatLayout',
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

<style lang="less" src="./friends/Friends.less"></style>
