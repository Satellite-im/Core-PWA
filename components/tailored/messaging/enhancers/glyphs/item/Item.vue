<template src="./Item.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import { Blob } from 'buffer'
import Vue, { PropType } from 'vue'
import { Glyph } from '~/types/ui/glyph'

export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: 64,
      required: false,
    },
    height: {
      type: Number,
      default: 64,
      required: false,
    },
    src: {
      type: String,
      default: '',
    },
    pack: {
      type: Object as PropType<Glyph>,
      default: null,
      required: false,
    },
  },
  methods: {
    getStyle() {
      return {
        'background-image': `url(${this.src})`,
        width: `${this.width}px`,
        height: `${this.height}px`,
      }
    },
    mouseOver() {
      /* Set hovered glyph info only pack property exist */
      if (this.pack) {
        this.$store.commit('ui/setHoveredGlyphInfo', {
          glyphSrc: this.src,
          pack: this.pack,
        })
      }
    },
    mouseLeave() {
      if (this.pack) {
        this.$store.commit('ui/setHoveredGlyphInfo', undefined)
      }
    },
    setActiveGlyph() {
      if (this.src) {
        const activeFriend = this.$Hounddog.getActiveFriend(
          this.$store.state.friends,
        )
        this.$store.dispatch('textile/sendTextMessage', {
          to: activeFriend?.textilePubkey,
          text: `<img src=${this.src} height='160' width='160'/>`,
        })
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
