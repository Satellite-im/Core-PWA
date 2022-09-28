<template src="./List.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { ChevronDownIcon, ChevronUpIcon } from 'satellite-lucide-icons'
import { FileSortEnum } from '~/libraries/Enums/enums'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'
import { RootState } from '~/types/store/store'
import { FileSort } from '~/store/files/types'

export default Vue.extend({
  components: {
    ChevronDownIcon,
    ChevronUpIcon,
  },
  props: {
    /**
     * Directory items to be displayed
     */
    directory: {
      type: Array as PropType<Array<Item>>,
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
    }),
    FileSortEnum: () => FileSortEnum,
    sort: {
      get(): FileSort {
        return this.files.sort
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
<style scoped lang="less" src="./List.less"></style>
