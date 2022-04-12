<template src="./Overlay.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method closeChatImageOverlay
     * @description Close Chat Image Overlay
     * @example
     */
    closeChatImageOverlay() {
      setTimeout(() => {
        this.$store.commit('ui/setChatImageOverlay', undefined)
      }, 200)
    },
  },
})
</script>
<style scoped lang="less" src="./Overlay.less"></style>
