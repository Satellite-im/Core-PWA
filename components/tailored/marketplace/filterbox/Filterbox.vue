<template src="./Filterbox.html"></template>

<script lang="ts">
import Vue from 'vue'
import { FilterOption } from '~/types/marketplace/marketplace'
import { marketFilters } from '~/mock/marketplace'

export default Vue.extend({
  props: {},
  data() {
    return {
      marketFilters,
      selectedFilters: [] as FilterOption[],
      showDrop: false,
    }
  },
  computed: {},
  methods: {
    toggleDrop() {
      this.showDrop = !this.showDrop
    },
    hideDrop() {
      this.showDrop = false
    },
  },
})
</script>

<style scoped lang="less" src="./Filterbox.less"></style>
