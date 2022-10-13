<template>
  <div class="list">
    <FriendsItem
      v-for="request in list"
      :key="request.did"
      :user="users.getUser(request.did)"
      :type="type"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { FriendRequest } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  props: {
    list: {
      type: Array as PropType<Array<FriendRequest>>,
      required: true,
    },
    type: {
      type: String as PropType<'incoming' | 'outgoing'>,
      required: true,
    },
  },
  data: () => ({
    users: iridium.users,
  }),
})
</script>
<style scoped lang="less">
.list {
  display: flex;
  flex-direction: column;
}
</style>
