<template>
  <button data-cy="hamburger-button" @click="toggleMenu">
    <menu-icon class="button-icon" size="1.5x" />
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    MenuIcon,
  },
  computed: {
    ...mapState({
      showSidebar: (state) => (state as RootState).ui.showSidebar,
    }),
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
  },
})
</script>

<style scoped lang="less">
button {
  color: @flair-color;
  display: flex;
  align-items: center;
  align-self: center;
}
</style>
