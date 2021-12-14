<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { HeartIcon } from 'satellite-lucide-icons'
import VueMarkdown from 'vue-markdown'
import { Glyph } from '~/types/ui/glyph'

export default Vue.extend({
  components: {
    VueMarkdown,
    HeartIcon,
  },
  props: {
    item: {
      type: Object as PropType<Glyph>,
      default: null,
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
