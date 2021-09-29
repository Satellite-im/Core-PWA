<template src="./Search.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'
import { InputStyle, InputSize } from '~/components/interactables/Input/types'
import { Users } from '~/mock/users'

export default Vue.extend({
  props: {
    value: {
      type: Array as PropType<User[]>,
      default() {
        return []
      },
    },
    placeholder: {
      type: String,
      default: '',
    },
    size: {
      type: String as PropType<InputSize>,
      default: 'normal',
    },
    type: {
      type: String as PropType<InputStyle>,
      default: 'normal',
    },
    drop: {
      type: String,
      default: 'bottom',
    },
  },
  data() {
    return {
      search: '',
      result: Users,
      selected: [] as Array<User>,
      dropDown: false,
      selection: -1,
    }
  },
  mounted() {
    const searchSlot = this.$refs.searchSlot as HTMLElement
    const searchResult = this.$refs.searchResult as HTMLElement
    if (this.drop === 'top') {
      searchResult.style.bottom =
        searchSlot.getBoundingClientRect().height + 'px'
    }
  },
  methods: {
    showDropDown() {
      this.dropDown = true
      const searchResult = this.$refs.searchResult as HTMLElement
      setTimeout(() => {
        const searchContent = searchResult.querySelector('.user-search-result')
        if (searchContent) {
          if (searchContent.getBoundingClientRect().height < 200) {
            searchResult.style.height =
              searchContent.getBoundingClientRect().height + 'px'
          } else {
            searchResult.style.height = '200px'
          }
        }
      }, 10)
    },
    hideDropDown() {
      this.dropDown = false
    },
    searchResult() {
      this.result = Users.filter((user) =>
        user.name.toLowerCase().startsWith(this.search.toLowerCase())
      )
      this.selection = -1
    },
    selectUser(user: User, event: Event) {
      if (!user) {
        return
      }
      event.stopPropagation()
      const exists = this.selected.find((item, i) => {
        if (item.name === user.name) {
          this.selected.splice(i, 1)
          return item
        }
        return null
      })
      if (!exists) {
        this.selected.push(user)
      }
      this.showDropDown()
      this.$emit('input', this.selected)
    },
    handleKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case 'Backspace':
          if (this.search === '') {
            if (this.selected.length > 0) {
              this.selected.splice(this.selected.length - 1, 1)
              this.showDropDown()
            }
            return false
          }
          break
        case 'Down':
        case 'ArrowDown':
          this.selection++
          if (this.result.length <= this.selection) {
            this.selection = 0
          }
          break
        case 'Up':
        case 'ArrowUp':
          this.selection--
          if (this.selection < 0) {
            this.selection = this.result.length - 1
          }
          break
        case 'Enter':
          this.selectUser(this.result[this.selection], event)
          break
      }
      this.showDropDown()
      return true
    },
    removeSelected(index: number) {
      this.selected.splice(index, 1)
      this.showDropDown()
    },
  }
})
</script>

<style scoped lang="less" src="./Search.less"></style>
