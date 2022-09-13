<template>
  <div class="user-list hover-scroll">
    <TypographyText>Members - {{ userDetails.length }}</TypographyText>
    <div v-for="user in userDetails" :key="user.did" class="user">
      <UiUserState :user="user" />
      <TypographyText class="ellipsis">
        {{ user.name }}
      </TypographyText>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { computed, ComputedRef, reactive } from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { conversationHooks } from '~/components/compositions/conversations'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  setup() {
    const { conversation, conversationId } = conversationHooks()

    const state = reactive({
      users: iridium.users,
    })

    const userDetails: ComputedRef<User[]> = computed(() => {
      if (!conversation.value) {
        return []
      }
      const arr = conversation.value.participants.map((p) =>
        state.users.getUser(p),
      ) as User[]
      return arr.sort((a, b) => a.name.localeCompare(b.name))
    })

    return { conversation, conversationId, userDetails }
  },
})
</script>

<style lang="less" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  width: 240px;
  overflow-y: auto;
  background: @foreground-gradient;
  box-shadow: @ui-shadow;

  .user {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
