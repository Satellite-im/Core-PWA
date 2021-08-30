<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { mobileSwipe } from '../components/mixins/Swipe/Swipe'

export default Vue.extend({
  name: 'ChatLayout',
  mixins: [mobileSwipe],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
      asidebar: true,
    }
  },
  computed: {
    ...mapGetters({
      selectedGroup: 'groups/getSelectedGroup',
    }),
  },
  mounted() {
    this.$Sounds.changeLevels(this.$store.state.audio.volume / 100)
  },
  updated() {
    // this.scrollToBottom()
  },
  methods: {
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.$store.state.ui.modals.createServer,
      })
    },
    acceptCall() {
      this.$store.dispatch('acceptCall')
    },
    denyCall() {
      this.$store.dispatch('denyCall')
    },
    toggleMarketPlace() {
      this.$store.commit('toggleModal', {
        name: 'showMarketPlace',
        state: !this.$store.state.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>

<style lang="less" src="./chat/Chat.less"></style>
