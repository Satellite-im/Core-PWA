<template src="./UserPicker.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import fuzzysort from 'fuzzysort'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { truthy } from '~/utilities/typeGuard'

export default Vue.extend({
  name: 'UserPicker',
  props: {
    exclude: {
      type: Array as PropType<User['did'][]>,
      default: () => [],
    },
    height: {
      type: String,
      default: () => undefined,
    },
  },
  data: () => ({
    selected: [] as User[],
    filter: '',
    friendsState: iridium.friends.state,
  }),
  computed: {
    friends(): User[] {
      return this.friendsState.friends
        .filter((did) => !this.exclude.includes(did))
        .map((did) => iridium.users.getUser(did))
        .filter(truthy)
    },
    filteredFriends(): User[] {
      if (!this.filter) {
        return this.friends
      }
      return fuzzysort
        .go(this.filter, this.friends, { key: 'name' })
        .map((result) => result.obj)
    },
  },
  watch: {
    selected() {
      this.$emit('input', this.selected)
    },
  },
  methods: {
    toggle(friend: User) {
      if (this.isSelected(friend)) {
        const index = this.selected.indexOf(friend)
        this.selected.splice(index, 1)
        return
      }
      this.selected.push(friend)
    },
    isSelected(friend: User): boolean {
      return this.selected.includes(friend)
    },
  },
})
</script>

<style scoped lang="less" src="./UserPicker.less"></style>
