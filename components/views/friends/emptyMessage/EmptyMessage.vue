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
    <InteractablesButton :text="$t('friends.add')" @click="navigateAddFriends">
      <user-plus-icon size="1.2x" />
    </InteractablesButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserPlusIcon } from 'satellite-lucide-icons'
import { FriendsTabs } from '~/libraries/Enums/enums'

export default Vue.extend({
  components: {
    UserPlusIcon,
  },
  props: {
    displayImage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    navigateAddFriends() {
      const path = this.$device.isMobile ? '/mobile/friends' : '/friends'

      this.$router.push({ path, query: { route: FriendsTabs.ADD } })
      this.$emit('click')
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
  user-select: none;

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
