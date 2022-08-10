<template>
  <div>
    <div
      v-if="!incomingRequests.length && !outgoingRequests.length"
      class="no-results"
    >
      <TypographyText class="no-results-icon">
        <message-circle-icon />
      </TypographyText>
      <div class="no-results-text">
        <TypographyText class="no-results-title">
          {{ $t('friends.no_requests') }}
        </TypographyText>
        <TypographyText class="no-results-subtitle">
          {{ $t('friends.no_requests_subtitle') }}
        </TypographyText>
      </div>
    </div>

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
import { MessageCircleIcon } from 'satellite-lucide-icons'
import iridium from '~/libraries/Iridium/IridiumManager'
import type { FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'FriendRequests',
  components: {
    MessageCircleIcon,
  },
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

<style lang="less" scoped>
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 16px 0;
}
</style>
