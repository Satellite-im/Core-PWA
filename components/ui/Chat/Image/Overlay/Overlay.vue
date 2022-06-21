<template src="./Overlay.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      chatImageOverlay: (state) => (state as RootState).ui.chatImageOverlay,
      blockNsfw: (state) => (state as RootState).textile.userThread.blockNsfw,
    }),
  },
  methods: {
    /**
     * @method closeChatImageOverlay
     * @description Close Chat Image Overlay
     * @example
     */
    closeChatImageOverlay() {
      this.$store.commit('ui/setChatImageOverlay', undefined)
    },
  },
})
</script>
<style scoped lang="less" src="./Overlay.less"></style>
