<template>
  <div class="user-state" @click="openProfile">
    <UiCircle type="random" :seed="user.address" :size="35" />
    <circle-icon
      v-if="user.state !== 'mobile' && !isTyping"
      size="1x"
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
  },
  methods: {
    openProfile() {
      const isMe = this.user.address === this.$store.state.accounts.active

      if (isMe) {
        this.$store.commit('ui/toggleSettings', {
          show: true,
          defaultRoute: 'profile',
        })
      } else {
        this.$store.commit('ui/toggleModal', {
          name: 'userProfile',
          state: true,
        })
        this.$store.commit('ui/setUserProfile', this.user)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./State.less"></style>
