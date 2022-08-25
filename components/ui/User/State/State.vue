<template>
  <div
    class="user-state"
    :class="{ 'is-large': size > 36 }"
    :style="`width:${size}px; height:${size}px`"
    data-cy="user-state"
  >
    <UiCircle
      :type="imageSource ? 'image' : 'random'"
      :seed="user.did"
      :size="size"
      :source="imageSource"
      data-cy="satellite-circle-profile"
    />
    <div
      v-if="status !== 'mobile' && !isTyping"
      class="status"
      :class="{ [`is-${status}`]: status }"
    />
    <smartphone-icon
      v-else-if="status === 'mobile'"
      class="mobile-status"
      :class="`is-${status}`"
      size="1x"
    />
    <UiChatTypingIndicator v-else />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { SmartphoneIcon } from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserStatus } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  components: {
    SmartphoneIcon,
  },
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
    return {
      usersStatus: iridium.users.userStatus,
    }
  },
  computed: {
    status(): UserStatus {
      if (this.user.did === iridium.connector?.id) return 'online'

      return this.usersStatus[this.user.did] || 'offline'
    },
    imageSource(): string {
      return this.user.photoHash
        ? this.$Config.ipfs.gateway + this.user.photoHash
        : ''
    },
  },
})
</script>

<style scoped lang="less" src="./State.less"></style>
