<template>
  <div class="sidebar-toggle">
    <button
      data-cy="hamburger-button"
      class="toggle-button"
      @click="toggleMenu"
    >
      <menu-icon class="button-icon" size="1.2x" />
    </button>
  </div>
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
.sidebar-toggle {
  display: flex;
  justify-content: center;
  align-items: center;

  .toggle-button {
    align-items: center;
  }
}
</style>
