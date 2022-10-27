<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { toHTML } from '~/libraries/ui/Markdown'
import { UISearchResultData } from '~/types/search/search'
import { getTimestamp } from '~/utilities/timestamp'

export default Vue.extend({
  props: {
    data: {
      type: Object as PropType<UISearchResultData>,
      required: true,
    },
  },
  computed: {
    src(): string {
      const hash = this.data.user?.profilePicture
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    timestamp(): string {
      const msgTimestamp = this.$dayjs(this.data.at)
      // if today
      if (this.$dayjs().isSame(msgTimestamp, 'day')) {
        return `${this.$t('time.today')} ${getTimestamp(this.data.at)}`
      }
      // if yesterday
      if (this.$dayjs().diff(msgTimestamp, 'day') <= 1) {
        return `${this.$t('time.yesterday')} ${getTimestamp(this.data.at)}`
      }
      return getTimestamp(this.data.at, true)
    },
    htmlPayload(): any {
      return toHTML(this.data.payload, { liveTyping: false })
    },
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => this.addSpoilerClick())
      },
      deep: true,
    },
  },
  mounted() {
    this.addSpoilerClick()
  },
  methods: {
    addSpoilerClick() {
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
  },
})
</script>
<style scoped lang="less" src="./Item.less" />
