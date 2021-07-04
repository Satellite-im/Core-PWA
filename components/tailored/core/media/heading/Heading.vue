<template src="./Heading.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    this.$store.commit('fullscreen', false)
  },
  methods: {
    toggleFullscreen() {
      this.$store.commit('fullscreen', !this.ui.fullscreen)
      if (!this.ui.fullscreen) {
        const mediaElement: HTMLElement = document.getElementById(
          'media'
        ) as HTMLElement
        if (!mediaElement) return
        const blocks = mediaElement.querySelectorAll(
          '.user'
        ) as NodeListOf<Element>
        for (let j = 0; j < blocks.length; j++) {
          const block = blocks[j] as HTMLElement
          block.style.width = ''
          block.style.height = ''
        }
      } else {
        setTimeout(() => {
          const isFit = function (
            viewportWidth: number,
            viewportHeight: number,
            blockWidth: number,
            blockHeight: number,
            blockCount: number
          ) {
            const cols = Math.floor(viewportWidth / blockWidth)
            const rows = Math.floor(blockCount / cols)
            return blockHeight * rows < viewportHeight
          }

          const media: HTMLElement = document.getElementById(
            'media'
          ) as HTMLElement
          if (!media) return
          const blocks = media.querySelectorAll('.user') as NodeListOf<Element>
          if (blocks.length === 0) return
          if (!document.querySelectorAll('.fullscreen-media')) return

          const viewportWidth = media.clientWidth
          const viewportHeight = media.clientHeight
          const blockCount = blocks.length
          const blockStyle = window.getComputedStyle(blocks[0])
          const blockMargin = parseInt(blockStyle.margin.replace('px', ''))

          const aspectRatio = 9 / 16
          let finalWidth = 160
          let finalHeight = 90
          for (let i = 2; i <= 100; i++) {
            const blockContentWidth = (viewportWidth * i) / 100
            const blockContentHeight = blockContentWidth * aspectRatio
            const blockWidth = blockContentWidth + blockMargin * 2
            const blockHeight = blockContentHeight + blockMargin * 2
            if (
              !isFit(
                viewportWidth,
                viewportHeight,
                blockWidth,
                blockHeight,
                blockCount
              )
            ) {
              break
            }
            finalWidth = blockContentWidth
            finalHeight = blockContentHeight
          }
          for (let i = 0; i < blockCount; i++) {
            const block = blocks[i] as HTMLElement
            block.style.width = finalWidth + 'px'
            block.style.height = finalHeight + 'px'
          }
        }, 400)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
