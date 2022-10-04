<template>
  <div class="requests">
    <UiResultsMessage
      v-if="!incomingRequests.length && !outgoingRequests.length"
      :title="$t('friends.no_requests')"
      :subtitle="$t('friends.no_requests_subtitle')"
    />

    <!-- Incoming Requests -->
    <div v-if="incomingRequests.length">
      <TypographyText as="h4" class="heading">
        {{ $t('friends.incoming') }}
      </TypographyText>
      <FriendsItem
        v-for="request in incomingRequests"
        :key="request.did"
        :user="users.getUser(request.did)"
        type="incoming"
      />
    </div>

    <!-- Outgoing Requests -->
    <div v-if="outgoingRequests.length">
      <TypographyText as="h4" class="heading">
        {{ $t('friends.outgoing') }}
      </TypographyText>
      <FriendsItem
        v-for="request in outgoingRequests"
        :key="request.did"
        :user="users.getUser(request.did)"
        type="outgoing"
      />
    </div>
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

<style lang="less" scoped>
.requests {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .heading {
    margin: 0 0 12px 16px;
  }
}
</style>
