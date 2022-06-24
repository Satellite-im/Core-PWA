<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { getGlyphSource, getSizeFromAspectRatio } from '~/utilities/ImageSize'
import { Glyph } from '~/types/ui/glyph'
import loadImg from '~/assets/img/glyphLoader.webp'

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
      required: true,
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
    ...mapGetters('friends', ['findFriendByAddress']),
    getSrc(): string {
      return this.isLoaded ? this.src.replace('$1', 'small') : loadImg
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
    async sendGlyph() {
      const { id, address } = this.$route.params
      const activeFriend = this.findFriendByAddress(address)
      const sizeType = 'small'

      if (!activeFriend && !id) {
        return
      }

      const glyphBlob = await fetch(
        getGlyphSource({ source: this.src, sizeType }),
      ).then((image) => image.blob())

      const size = await getSizeFromAspectRatio(glyphBlob)

      if (id) {
        this.$store.dispatch('textile/sendGroupGlyphMessage', {
          groupID: id,
          src: this.src,
          pack: this.pack.name,
          ...size,
          sizeType,
        })
      } else {
        this.$store.dispatch('textile/sendGlyphMessage', {
          to: activeFriend?.textilePubkey,
          src: this.src,
          pack: this.pack.name,
          ...size,
          sizeType,
        })
      }

      this.$store.commit('ui/updateRecentGlyphs', {
        pack: this.pack,
        url: this.src,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: false,
        floating: this.$device.isMobile,
      })
    },
    setLoaded() {
      this.isLoaded = true
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
