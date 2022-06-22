<template src="./UserPicker.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'UserPicker',
  props: {
    exclude: {
      type: Array as PropType<String[]>,
      default: () => [],
    },
    height: {
      type: String,
      default: () => undefined,
    },
  },
  data: () => ({
    selected: [] as Friend[],
    filter: '',
  }),
  computed: {
    ...mapState({
      friends(state) {
        const all = (state as RootState).friends.all
        if (!this.exclude.length) {
          return all
        }
        return all.filter((friend) => !this.exclude.includes(friend.address))
      },
    }),
    filteredFriends(): Friend[] {
      if (!this.filter) {
        return this.friends
      }
      const filterLower = this.filter.toLowerCase()
      return this.friends.filter((friend: Friend) => {
        return friend.name.toLowerCase().includes(filterLower)
      })
    },
  },
  watch: {
    selected() {
      this.$emit('input', this.selected)
    },
  },
  methods: {
    toggle(friend: Friend): void {
      if (this.isSelected(friend)) {
        const index = this.selected.indexOf(friend)
        this.selected.splice(index, 1)
        return
      }
      this.selected.push(friend)
    },
    isSelected(friend: Friend): boolean {
      return this.selected.includes(friend)
    },
  },
})
</script>

<style scoped lang="less" src="./UserPicker.less"></style>
