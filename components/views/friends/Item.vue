<template>
  <component
    :is="type === 'friend' ? 'UiContextMenu' : 'div'"
    :items="contextMenuValues"
    data-cy="friend-page-list"
    class="friend-wrapper"
  >
    <button
      class="friend"
      :disabled="loading"
      data-cy="friend"
      @click="showQuickProfile($event, user)"
    >
      <UiUserState :user="user" />
      <div class="text-container">
        <div data-cy="friend-name" class="ellipsis">{{ user.name }}</div>
        <div v-if="user.status" class="ellipsis">{{ user.status }}</div>
      </div>
      <div class="button-container">
        <InteractablesButton
          v-if="cancelButton"
          v-tooltip.top="cancelButton.label"
          data-cy="friend-cancel-button"
          :disabled="loading"
          color="dark"
          size="sm"
          @click.stop="cancelButton?.func()"
        >
          <component
            :is="cancelButton.icon"
            size="16"
            :alt="cancelButton.label"
          />
        </InteractablesButton>
        <InteractablesButton
          v-if="confirmButton"
          v-tooltip.top="confirmButton.label"
          data-cy="friend-confirm-button"
          :loading="loading"
          color="dark"
          size="sm"
          @click.stop="confirmButton?.func()"
        >
          <component
            :is="confirmButton.icon"
            size="16"
            :alt="confirmButton.label"
          />
        </InteractablesButton>
      </div>
    </button>
  </component>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TranslateResult } from 'vue-i18n'
import {
  MessageSquareIcon,
  XIcon,
  CheckIcon,
  UserPlusIcon,
} from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/users/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ContextMenuItem } from '~/store/ui/types'

export type UserType = 'friend' | 'stranger' | 'incoming' | 'outgoing'

type ButtonAttributes = {
  label: TranslateResult
  icon: any
  func: () => void
}

export default Vue.extend({
  components: {
    MessageSquareIcon,
    XIcon,
    CheckIcon,
    UserPlusIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    type: {
      type: String as PropType<UserType>,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    contextMenuValues(): ContextMenuItem[] {
      return [
        {
          text: this.$t('context.remove'),
          func: this.removeFriend,
          type: 'danger',
        },
      ]
    },
    confirmButton(): ButtonAttributes | undefined {
      const map = new Map([
        [
          'friend',
          {
            label: this.$t('friends.message'),
            icon: MessageSquareIcon,
            func: this.openChat,
          },
        ],
        [
          'incoming',
          {
            label: this.$t('friends.accept'),
            icon: CheckIcon,
            func: this.acceptFriendRequest,
          },
        ],
        [
          'stranger',
          {
            label: this.$t('friends.send'),
            icon: UserPlusIcon,
            func: this.createFriendRequest,
          },
        ],
      ])
      return map.get(this.type)
    },
    cancelButton(): ButtonAttributes | undefined {
      const map = new Map([
        [
          'incoming',
          {
            label: this.$t('friends.decline'),
            icon: XIcon,
            func: this.removeRequest,
          },
        ],
        [
          'outgoing',
          {
            label: this.$t('friends.cancel_friend_request'),
            icon: XIcon,
            func: this.removeRequest,
          },
        ],
      ])
      return map.get(this.type)
    },
  },
  methods: {
    showQuickProfile(e: MouseEvent, user: User) {
      this.$store.commit('ui/setQuickProfile', {
        user,
        position: { x: e?.x, y: e?.y },
      })
    },

    openChat() {
      const conversationId = iridium.chat.directConversationIdFromDid(
        this.user.did,
      )
      this.$router.push(
        `${this.$device.isMobile ? '/mobile' : ''}/chat/${conversationId}`,
      )
    },
    async createFriendRequest() {
      this.loading = true
      await iridium.friends.requestCreate(this.user, false)
      this.loading = false
      this.$emit('requestSent')
    },
    async acceptFriendRequest() {
      this.loading = true
      await iridium.friends.requestAccept(this.user.did)
      this.loading = false
    },
    async removeRequest() {
      this.loading = true
      await iridium.friends.requestReject(this.user.did)
      this.loading = false
    },

    async removeFriend() {
      this.loading = true
      await iridium.friends.friendRemove(this.user.did)
      this.loading = false
    },
  },
})
</script>
<style scoped lang="less">
.friend-wrapper {
  display: flex;

  &:hover {
    .background-semitransparent-light();
  }

  .friend {
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
    flex-grow: 1;
    min-width: 0;
    padding: 8px 16px;
    outline-offset: -2px;

    &:hover {
      .background-semitransparent-light();
    }

    @media (max-width: @mobile-breakpoint) {
      padding: 12px 16px;

      &:hover {
        background: none;
      }
    }

    .text-container {
      flex-grow: 1;
      text-align: left;
      overflow: hidden;
    }

    .button-container {
      display: flex;
      flex-shrink: 0;
      gap: 8px;

      svg {
        margin: 1px 0;
      }
    }
  }
}
</style>
