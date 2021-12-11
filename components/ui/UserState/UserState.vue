<template>
  <div class="user-state">
    <UiCircle type="random" :seed="user.address" :size="35" />
    <circle-icon
      size="1x"
      v-if="user.state !== 'mobile' && !isTyping"
      :class="`status is-${user.state}`"
    />
    <smartphone-icon
      size="1x"
      v-else-if="user.state === 'mobile'"
      :class="`mobile-status is-${user.state}`"
    />
    <UiTypingIndicator v-else />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/user'
import { SmartphoneIcon, CircleIcon } from 'satellite-lucide-icons'

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
  },
})
</script>

<style scoped lang="less" src="./UserState.less"></style>
