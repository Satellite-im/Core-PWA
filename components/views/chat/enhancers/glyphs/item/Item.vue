<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Glyph } from '~/types/ui/glyph'
import * as loadImg from '~/assets/img/glyphLoader.png'

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
    sendOnClick: { type: Boolean, default: false, required: false },
  },
  computed: {
    getSrc() {
      return this.isLoaded ? this.src : loadImg
    },
  },
  data() {
    return {
      isLoaded: false,
    }
  },
  methods: {
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
      this.$store.dispatch('textile/sendGlyphMessage', {
        to: activeFriend?.textilePubkey,
        src: this.src,
        pack: this.pack.name,
      })
    },
    setLoaded() {
      this.isLoaded = true
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
