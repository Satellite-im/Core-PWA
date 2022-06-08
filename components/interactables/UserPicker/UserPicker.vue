<template src="./UserPicker.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'

export default Vue.extend({
  name: 'UserPicker',
  data: () => ({
    selected: [] as Friend[],
    filter: '',
  }),
  computed: {
    ...mapState(['friends']),
    filteredFriends() {
      if (this.filter) {
        const filterLower = this.filter.toLowerCase()
        return this.friends.all.filter((friend: Friend) => {
          return friend.name.toLowerCase().includes(filterLower)
        })
      }
      return this.friends.all
    },
  },
  watch: {
    selected() {
      console.log('emit', this.selected)
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
