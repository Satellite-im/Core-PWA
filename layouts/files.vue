<template src="./files/Files.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mobileSwipe } from '../components/mixins/Swipe/Swipe'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'FilesLayout',
  mixins: [mobileSwipe],
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
