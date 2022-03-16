<template src="./TypeHead.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { InputSize, InputStyle } from '~/components/interactables/Input/types'

export default Vue.extend({
  props: {
    /**
     * list for showing typehead items
     */
    list: {
      type: Array as PropType<Array<String | Object>>,
      default: [],
    },
    /**
     * list for showing typehead items
     */
    onSelected: {
      type: Function,
      default: () => () => {},
    },
    /**
     * Size of the input, reference InputSize types or Bulma.io
     */
    size: {
      type: String as PropType<InputSize>,
      default: 'normal',
      required: false,
    },
    /**
     * key to point label when object array passed
     */
    label: {
      type: String,
      default: '',
      required: false,
    },
    /**
     * Style of the input, reference InputStyle types or Bulma.io
     */
    type: {
      type: String as PropType<InputStyle>,
      required: false,
      default: 'normal',
    },
    /**
     * Placeholder text for blank inputs
     */
    placeholder: {
      type: String,
      default: 'Placeholder...',
    },
    /**
     * Placeholder text for blank inputs
     */
    maxShowCounts: {
      type: Number,
      default: 8,
      required: false,
    },
  },
  data() {
    return {
      searchText: '',
      searchList: [] as Array<string | Object>,
      isFocus: false,
      browseIndex: -1,
      mouseMove: false,
      unpauseMouse: false,
    }
  },
  watch: {
    list() {
      this.update()
    },
    searchText() {
      this.update()
    },
  },
  methods: {
    update() {
      this.unpauseMouse = false
      if (!this.searchText) {
        this.searchList = []
        return
      }
      if (!this.isFocus) this.isFocus = true

      this.browseIndex = -1
      this.searchList = this.list
        .filter((item: any) =>
          this.label
            ? item[this.label]
                .toLowerCase()
                .indexOf(this.searchText.toLowerCase()) === 0
            : item.toLowerCase().indexOf(this.searchText.toLowerCase()) === 0,
        )
        .slice(0, this.maxShowCounts)

      this.searchList.every((item: any, index) => {
        const compare = (this.label ? item[this.label] : item) as string
        this.browseIndex =
          compare.toLowerCase() === this.searchText.toLowerCase() ? index : -1
        return this.browseIndex !== -1
      })
    },
    unpauseMouseSelect() {
      // mouseMove immediately set to true if you were hovering over the newly visible word list,
      // this prevents hover animation until you move the mouse after the list is shown
      this.unpauseMouse = true
    },
    setFocus() {
      this.isFocus = true
    },
    lostFocus() {
      this.isFocus = false
    },
    onItemClicked(item: any) {
      this.$emit('onSelected', item)
      this.isFocus = false
      this.unpauseMouse = false
      this.searchText = ''
    },
    parentOver(ev: MouseEvent) {
      if (this.unpauseMouse) {
        this.mouseMove = true
      }
    },
    parentLeave(ev: MouseEvent) {
      this.mouseMove = false
    },
    onMultipleItemSelected(items: any) {
      this.$emit('onMultipleSelected', items)
      this.isFocus = false
      this.searchText = ''
    },
    onDownBrowseItem(event: KeyboardEvent) {
      event.preventDefault()
      this.mouseMove = false
      if (this.browseIndex < this.searchList.length - 1) {
        this.browseIndex++
      }
    },
    onEnterPressed() {
      const item =
        this.browseIndex !== -1 ? this.searchList[this.browseIndex] : null
      const itemSplitted = this.searchText.trim().toLowerCase().split(' ')
      if (item) {
        this.onItemClicked(item)
      } else if (itemSplitted.length > 1) {
        this.onMultipleItemSelected(itemSplitted)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./TypeHead.less"></style>
