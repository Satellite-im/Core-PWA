<template src="./Aside.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User, Group } from '~/types/ui/core'

export default Vue.extend({
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    selectedGroup: {
      type: Object as PropType<Group>,
      default: () => ({
        creator: '',
        name: '',
        members: [],
      }),
      required: true,
    },
    friends: {
      type: Array as PropType<Array<User>>,
      default: () => [],
    },
  },
  computed: {
    members() {
      const filterFriends = (friends: User[], members: string[]) => {
        return friends.filter((friend: User) =>
          members.includes(friend.address)
        )
      }
      return filterFriends(this.friends, this.selectedGroup.members)
    },
  },
})
</script>

<style scoped lang="less" src="./Aside.less"></style>
