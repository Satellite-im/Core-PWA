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
        :mask="`url(#circle-mask)`"
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
        <foreignObject
          v-if="status === 'typing'"
          x="3"
          y="9"
          width="25"
          height="6"
        >
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
    size: {
      type: Number,
      default: 36,
    },
    conversationId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      users: iridium.users,
      chat: iridium.chat,
    }
  },
  computed: {
    status(): UserStatus {
      return this.user.did === iridium.id
        ? 'online'
        : this.users.ephemeral.status[this.user.did]
    },
    isTyping(): boolean {
      return this.conversationId.length
        ? this.chat.ephemeral.typing[this.conversationId]?.includes(
            this.user.did,
          )
        : false
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
