<template src="./List.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { IridiumItem } from '~/libraries/Iridium/files/types'
import { FileSortEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'

export default Vue.extend({
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
      gridLayout: (state) => (state as RootState).files.gridLayout,
    }),
    FileSortEnum: () => FileSortEnum,
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
