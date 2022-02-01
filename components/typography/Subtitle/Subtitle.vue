<template src="./Subtitle.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { HeadingSize } from '~/types/ui/typography'

export default Vue.extend({
  props: {
    /**
     * Text to be included in the subtitle
     */
    text: {
      type: String,
      default() {
        return this.$t('internal.missing_text')
      },
    },
    /**
     * Size of the subtitle.
     *
     * @remarks - Supports sizes 1-6
     */
    size: {
      type: Number as PropType<HeadingSize>,
      default: 1,
    },
  },
})
</script>
<style scoped lang="less" src="./Subtitle.less"></style>
