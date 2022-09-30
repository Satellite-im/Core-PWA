<template>
  <div>
    <UiResultsMessage
      v-if="!incomingRequests.length && !outgoingRequests.length"
      :title="$t('friends.no_requests')"
      :subtitle="$t('friends.no_requests_subtitle')"
    />

    <!-- Incoming Requests -->
    <template v-if="incomingRequests.length">
      <div class="padded_divider">
        <TypographyHorizontalRuleText
          plaintext
          :value="$t('friends.friend_requests')"
        />
      </div>
      <FriendsItem
        v-for="request in incomingRequests"
        :key="request.did"
        :user="users.getUser(request.did)"
        type="incoming"
      />
    </template>

    <!-- Outgoing Requests -->
    <template v-if="outgoingRequests.length">
      <div class="padded_divider">
        <TypographyHorizontalRuleText
          plaintext
          :value="$t('friends.outgoing')"
        />
      </div>
      <FriendsItem
        v-for="request in outgoingRequests"
        :key="request.did"
        :user="users.getUser(request.did)"
        type="outgoing"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'
import { truthy } from '~/utilities/typeGuard'

export default Vue.extend({
  name: 'FriendRequests',
  data() {
    return {
      friends: iridium.friends.state,
      users: iridium.users,
    }
  },
  computed: {
    requests(): FriendRequest[] {
      return Object.values(this.friends.requests).filter(truthy)
    },
    incomingRequests(): FriendRequest[] {
      return this.requests.filter((r) => r.incoming && r.status !== 'accepted')
    },
    outgoingRequests(): FriendRequest[] {
      return this.requests.filter((r) => !r.incoming && r.status === 'pending')
    },
  },
})
</script>

<style lang="less" scoped></style>
