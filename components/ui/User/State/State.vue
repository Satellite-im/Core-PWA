<template>
  <div
    class="user-state"
    data-cy="user-state"
    :style="`width:${size}px; height:${size}px`"
  >
    <UiCircle
      data-cy="satellite-circle-profile"
      :type="src ? 'image' : 'random'"
      :seed="user.address"
      :size="size"
      :source="src"
      @click="clickHandler"
    />
    <circle-icon
      v-if="user.state !== 'mobile' && !isTyping"
      :size="size > 35 ? '1.65x' : '1x'"
      :class="`status is-${user.state}`"
    />
    <smartphone-icon
      v-else-if="user.state === 'mobile'"
      size="1x"
      :class="`mobile-status is-${user.state}`"
    />
    <UiChatTypingIndicator v-else />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SmartphoneIcon, CircleIcon } from 'satellite-lucide-icons'
import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    SmartphoneIcon,
    CircleIcon,
  },
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    isTyping: {
      type: Boolean,
      default: false,
      required: false,
    },
    src: { type: String, default: '', required: false },
    size: {
      type: Number,
      default: 35,
      required: false,
    },
    clickHandler: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
})
</script>

<style scoped lang="less" src="./State.less"></style>
