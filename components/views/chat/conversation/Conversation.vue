<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import InfiniteLoading from 'vue-infinite-loading'
import { MessageGroup } from '~/types/messaging'

export default Vue.extend({
  components: {
    InfiniteLoading,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    groups: {
      type: Array as PropType<MessageGroup>,
      default: () => [],
    },
    groupId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      page: 1,
      list: [],
    }
  },
  computed: {
    ...mapState(['ui', 'textile']),
  },
  watch: {
    groups(nextValue, prevValue) {
      const newItems = nextValue.slice(prevValue.length)
      this.list.push(...newItems)
      console.log('watch prevValue', prevValue)
      console.log('watch nextValue', nextValue)
    },
  },
  methods: {
    infiniteHandler($state) {
      const groups = this.getGroups(this.page)
      if (groups.length) {
        this.page += 1
        this.list.unshift(...groups)
        $state.loaded()
      } else {
        $state.complete()
      }
    },
    getGroups(page: number, size: number = 5) {
      const from = Math.max(this.groups?.length - size * page, 0)
      const to = Math.max(this.groups?.length - size * (page - 1), 0)
      console.log('from', from)
      console.log('to', to)
      console.log('this.groups', this.groups)
      const groups: PropType<MessageGroup>[] = this.groups?.slice(from, to)
      console.log('getGroups', groups)
      return groups
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
