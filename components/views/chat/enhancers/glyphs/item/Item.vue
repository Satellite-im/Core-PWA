<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Glyph } from '~/types/ui/glyph'
import loadImg from '~/assets/img/glyphLoader.png'

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
  data() {
    return {
      isLoaded: false,
    }
  },
  computed: {
    getSrc(): string {
      return this.isLoaded ? this.src.replace('$1', 'thumbnail') : loadImg
    },
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
    sendGlyph() {
      const activeFriend = this.$Hounddog.getActiveFriend(
        this.$store.state.friends,
      )
      const { id } = this.$route.params

      if (!this.src) return
      if (!activeFriend && !id) return

      if (id) {
        this.$store.dispatch('textile/sendGroupGlyphMessage', {
          groupID: id,
          src: this.src,
          pack: this.pack.name,
        })
        this.$store.commit('ui/updateRecentGlyphs', {
          pack: this.pack,
          url: this.src,
        })
        this.$store.commit('ui/toggleEnhancers', {
          show: false,
          floating: !!this.$device.isMobile,
        })
      } else {
        this.$store.dispatch('textile/sendGlyphMessage', {
          to: activeFriend?.textilePubkey,
          src: this.src,
          pack: this.pack.name,
        })
        this.$store.commit('ui/updateRecentGlyphs', {
          pack: this.pack,
          url: this.src,
        })
        this.$store.commit('ui/toggleEnhancers', {
          show: false,
          floating: !!this.$device.isMobile,
        })
      }
    },
    setLoaded() {
      this.isLoaded = true
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
