<template>
  <div class="list">
    <InteractablesInput
      v-model="filter"
      class="search"
      :placeholder="`${$t('ui.search')}...`"
      input-kind="text"
      type="dark"
    />
    <FriendsMobileListItem
      v-for="e in filteredList"
      :key="e.did"
      :user="e"
      type="friend"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  props: {
    list: {
      type: Array as PropType<Array<User>>,
      required: true,
    },
  },
  data: () => ({
    filter: '',
  }),
  computed: {
    filteredList(): User[] {
      const friendsArray = Object.values(this.list).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      )
      if (!this.filter) {
        return friendsArray
      }
      return friendsArray.filter((friend: User) => {
        return friend.name.toLowerCase().includes(this.filter.toLowerCase())
      })
    },
  },
})
</script>
<style scoped lang="less">
.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem;
  gap: 1rem;
  overflow-y: scroll;
}
</style>
