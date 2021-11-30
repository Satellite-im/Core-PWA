<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  VolumeIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from 'satellite-lucide-icons'

declare module 'vue/types/vue' {
  interface Vue {
    hideSlider: () => void
  }
}
export default Vue.extend({
  components: {
    VolumeIcon,
    Volume1Icon,
    Volume2Icon,
    VolumeXIcon,
  },
  props: {
    volume: {
      type: Number,
      default: 100,
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'btt',
    },
  },
  computed: {
    ...mapState(['audio'])
  },
  data() {
    return {
      showSlider: false,
    }
  },
  mounted() {
    document.addEventListener('click', this.hideSlider)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideSlider)
  },
  methods: {
    /**
     * @method toggleSlider DocsTODO
     * @description
     * @example
     */
    toggleSlider() {
      this.$data.showSlider = !this.$data.showSlider
    },
    /**
     * @method hideSlider DocsTODO
     * @description
     * @param event
     * @example
     */
    hideSlider(event: Event) {
      if (
        (this.$refs.volumegroup as Element).contains(event.target as Node) ===
        false
      ) {
        this.$data.showSlider = false
      }
    },
    /**
     * @method recievedValue DocsTODO
     * @description
     * @param volume
     * @example
     */
    receivedValue(volume: number) {
      this.$emit('volumeControlValueChange', volume)
      this.$store.commit('settings/setVolume', volume)
    },
  },
})
</script>

<style scoped lang="less" src="./Volume.less"></style>
