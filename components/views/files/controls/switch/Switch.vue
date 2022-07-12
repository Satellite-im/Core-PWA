<template src="./Switch.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { GridIcon, ListIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    GridIcon,
    ListIcon,
  },
  computed: {
    ...mapState({
      gridLayout: (state) => (state as RootState).files.gridLayout,
    }),
  },
  methods: {
    switchView(type: 'grid' | 'list') {
      if (
        (type === 'grid' && this.gridLayout) ||
        (type === 'list' && !this.gridLayout)
      ) {
        return
      }
      this.$store.commit('files/toggleLayout')
    },
  },
})
</script>
<style scoped lang="less" src="./Switch.less"></style>
