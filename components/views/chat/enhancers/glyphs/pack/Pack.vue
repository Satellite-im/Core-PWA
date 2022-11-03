<template>
  <div class="pack-group" data-cy="glyph-pack">
    <button class="pack-title" @click="togglePack">
      <image-icon size="1x" />
      <TypographyText size="sm">{{ pack.name }}</TypographyText>
      <chevron-down-icon v-if="isOpen" size="1x" />
      <chevron-up-icon v-else size="1x" />
    </button>
    <div v-if="isOpen" class="glyph-list-box">
      <EnhancersGlyphsItem
        v-for="glyph in pack.urls"
        :key="glyph"
        :src="glyph"
        data-cy="pack-glyph-item"
        :pack="pack"
        send-on-click
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ImageIcon,
} from 'satellite-lucide-icons'
import { Glyph } from '~/types/ui/glyph'

export default Vue.extend({
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
    ImageIcon,
  },
  props: {
    pack: {
      type: Object as PropType<Glyph>,
      default: null,
    },
  },
  data() {
    return {
      isOpen: true,
    }
  },
  methods: {
    togglePack() {
      this.isOpen = !this.isOpen
    },
  },
})
</script>
<style lang="less" src="./Pack.less"></style>
