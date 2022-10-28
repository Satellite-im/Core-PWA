<template>
  <div ref="quick" class="quick-profile">
    <div class="top">
      <!-- <button @click="openProfile"> -->
      <UiUserState :user="user" :size="40" />
      <!-- </button> -->
      <div class="text-container">
        <TypographyText as="h4" class="ellipsis">
          {{ user?.name }}
        </TypographyText>
        <TypographyText
          v-if="user?.status"
          class="ellipsis"
          color="dark"
          size="sm"
        >
          {{ user.status }}
        </TypographyText>
      </div>
      <InteractablesButton v-if="isMe" size="sm" @click="openSettings">
        <edit-icon size="1x" />
      </InteractablesButton>
    </div>
    <div v-if="quickProfile?.isSidebarProfile" class="status-container">
      <button
        v-click-outside="() => setMenuVis(false)"
        class="open-status-button"
        @mouseenter="setMenuVis(true)"
        @focus="setMenuVis(true)"
      >
        <!-- <UiDynamicIcon :icon="status" /> -->
        {{ $t(`popups.status.${status}`) }}
        <chevron-right-icon size="1x" style="margin-left: auto" />
      </button>
      <UserStatusChange v-if="isStatusMenuVisible" @close="setMenuVis(false)" />
    </div>
    <InteractablesInput
      v-if="conversationId"
      ref="input"
      v-model.trim="text"
      size="xs"
      :placeholder="$t('friends.message')"
      :max-length="$Config.chat.maxChars"
      show-limit
      autofocus
      @submit="sendMessage"
    >
      <arrow-right-icon size="1x" />
    </InteractablesInput>
    <InteractablesButton
      v-if="quickProfile?.isSidebarProfile"
      class="lock-button"
      color="dark"
      :text="$t('popups.quick_commands.title')"
      @click="toggleLock"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue'
import {
  ArrowRightIcon,
  ChevronRightIcon,
  EditIcon,
} from 'satellite-lucide-icons'
import { onClickOutside } from '@vueuse/core'

import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { User, UserStatus } from '~/libraries/Iridium/users/types'
import { SettingsRoutes, UIState } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { handleEsc, handleFocusTrap } from '~/components/compositions/events'

const { $store, $device, $router } = useNuxtApp()
const quickProfile: UIState['quickProfile'] = $store.state.ui.quickProfile

const quick: Ref<HTMLElement | null> = ref(null)
const text: Ref<string> = ref('')
const isStatusMenuVisible: Ref<boolean> = ref(false)

onClickOutside(quick, close)

const user: ComputedRef<User | undefined> = computed(() => {
  return quickProfile?.user
})

const isMe: ComputedRef<boolean> = computed(() => {
  return iridium.id === user.value?.did
})

const status: ComputedRef<UserStatus> = computed(() => {
  return 'online'
})

const conversationId: ComputedRef<Conversation['id'] | undefined> = computed(
  () => {
    if (!user.value) {
      return
    }
    return iridium.chat.directConversationIdFromDid(user.value.did)
  },
)

handleEsc(close)

// non friend quick profiles do not have buttons. will add profile link later and remove check.value
if (conversationId.value || isMe.value) {
  handleFocusTrap(quick)
}

onMounted(() => {
  if (!quickProfile || $device.isMobile || !quick.value) {
    return
  }

  quick.value.style.top = `${quickProfile.position.y}px`
  quick.value.style.left = `${quickProfile.position.x}px`

  // handle overflow
  const widthOverflow =
    quickProfile.position.x + quick.value.clientWidth - window.innerWidth
  const heightOverflow =
    quickProfile.position.y + quick.value.clientHeight - window.innerHeight

  if (widthOverflow > -8) {
    quick.value.style.left = `${quickProfile.position.x - widthOverflow - 16}px`
  }
  if (heightOverflow > -8) {
    quick.value.style.top = `${quickProfile.position.y - heightOverflow - 16}px`
  }
})

function close() {
  $store.commit('ui/setQuickProfile', undefined)
}

function sendMessage() {
  if (!user.value || !conversationId.value) {
    return
  }
  $router.push(
    `${$device.isMobile ? '/mobile' : ''}/chat/${conversationId.value}`,
  )
  iridium.chat.sendMessage({
    at: Date.now(),
    type: 'text',
    body: text.value,
    conversationId: conversationId.value,
    attachments: [],
    payload: {},
  })
  close()
}

function openSettings() {
  $store.commit('ui/setSettingsRoute', SettingsRoutes.PROFILE)
  close()

  if ($device.isMobile) {
    $router.push('/mobile/settings')
  }
}

function setMenuVis(val: boolean) {
  isStatusMenuVisible.value = val
}

function toggleLock() {
  $store.commit('accounts/lock')
  location.reload()
  close()
}
</script>
<style scoped lang="less" src="./QuickProfile.less"></style>
