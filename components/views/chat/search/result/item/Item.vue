<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SearchResultItem } from '~/types/search/search'
import { refreshTimestampInterval } from '~/utilities/Messaging'

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<SearchResultItem>,
      required: true,
    },
  },
  data() {
    return {
      timestamp: this.$dayjs(this.data.at).fromNow() as string,
      timestampRefreshInterval: undefined,
    }
  },
  computed: {
    src(): string {
      const hash = this.data.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  created() {
    const setTimestamp = (timePassed: string) => {
      this.timestamp = timePassed
    }

    this.$data.timestampRefreshInterval = refreshTimestampInterval(
      this.data.at,
      setTimestamp,
      this.$Config.chat.timestampUpdateInterval,
    )
  },
  beforeDestroy() {
    clearInterval(this.timestampRefreshInterval)
  },
})
</script>
<style scoped lang="less" src="./Item.less" />
