<template src="./server/Server.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mobileSwipe } from '../components/mixins/Swipe/Swipe'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'ServerLayout',
  mixins: [mobileSwipe],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method toggleMarketPlace DocsTODO
     * @description
     * @example
     */
    toggleMarketPlace() {
      this.$store.commit('ui/toggleModal', {
        name: 'showMarketPlace',
        state: !this.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>

<style lang="less" src="./server/Server.less"></style>
