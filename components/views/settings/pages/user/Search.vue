<template src="./Search.html"></template>

<script lang="ts">
// eslint-disable-next-line import/named
import Vue, { PropType } from 'vue'
import { PlusIcon, XIcon } from 'satellite-lucide-icons'
import { mapState } from 'vuex'
import { User } from '~/types/ui/user'
import { InputStyle, InputSize } from '~/components/interactables/Input/types'

declare module 'vue/types/vue' {
  interface Vue {
    selected: Array<User>
    dropDown: boolean
    showDropDown: () => void
    selection: number
    selectUser: (user: User, event: Event) => void
    filteredResult: Array<User>
  }
}

export default Vue.extend({
  components: {
    PlusIcon,
    XIcon,
  },
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
      result: [],
      selected: [] as Array<User>,
      dropDown: false,
      selection: -1,
    }
  },
  computed: {
    ...mapState(['friends']),
    filteredResult() {
      return this.result.filter((user: User) => {
        const isAlreadyExist = this.selected.find(
          (selectedUser) => selectedUser.name === user.name,
        )
        if (isAlreadyExist) return false
        return true
      })
    },
  },
  beforeMount() {
    this.result = this.friends.all
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
    /**
     * @method showDropDown DocsTODO
     * @description
     * @example
     */
    showDropDown() {
      this.dropDown = true
      const searchResult = this.$refs.searchResult as HTMLElement
      this.$nextTick(() => {
        const searchContent = searchResult.querySelector('.user-search-result')
        if (searchContent) {
          if (searchContent.getBoundingClientRect().height < 200) {
            searchResult.style.height =
              searchContent.getBoundingClientRect().height + 'px'
          } else {
            searchResult.style.height = '200px'
          }
        }
      })
    },
    /**
     * @method hideDropDown DocsTODO
     * @description
     * @example
     */
    hideDropDown() {
      this.dropDown = false
    },
    /**
     * @method searchResult DocsTODO
     * @description
     * @example
     */
    searchResult() {
      this.result = this.friends.all.filter((user: User) =>
        user.name.toLowerCase().includes(this.search.toLowerCase()),
      )
      this.selection = -1
    },
    /**
     * @method selectUser DocsTODO
     * @description
     * @param user
     * @param event
     * @returns
     * @example
     */
    selectUser(user: User, event: Event) {
      if (!user) {
        return
      }
      this.search = ''
      event.stopPropagation()
      this.result = this.friends.all
      this.selected.push(user)
      this.showDropDown()
      this.$emit('input', this.selected)
    },
    /**
     * @method handleKeydown DocsTODO
     * @description
     * @param event
     * @returns
     * @example
     */
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
          if (this.filteredResult.length <= this.selection) {
            this.selection = 0
          }
          break
        case 'Up':
        case 'ArrowUp':
          this.selection--
          if (this.selection < 0) {
            this.selection = this.filteredResult.length - 1
          }
          break
        case 'Enter':
          this.selectUser(this.filteredResult[this.selection], event)
          break
      }
      this.showDropDown()
      return true
    },
    /**
     * @method removeSelected DocsTODO
     * @description
     * @param index
     * @returns
     * @example
     */
    removeSelected(index: number) {
      this.selected.splice(index, 1)
    },
  },
})
</script>

<style scoped lang="less" src="./Search.less"></style>
