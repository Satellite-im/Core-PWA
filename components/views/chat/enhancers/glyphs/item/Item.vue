<template src="./Item.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import { Glyph } from '~/types/ui/glyph'

export default Vue.extend({
  data() {
    return {
      imgLoaded: false
    }
  },
  props: {
    width: {
      type: Number,
      default: 85,
      required: false,
    },
    height: {
      type: Number,
      default: 85,
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
    sendOnClick: { type: Boolean, default: false, required: false },
  },
  methods: {
    getStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`,
        cursor: this.$data.imgLoaded ? 'pointer' : 'not-allowed'
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
    addGlyph() {
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
      if (!this.src || !activeFriend) {
        return
      }
      if(this.$data.imgLoaded) {
        this.$store.dispatch('textile/sendTextMessage', {
          to: activeFriend?.textilePubkey,
          text: `<img src=${this.src} class='glyph'/>`,
        })
      } else {
        this.$toast.show("Not allowed to input the current loading image.")
      }
    },
    imageLoaded() {
      this.$data.imgLoaded = true;
    },
    imageLoadStart() {
      this.$data.imgLoaded = false;
    }
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
