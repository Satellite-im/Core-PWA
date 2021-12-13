<template src="./Glyphs.html"></template>
<script lang="ts">
import Vue from 'vue'
import VirtualList from 'vue-virtual-scroll-list'
import Item from './packGroup/packGroup.vue'

export default Vue.extend({
  data() {
    return {
      filteredGlyphs: this.$mock.glyphs,
      searchText: '',
      selectedPack: null,
      itemComponent: Item
    }
  },
  components: {
    'virtual-list': VirtualList
  },
  watch: {
    searchText() {
      console.log('filtered: ', this.searchText)
      this.filter(this.searchText)
    },
  },
  methods: {
    filter(filterValue: string) {
      // this.filteredGlyphs = Object.entries(this.$mock.glyphs).reduce(
      //   (prev, [key, value]: [string, any]) => ({
      //     ...prev,
      //     ...(value?.name?.includes(filterValue) ? { [key]: value } : {}),
      //   }),
      //   {}
      // )

      console.log('filtered: ', filterValue)

      this.$data.filteredGlyphs = this.$mock.glyphs.filter((e: any) => e.name.toLowerCase().includes(filterValue.toLowerCase()))

      console.log('filtered: ', this.$data.filteredGlyphs)
    },
  },
})
</script>
<style lang="less" src="./Glyphs.less"></style>
