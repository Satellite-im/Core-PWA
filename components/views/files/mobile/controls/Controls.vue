<template>
  <div class="mobile-controls">
    <FilesAsideList :items="quickAccessOptions" />
    <div class="sort-container">
      <InteractablesSelect
        v-model="sort"
        :options="sortOptions"
        :label="$t('pages.files.browse.sort')"
        small
        class="sort-selection"
      />
      <button class="sort-button" @click="sort = sort">
        <sort-asc-icon v-if="isSortAsc" size="1x" />
        <sort-desc-icon v-else size="1x" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SortAscIcon, SortDescIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import { RootState } from '~/types/store/store'
import { SimpleItem } from '~/types/ui/sidebar'
import {
  FileRouteEnum,
  FileIconsEnum,
  FileSortEnum,
} from '~/libraries/Enums/enums'
import { SelectOption } from '~/types/ui/inputs'

export default Vue.extend({
  name: 'FilesMobileControls',
  components: {
    SortAscIcon,
    SortDescIcon,
  },
  data() {
    return {
      items: iridium.files.state.items,
    }
  },
  computed: {
    ...mapState({
      files: (state) => (state as RootState).files,
    }),
    quickAccessOptions(): SimpleItem[] {
      return [
        {
          text: this.$t('pages.files.aside.default'),
          route: FileRouteEnum.DEFAULT,
          icon: FileIconsEnum.FOLDER,
        },
        {
          text: this.$t('pages.files.aside.recent'),
          route: FileRouteEnum.RECENT,
          icon: FileIconsEnum.CLOCK,
        },
      ]
    },
    sortOptions(): SelectOption[] {
      return [
        {
          text: String(this.$t('pages.files.browse.name')),
          value: FileSortEnum.NAME,
        },
        {
          text: String(this.$t('pages.files.browse.modified')),
          value: FileSortEnum.MODIFIED,
        },
        {
          text: String(this.$t('pages.files.browse.type')),
          value: FileSortEnum.TYPE,
        },
        {
          text: String(this.$t('pages.files.browse.size')),
          value: FileSortEnum.SIZE,
        },
      ]
    },
    sort: {
      get(): String {
        return this.files.sort.category
      },
      set(category: FileSortEnum) {
        this.$store.commit('files/setSort', category)
      },
    },
    isSortAsc(): boolean {
      return this.files.sort.asc
    },
  },
})
</script>

<style scoped lang="less">
.mobile-controls {
  grid-area: mobile-controls;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: @light-spacing;

  .sort-container {
    display: flex;
    align-items: center;
    gap: @light-spacing;

    .sort-button {
      display: flex;
      align-items: center;
    }

    .sort-selection {
      display: flex;
      align-items: center;
      align-self: flex-end;
    }
  }
}
</style>
