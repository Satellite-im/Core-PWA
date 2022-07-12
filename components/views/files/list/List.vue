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
      timer: null,
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
      /**
       * @method set
       * @description Sets current chatbar text to new value
       * @param val Value to set the chatbar content to
       * @example set('This is the new chatbar content')
       */
      set(category: FileSortEnum) {
        this.$store.commit('files/setSort', category)
      },
    },
  },
  mounted() {
    // this.$data.timer = setInterval(
    //   this.forceRender,
    //   this.$Config.chat.timestampUpdateInterval,
    // )
  },
  beforeDestroy() {
    // if (this.$data.timer) {
    //   clearInterval(this.$data.timer)
    // }
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
