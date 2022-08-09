<template src="./Modal.html"></template>

<script lang="ts">
import { MenuIcon } from 'satellite-lucide-icons'
import Vue from 'vue'
import { mapState } from 'vuex'
import { SettingsRoutes } from '~/store/ui/types'

export default Vue.extend({
  components: {
    MenuIcon,
  },
  data() {
    return {
      SettingsRoutes,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method closeModal DocsTODO
     * @description
     * @example
     */
    closeModal() {
      this.$store.commit('ui/setSettingsRoute', SettingsRoutes.EMPTY)
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
