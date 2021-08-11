<template src="./Media.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { User } from '~/types/ui/core'

export default Vue.extend({
  props: {
    users: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
    fullscreen: {
      type: Boolean,
      default: false,
      required: true,
    },
    maxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
    fullscreenMaxViewableUsers: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      componentKey: this.fullscreen,
    }
  },
  computed: {
    propsToWatch() {
      return { users: this.users, fullscreen: this.fullscreen }
    },
    computedUsers() {
      return this.fullscreen
        ? this.users.slice(0, this.fullscreenMaxViewableUsers)
        : this.users.slice(0, this.maxViewableUsers)
    },
    ...mapState(['audio']),
  },
  watch: {
    propsToWatch({ fullscreen }) {
      const media: HTMLElement = this.$refs.media as HTMLElement
      if (!fullscreen) {
        const blocks = media.querySelectorAll('.user, .more-user')
        if (!media) return
        for (let j = 0; j < blocks.length; j++) {
          const block = blocks[j] as HTMLElement
          block.style.width = '16rem'
          block.style.height = '9rem'
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
          if (!media) return
          const blocks = media.querySelectorAll('.user, .more-user')
          if (
            blocks.length === 0 ||
            !document.querySelectorAll('.fullscreen-media')
          )
            return

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
  methods: {
    volumeControlValueChange(volume: number) {
      this.$Sounds.changeLevels(volume / 100)
      this.$store.commit('setVolume', volume)
    },
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
