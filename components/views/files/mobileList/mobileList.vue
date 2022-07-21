<template src="./mobileList.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { SortAscIcon, SortDescIcon } from 'satellite-lucide-icons'
import { IridiumItem } from '~/libraries/Iridium/files/types'
import { FileSortEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'
import { SelectOption } from '~/types/ui/inputs'

export default Vue.extend({
  components: {
    SortAscIcon,
    SortDescIcon,
  },
  props: {
    /**
     * Directory items to be displayed
     */
    directory: {
      type: Array as PropType<Array<IridiumItem>>,
      required: true,
    },
  },
  data() {
    return {
      timer: undefined as NodeJS.Timer | undefined,
      counter: 0,
    }
  },
  computed: {
    ...mapState({
      files: (state) => (state as RootState).files,
      gridLayout: (state) => (state as RootState).files.gridLayout,
    }),
    FileSortEnum: () => FileSortEnum,
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
    isSortAsc(): boolean {
      return this.files.sort.asc
    },
    sort: {
      get(): String {
        return this.files.sort.category
      },
      set(category: FileSortEnum) {
        this.$store.commit('files/setSort', category)
      },
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.counter++
    }, this.$Config.chat.timestampUpdateInterval)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
})
</script>
<style scoped lang="less" src="./mobileList.less"></style>
