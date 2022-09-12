<template>
  <div
    class="user-state"
    data-cy="user-state"
    :style="`width:${size}px; height:${size}px`"
  >
    <svg width="40" height="40" viewBox="0 0 40 40" class="mask">
      <foreignObject
        x="0"
        y="0"
        width="40"
        height="40"
        :mask="`url(#${finalMask}-mask)`"
      >
        <UiCircle
          :type="imageSource ? 'image' : 'random'"
          :seed="user.did"
          :size="size"
          :source="imageSource"
          data-cy="satellite-circle-profile"
        />
      </foreignObject>
      <svg width="28" height="18" x="12" y="22" viewBox="0 0 28 18">
        <rect
          :class="`status is-${status}`"
          width="28"
          height="18"
          :mask="`url(#mask-state-${status})`"
        />
        <foreignObject v-if="isTyping" x="3" y="9" width="25" height="6">
          <div id="typing-loader-container">
            <div id="typing-loader" />
          </div>
        </foreignObject>
      </svg>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User, UserStatus } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    isTyping: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 36,
    },
  },
  data() {
    const conversationId = iridium.chat.directConversationIdFromDid(
      this.user.did,
    )
    if (!iridium.users.ephemeral.status[this.user.did]) {
      iridium.users.ephemeral.status = {
        ...iridium.users.ephemeral.status,
        [this.user.did]: 'offline',
      }
    }
    return {
      conversationId,
    }
  },
  computed: {
    status(): UserStatus {
      if (this.isTyping) {
        return 'typing'
      }
      if (this.user.did === iridium.id) {
        return 'online'
      }
      return iridium.users.ephemeral.status[this.user.did]
    },
    finalMask(): string {
      if (this.isTyping) {
        return 'typing'
      }

      const state = this.status
      if (
        state === 'online' ||
        state === 'offline' ||
        state === 'busy' ||
        state === 'away'
      ) {
        return 'circle'
      }
      return state
    },
    imageSource(): string {
      return this.user?.photoHash
        ? this.$Config.ipfs.gateway + this.user.photoHash
        : ''
    },
  },
})
</script>

<style scoped lang="less" src="./State.less"></style>
