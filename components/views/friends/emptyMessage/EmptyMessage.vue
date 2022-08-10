<template>
  <div class="mascot-container">
    <div class="mascot-text">
      <TypographyText as="h2">
        {{ $t('pages.chat.no_friends_yet') }}
      </TypographyText>
      <TypographyText>
        {{ $t('pages.chat.no_friends_yet_text') }}
      </TypographyText>
    </div>
    <img
      v-if="displayImage"
      src="~/assets/svg/mascot/sad_curious.svg"
      draggable="false"
    />
    <InteractablesButton
      :text="$t('friends.add')"
      size="small"
      type="primary"
      :action="navigateAddFriends"
    >
      <user-plus-icon size="1.2x" />
    </InteractablesButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { FriendsTabs } from '~/store/friends/types'

export default Vue.extend({
  props: {
    displayImage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    navigateAddFriends() {
      this.$store.commit('friends/setActiveTab', FriendsTabs.Add)
      this.$router.push({
        path: this.$device.isMobile ? '/mobile/friends' : '/friends',
      })
    },
  },
})
</script>

<style lang="less" scoped>
.mascot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: @normal-spacing;
  text-align: center;

  .mascot-text {
    display: flex;
    flex-direction: column;
  }

  img {
    max-width: 50%;
  }

  .button {
    width: 75%;
  }
}
</style>
