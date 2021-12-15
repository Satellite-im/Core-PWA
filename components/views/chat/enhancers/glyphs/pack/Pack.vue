<template src="./Pack.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
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
