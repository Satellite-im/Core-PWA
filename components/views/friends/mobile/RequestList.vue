<template>
  <div class="list">
    <FriendsMobileListItem
      v-for="e in list.map((e) => e.user)"
      :key="e.did"
      :user="e"
      :type="type"
    />
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { FriendRequest } from '~/libraries/Iridium/friends/types'

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
})
</script>
<style scoped lang="less">
.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
