<template src="./Statusbar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User, Server } from '~/types/ui/core'
import { searchRecommend } from '~/mock/search'
import { SearchQueryItem } from '~/types/search/search'

export default Vue.extend({
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    server: {
      type: Object as PropType<Server>,
      default: () => {},
    },
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
  },
  data() {
    return {
      searchRecommend,
    }
  },
  methods: {
    change(value: String, item: SearchQueryItem) {
      console.log(item)
    },
    search(value: String, items: SearchQueryItem[]) {
      console.log(items)
    },
  },
})
</script>

<style scoped lang="less" src="./Statusbar.less"></style>
