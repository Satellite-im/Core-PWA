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
        const media: HTMLElement = document.getElementById(
          'media'
        ) as HTMLElement
        if (!media) return
        const blocks = media.querySelectorAll('.user') as NodeListOf<Element>
        for (let j = 0; j < blocks.length; j++) {
          const block = blocks[j] as HTMLElement
          block.style.width = ''
          block.style.height = ''
        }
        media.style.paddingTop = ''
        media.style.paddingBottom = ''
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
            const rows = Math.ceil(blockCount / cols)
            return {
              fit: blockHeight * rows < viewportHeight,
              matrix: { cols, rows },
            }
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
          const blockMargin = Math.floor(
            parseInt(blockStyle.margin.replace('px', ''))
          )

          const aspectRatio = 9 / 16
          let finalWidth = 160
          let finalHeight = 90
          let finalMatrix = { cols: 1, rows: 1 }
          for (let i = 2; i <= 100; i++) {
            const blockContentWidth = Math.floor((viewportWidth * i) / 100)
            const blockContentHeight = Math.floor(
              blockContentWidth * aspectRatio
            )
            const blockWidth = blockContentWidth + blockMargin * 2
            const blockHeight = blockContentHeight + blockMargin * 2
            const { fit, matrix } = isFit(
              viewportWidth,
              viewportHeight,
              blockWidth,
              blockHeight,
              blockCount
            )
            if (!fit) {
              break
            }
            finalWidth = blockContentWidth
            finalHeight = blockContentHeight
            finalMatrix = matrix
          }
          for (let i = 0; i < blockCount; i++) {
            const block = blocks[i] as HTMLElement
            block.style.width = finalWidth + 'px'
            block.style.height = finalHeight + 'px'
          }
          const height = finalHeight * finalMatrix.rows
          if (height <= viewportHeight) {
            const padding = Math.floor((viewportHeight - height) / 2)
            media.style.paddingTop = padding + 'px'
            media.style.paddingBottom = padding + 'px'
          }
        }, 400)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Heading.less"></style>
