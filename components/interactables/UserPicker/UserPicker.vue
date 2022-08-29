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
    fm: iridium.friends.state,
  }),
  computed: {
    friends() {
      return Object.values(this.fm.friends)
        .filter((did) => !this.exclude.includes(did))
        .map((did) => {
          return iridium.users.getUser(did)
        })
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
