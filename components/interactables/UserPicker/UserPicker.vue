<template src="./UserPicker.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'UserPicker',
  data: () => ({
    selected: [] as Friend[],
    filter: '',
  }),
  computed: {
    ...mapState({
      friends: (state) => (state as RootState).friends.all,
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

<style lang="less" src="./UserPicker.less"></style>
