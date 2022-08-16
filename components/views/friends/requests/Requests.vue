<template>
  <div>
    <template v-if="!incomingRequests.length && !outgoingRequests.length">
      <UiResultsMessage
        :title="$t('friends.no_requests')"
        :subtitle="$t('friends.no_requests_subtitle')"
      />
    </template>

    <!-- Incoming Requests -->
    <template v-if="incomingRequests.length">
      <div class="padded_divider">
        <TypographyHorizontalRuleText
          plaintext
          :value="$t('friends.requests')"
        />
      </div>
      <FriendsFriend
        v-for="request in incomingRequests"
        :key="request.from"
        :user="
          request.user || {
            did: request.did,
            name: request.user.name,
            status: 'offline',
          }
        "
        :request="request"
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
      <FriendsFriend
        v-for="request in outgoingRequests"
        :key="request.from"
        :user="
          request.user || {
            did: request.did,
            name: request.user.name,
            status: 'offline',
          }
        "
        :request="request"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'FriendRequests',
  data() {
    return {
      friends: iridium.friends.state,
    }
  },
  computed: {
    incomingRequests(): FriendRequest[] {
      return Object.values(this.friends.requests).filter(
        (r: FriendRequest) => r.incoming && r.status !== 'accepted',
      )
    },
    outgoingRequests(): FriendRequest[] {
      return Object.values(this.friends.requests).filter(
        (r: FriendRequest) => !r.incoming && r.status === 'pending',
      )
    },
  },
})
</script>

<style lang="less" scoped></style>
