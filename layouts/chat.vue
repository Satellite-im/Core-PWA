<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters,  mapState } from 'vuex'
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
    ...mapState(['audio', 'ui', 'media']),
    selectedGroup() {
      return this.$route.params.id
    },
  },
  mounted() {
    this.$Sounds.changeLevels(this.audio.volume / 100)
    this.$store.commit('setTypingUser', this.$mock.users[0])
  },
  methods: {
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.ui.modals.createServer,
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
        state: !this.ui.modals.showMarketPlace,
      })
    },
  },
})
</script>

<style lang="less" src="./chat/Chat.less"></style>
