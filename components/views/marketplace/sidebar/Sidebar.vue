<template src="./Sidebar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ChevronDownIcon, CircleIcon } from 'satellite-lucide-icons'

import {
  CategoryOption,
  CategoryTreeItem,
} from '~/types/marketplace/marketplace'

export default Vue.extend({
  components: {
    ChevronDownIcon,
    CircleIcon,
  },
  props: {
    categories: {
      type: Array as PropType<CategoryOption[]>,
      default: (): CategoryOption[] => [
        { parentCategory: '', name: 'None', icon: '' },
      ],
    },
  },
  data() {
    return {
      categoryTree: [] as CategoryTreeItem[],
      category: null as CategoryTreeItem | null,
    }
  },
  computed: {},
  created() {
    type ParentsMap = {
      [key: string]: null | CategoryTreeItem
    }
    const parentsMap = { '': null } as ParentsMap
    this.categories.forEach((category, index) => {
      const parent = parentsMap[category.parentCategory]
      const depth = parent == null ? 0 : parent.depth + 1
      const categoryTreeItem = {
        index,
        parent,
        self: category,
        depth,
        collapsed: true,
        selected: false,
        hidden: false,
        children: [],
      }
      if (parent != null) {
        parent.children.push(categoryTreeItem)
        categoryTreeItem.hidden = parent.collapsed
      }
      this.categoryTree.push(categoryTreeItem)
      parentsMap[category.name] = categoryTreeItem
    })
  },
  methods: {
    /**
     * @method clickCategory DocsTODO
     * @description
     * @param item
     * @example
     */
    clickCategory(item: CategoryTreeItem) {
      if (item.children.length > 0) {
        item.collapsed = !item.collapsed
        for (let i = item.index + 1; i < this.categoryTree.length; i++) {
          const child = this.categoryTree[i]
          if (child.depth === item.depth) {
            break
          }
          if (item.collapsed) {
            child.hidden = true
          } else if (child.parent) {
            child.hidden = child.parent.collapsed
          }
        }
      } else {
        if (this.category != null) {
          this.category.selected = false
        }
        item.selected = true
        this.category = item
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
