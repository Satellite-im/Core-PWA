<template src="./Glyphs.html"></template>
<script lang="ts">
import Vue from 'vue'
import _, { cloneDeep } from 'lodash'

export default Vue.extend({
  data() {
    return {
      filteredGlyphs: this.$mock.glyphs,
      searchText: '',
      selectedPack: null,
    }
  },
  watch: {
    searchText() {
      this.filter(this.searchText)
    },
  },
  methods: {
    filter(filterValue: any) {
      this.filteredGlyphs = Object.entries(
        _.cloneDeep(this.$mock.glyphs),
      ).reduce(
        (prev, [key, value]: [string, any]) => ({
          ...prev,
          ...(value?.name?.includes(filterValue) ? { [key]: value } : {}),
        }),
        {},
      )
      // set active to ensure pack loads. Otherwise lazy load scroll trigger can be impossible to execute
      if (Object.keys(this.filteredGlyphs).length > 0) {
        this.filteredGlyphs[Object.keys(this.filteredGlyphs)[0]].isActive = true
      }
    },
  },
})
</script>
<style lang="less" src="./Glyphs.less"></style>
