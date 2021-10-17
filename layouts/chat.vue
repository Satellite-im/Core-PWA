<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { mobileSwipe } from '../components/mixins/Swipe/Swipe'
import { Sounds } from '~/libraries/SoundManager/SoundManager'

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
    ...mapState(['audio', 'ui', 'media', 'friends']),
    selectedGroup() {
      return this.$route.params.id
    },
  },
  mounted() {
    this.$Sounds.changeLevels(this.audio.volume / 100)
    this.$store.commit('ui/setTypingUser', this.$mock.users[0])
  },
  methods: {
    /**
     * @method toggleModal DocsTODO
     * @description
     * @example
     */
    toggleModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'createServer',
        state: !this.ui.modals.createServer,
      })
    },
    /**
     * @method acceptCall DocsTODO
     * @description
     * @example
     */
    acceptCall() {
      this.$store.dispatch('media/acceptCall')
      this.$Sounds.playSound(Sounds.CONNECTED)
    },
    /**
     * @method denyCall DocsTODO
     * @description
     * @example
     */
    denyCall() {
      this.$store.dispatch('media/denyCall')
      this.$Sounds.playSound(Sounds.HANGUP)
    },
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

<style lang="less" src="./chat/Chat.less"></style>
