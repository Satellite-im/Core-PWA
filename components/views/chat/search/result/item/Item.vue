<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { SearchResultItem } from '~/types/search/search'

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<SearchResultItem>,
      required: true,
    },
  },
  computed: {
    ...mapGetters('settings', ['getTimezone']),
    src(): string {
      const hash = this.data.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    timestamp(): string {
      return this.$dayjs(this.data.at)
        .local()
        .tz(this.getTimezone)
        .format('MM/DD/YY hh:mma')
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less" />
