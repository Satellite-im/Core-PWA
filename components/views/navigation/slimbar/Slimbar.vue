<template src="./Slimbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { SettingsIcon, PlusIcon, SatelliteIcon } from 'satellite-lucide-icons'
import { ModalWindows } from '~/store/ui/types'
import Unread from '~/components/ui/Unread/Unread.vue'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { DataStateType } from '~/store/dataState/types'
import { RootState } from '~/types/store/store'

declare module 'vue/types/vue' {
  interface Vue {
    toggleModal: (modalName: string) => void
    unsubscribe: () => void
  }
}

export default Vue.extend({
  components: {
    SettingsIcon,
    PlusIcon,
    SatelliteIcon,
    Unread,
  },
  props: {
    servers: {
      type: Array,
      default() {
        return []
      },
    },
    openModal: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['ui']),
    ...mapState({
      friendsDS: (state) => (state as RootState).dataState.friends,
    }),
    ...mapGetters('friends', ['friendsWithUnreadMessages']),
    ModalWindows: () => ModalWindows,
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation) => {
      if (mutation.type === 'friends/addFriend') {
        this.$store.dispatch('sounds/playSound', Sounds.NEW_MESSAGE)
      }
    })
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    /**
     * @method toggleModal
     * @param modalName - enum for which modal
     * @description This updates the state to show/hide the specific modal you pass in
     * @example toggleModal(ModalWindows.WALLET)
     */
    toggleModal(modalName: keyof ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Slimbar.less"></style>
