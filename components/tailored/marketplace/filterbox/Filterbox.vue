<template src="./Filterbox.html"></template>

<script lang="ts">
import Vue from 'vue'

import { ChevronDownIcon } from 'satellite-lucide-icons'

import { FilterOption } from '~/types/marketplace/marketplace'
import { marketFilters } from '~/mock/marketplace'

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
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
    /**
     * @method toggleDrop DocsTODO
     * @description
     * @example
     */
    toggleDrop() {
      this.showDrop = !this.showDrop
    },
    /**
     * @method hideDrop DocsTODO
     * @description
     * @example
     */
    hideDrop() {
      this.showDrop = false
    },
  },
})
</script>

<style scoped lang="less" src="./Filterbox.less"></style>
