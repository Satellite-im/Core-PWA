<template src="./TypeHead.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  InputSize,
  InputStyle,
} from '~/components/interactables/Input/types'

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
      default: 10,
      required: false,
    },
  },
  data() {
    return {
      searchText: '',
      searchList: this.list,
      isFocus: false,
    }
  },
  watch: {
    list: function () {
      this.update()
    },
  },
  methods: {
    update() {
      if (!this.searchText) {
        this.searchList = this.list
        return
      }
      if (!this.isFocus) this.isFocus = true
      this.searchList = this.list.filter((item: any) =>
        this.label
          ? item[this.label]
              .toLowerCase()
              .indexOf(this.searchText.toLowerCase()) === 0
          : item.toLowerCase().indexOf(this.searchText.toLowerCase()) === 0,
      )
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
      this.searchText = ''
    },
    onMultipleItemSelected(items: any) {
      this.$emit('onMultipleSelected', items)
      this.isFocus = false
      this.searchText = ''
    },
    isActive(item: any) {
      return (
        (this.label &&
          item[this.label].toLowerCase() === this.searchText.toLowerCase()) ||
        item.toLowerCase() === this.searchText.toLowerCase()
      )
    },
    onEnterPressed() {
      const item = this.list.find((item: any) =>
        this.label
          ? item[this.label] === this.searchText
          : item === this.searchText,
      )
      const itemSplitted = this.searchText.trim().toLowerCase().split(' ')

      if (itemSplitted.length > 0) {
        this.onMultipleItemSelected(itemSplitted)
      } else if (item) {
        this.onItemClicked(item)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./TypeHead.less"></style>
