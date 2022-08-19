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
      v-if="user.status !== 'mobile' && !isTyping"
      class="status"
      :class="{ [`is-${user.status}`]: user.status }"
    />
    <smartphone-icon
      v-else-if="user.status === 'mobile'"
      class="mobile-status"
      :class="`is-${user.status}`"
      size="1x"
    />
    <UiChatTypingIndicator v-else />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { SmartphoneIcon } from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/friends/types'

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
  computed: {
    imageSource(): string {
      return this.user.photoHash
        ? this.$Config.ipfs.gateway + this.user.photoHash
        : ''
    },
  },
})
</script>

<style scoped lang="less" src="./State.less"></style>
