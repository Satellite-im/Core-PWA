<template src="./Glyphs.html"></template>
<script lang="ts">
import Vue from 'vue'

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
      this.filteredGlyphs = Object.entries(this.$mock.glyphs).reduce(
        (prev, [key, value]: [string, any]) => ({
          ...prev,
          ...(value?.name?.includes(filterValue) ? { [key]: value } : {}),
        }),
        {}
      )
    },
  },
})
</script>
<style lang="less" src="./Glyphs.less"></style>
