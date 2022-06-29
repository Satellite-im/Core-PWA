<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { toHTML } from '~/libraries/ui/Markdown'
import { UISearchResultData } from '~/types/search/search'

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<UISearchResultData>,
      required: true,
    },
  },
  computed: {
    ...mapGetters('settings', ['getTimestamp']),
    src(): string {
      const hash = this.data.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    timestamp(): string {
      const msgTimestamp = this.$dayjs(this.data.at)
      // if today
      if (this.$dayjs().isSame(msgTimestamp, 'day')) {
        return `${this.$t('search.result.today')} ${this.getTimestamp({
          time: this.data.at,
        })}`
      }
      // if yesterday
      if (this.$dayjs().diff(msgTimestamp, 'day') <= 1) {
        return `${this.$t('search.result.yesterday')} ${this.getTimestamp({
          time: this.data.at,
        })}`
      }
      return this.getTimestamp({ time: this.data.at, full: true })
    },
    htmlPayload(): any {
      return toHTML(this.data.payload, { liveTyping: false })
    },
  },
  mounted() {
    Array.from(
      (this.$refs.result as HTMLElement).getElementsByClassName(
        'spoiler-container',
      ),
    ).forEach((spoiler) => {
      spoiler.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        spoiler.classList.add('spoiler-open')
      })
    })
  },
})
</script>
<style scoped lang="less" src="./Item.less" />
