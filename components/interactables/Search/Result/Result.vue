<template src="./Result.html"></template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import VuejsPaginate from 'vuejs-paginate'
import VueMultiselect from 'vue-multiselect'
import { mapState } from 'vuex'
import SearchUtil from '../SearchUtil'
import { SearchResultGroupType } from '~/types/search/search'
Vue.component('paginate', VuejsPaginate)
Vue.component('multiselect', VueMultiselect)

export default Vue.extend({
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      groupList: SearchUtil.getSearchResultGroupList(),
      query: '',
      groupBy: SearchResultGroupType.Messages,
      page: 0,
      userOptions: [],
    }
  },
  computed: {
    ...mapState(['dataState', 'search']),
  },
  watch: {
    searchQuery(newValue) {
      if (!this.show || newValue !== this.searchQuery) {
        return
      }
      this.searchResult(newValue)
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    toggleGroupBy(state: SearchResultGroupType) {
      console.log(state)
      this.groupBy = state
    },
    searchResult(newValue: string) {
      // this.$store.commit('dataState', {'search', DataStateType.})
    },
  },
})
</script>
<style global lang="less" src="./ResultGlobal.less"></style>
<style scoped lang="less" src="./Result.less"></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
