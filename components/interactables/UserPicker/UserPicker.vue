<template src="./UserPicker.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Friend } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'UserPicker',
  props: {
    exclude: {
      type: Array as PropType<Friend['did'][]>,
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
    friendsList: iridium.friends.state.details,
  }),
  computed: {
    friends() {
      if (!this.exclude.length) {
        return Object.values(this.friendsList)
      }
      return Object.values(this.friendsList).filter(
        (friend) => !this.exclude.includes(friend.did),
      )
    },
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
