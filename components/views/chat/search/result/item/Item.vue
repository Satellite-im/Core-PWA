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
    ...mapGetters('settings', ['getTimestamp', 'getFullTimestamp']),
    src(): string {
      const hash = this.data.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    timestamp(): string {
      const msgTimestamp = this.$dayjs(this.data.at)
      // if today
      if (this.$dayjs().isSame(msgTimestamp, 'day')) {
        return `${this.$t('search.result.today')} ${this.getTimestamp(
          this.data.at,
        )}`
      }
      // if yesterday
      if (this.$dayjs().diff(msgTimestamp, 'day') <= 1) {
        return `${this.$t('search.result.yesterday')} ${this.getTimestamp(
          this.data.at,
        )}`
      }
      return this.getFullTimestamp(this.data.at)
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less" />
