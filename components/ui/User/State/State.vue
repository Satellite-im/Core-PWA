<template>
  <component
    :is="clickable ? 'button' : 'div'"
    class="user-state"
    data-cy="user-state"
    :style="`width:${size}px; height:${size}px`"
    @click="clickable && $emit('click', $event)"
  >
    <svg width="40" height="40" viewBox="0 0 40 40" class="mask">
      <foreignObject x="0" y="0" width="40" height="40" :mask="outermask">
        <UiCircle
          :type="imageSource ? 'image' : 'random'"
          :seed="user.did"
          :size="size"
          :source="imageSource"
          data-cy="satellite-circle-profile"
        />
      </foreignObject>
      <svg
        v-if="showStatus"
        width="28"
        height="18"
        x="12"
        y="22"
        viewBox="0 0 28 18"
        :mask="innermask"
      >
        <rect :class="`status is-${status}`" width="28" height="18" />
        <foreignObject v-if="isTyping" x="3" y="9" width="25" height="6">
          <div class="typing-loader-container">
            <div class="typing-loader" />
          </div>
        </foreignObject>
      </svg>
    </svg>
  </component>
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
    size: {
      type: Number,
      default: 36,
    },
    conversationId: {
      type: String,
      default: '',
    },
    showStatus: {
      type: Boolean,
      default: true,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      users: iridium.users,
      chat: iridium.chat,
    }
  },
  computed: {
    status(): UserStatus | 'typing' {
      if (this.isTyping) {
        return 'typing'
      }
      return this.user.did === iridium.id
        ? 'online'
        : this.users.ephemeral.status?.[this.user.did] ?? 'offline'
    },
    isTyping(): boolean {
      if (!this.conversationId.length) {
        return false
      }
      return (
        this.chat.ephemeral.typing?.[this.conversationId]?.includes(
          this.user.did,
        ) ?? false
      )
    },
    imageSource(): string {
      return this.user?.photoHash
        ? this.$Config.ipfs.gateway + this.user.photoHash
        : ''
    },
    outermask(): string {
      return this.showStatus
        ? `url(#${this.isTyping ? 'typing' : 'circle'}-mask)`
        : ''
    },
    innermask(): string {
      return `url(#mask-state-${this.status})`
    },
  },
})
</script>

<style scoped lang="less" src="./State.less"></style>
