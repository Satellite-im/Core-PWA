<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters,  mapState } from 'vuex'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
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
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    toggleModal() {
      this.$store.commit('toggleModal', {
        name: 'createServer',
        state: !this.ui.modals.createServer,
      })
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    acceptCall() {
      this.$store.dispatch('acceptCall')
      this.$Sounds.playSound(Sounds.CONNECTED)
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    denyCall() {
      this.$store.dispatch('denyCall')
      this.$Sounds.playSound(Sounds.HANGUP)
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
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
