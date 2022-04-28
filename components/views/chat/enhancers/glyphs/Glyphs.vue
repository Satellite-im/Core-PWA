<template src="./Glyphs.html"></template>
<script lang="ts">
import Vue from 'vue'
import VirtualList from 'vue-virtual-scroll-list'
import PackGroup from './pack/PackGroup.vue'

export default Vue.extend({
  components: { VirtualList },
  data() {
    return {
      filteredGlyphs: Object.values(this.$mock.glyphs),
      searchText: '',
      selectedPack: null,
      packGroup: PackGroup,
    }
  },
  watch: {
    searchText() {
      this.filter(this.searchText)
    },
  },
  methods: {
    filter(filterValue: any) {
      this.filteredGlyphs = Object.values(this.$mock.glyphs).filter((pack) =>
        pack.name.toLowerCase().includes(filterValue.toLowerCase()),
      )
    },
  },
})
</script>
<style lang="less" src="./Glyphs.less"></style>
