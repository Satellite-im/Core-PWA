<template>
  <div class="friend">
    <UiUserState :user="user" class="state" />
    <div class="text-container">
      <div class="name">{{ user.name }}</div>
      <div v-if="user.status" class="status">{{ user.status }}</div>
    </div>
    <div class="button-container">
      <template v-if="type === 'friend'">
        <button @click="openChat">
          <message-circle-icon />
        </button>
        <!-- TODO: Enable when implementing additional options -->
        <!-- <button>
          <more-vertical-icon />
        </button> -->
      </template>
      <template v-else>
        <button
          v-if="type === 'incoming'"
          :disabled="loading"
          @click="acceptFriendRequest"
        >
          >
          <user-plus-icon />
        </button>
        <button :disabled="loading" @click="cancelRequest">
          <trash-icon />
        </button>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  MessageCircleIcon,
  TrashIcon,
  UserPlusIcon,
} from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    MessageCircleIcon,
    TrashIcon,
    UserPlusIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    type: {
      type: String as PropType<'friend' | 'incoming' | 'outgoing'>,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    openChat() {
      const conversationId = iridium.chat.directConversationIdFromDid(
        this.user.did,
      )
      this.$router.push(`/mobile/chat/${conversationId}`)
    },
    async acceptFriendRequest() {
      this.loading = true
      await iridium.friends?.requestAccept(this.user.did)
      this.loading = false
    },
    async cancelRequest() {
      this.loading = true
      await iridium.friends?.requestReject(this.user.did)
      this.loading = false
    },
  },
})
</script>
<style scoped lang="less">
.friend {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .state {
    flex-shrink: 0;
  }

  .text-container {
    flex-grow: 1;
    &:extend(.ellipsis);

    .name,
    .status {
      &:extend(.ellipsis);
    }
  }

  .button-container {
    display: flex;
    flex-shrink: 0;
    gap: 1rem;
  }

  button:disabled {
    opacity: 0.5;
  }
}
</style>
