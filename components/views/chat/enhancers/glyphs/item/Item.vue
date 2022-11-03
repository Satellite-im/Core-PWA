<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Glyph } from '~/types/ui/glyph'
import loadImg from '~/assets/img/glyphLoader.webp'
import iridium from '~/libraries/Iridium/IridiumManager'

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
      const { id } = this.$route.params

      if (!id) {
        return
      }

      await iridium.chat?.sendMessage({
        conversationId: id,
        type: 'glyph',
        glyph: {
          packId: this.pack.id,
          src: this.src,
        },
        at: Date.now(),
        attachments: [],
      })
      this.$store.commit('chat/setEnhancersRoute', '')
    },
    setLoaded() {
      this.isLoaded = true
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
