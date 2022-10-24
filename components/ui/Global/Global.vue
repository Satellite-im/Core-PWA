<template>
  <div>
    <UiSvgDefs class="hidden" />
    <InteractablesContextMenu v-if="ui.contextMenuStatus" />
    <transition name="modal">
      <UiModal v-if="incomingCall" :show-close-button="false">
        <MediaIncomingCall />
      </UiModal>
      <UiModal
        v-if="ui.modals.consentScanConfirmation"
        @close="() => toggleModal(ModalWindows.CONSENT_SCAN_CONFIRMATION)"
      >
        <ConsentScanConfirmation
          @close="() => toggleModal(ModalWindows.CONSENT_SCAN_CONFIRMATION)"
        />
      </UiModal>
      <UiModal
        v-if="ui.modals.callToAction"
        @close="() => toggleModal(ModalWindows.CALL_TO_ACTION)"
      >
        <CallToAction />
      </UiModal>
      <SettingsModal v-if="ui.settingsRoute && !$device.isMobile" />
      <UiModal
        v-if="ui.modals.wallet"
        @close="toggleModal(ModalWindows.WALLET)"
      >
        <WalletPopup />
      </UiModal>
      <UiModal
        v-if="ui.modals.marketplace"
        @close="toggleModal(ModalWindows.MARKETPLACE)"
      >
        <Marketplace
          v-click-outside="() => toggleModal(ModalWindows.MARKETPLACE)"
          @close="toggleModal(ModalWindows.MARKETPLACE)"
        />
      </UiModal>
      <UiModal
        v-if="ui.modals.glyph"
        small
        @close="toggleModal(ModalWindows.GLYPH)"
      >
        <Glyphs
          v-click-outside="() => toggleModal(ModalWindows.GLYPH)"
          @close="toggleModal(ModalWindows.GLYPH)"
        />
      </UiModal>
      <UiModal
        v-if="ui.fullProfile"
        @close="$store.commit('ui/setFullProfile', undefined)"
      >
        <UserProfile @close="$store.commit('ui/setFullProfile', undefined)" />
      </UiModal>
      <UiModal
        v-if="ui.modals.renameFile"
        @close="toggleModal(ModalWindows.RENAME_FILE)"
      >
        <FilesRename @close="toggleModal(ModalWindows.RENAME_FILE)" />
      </UiModal>
      <UiModal v-if="showChanges" @close="showChanges = false">
        <UiUpdateModal @close="showChanges = false" />
      </UiModal>
      <UiModal
        v-if="ui.chatImageOverlay"
        fullscreen
        @close="$store.commit('ui/setChatImageOverlay', undefined)"
      >
        <UiChatImageOverlay />
      </UiModal>
      <UiModal
        v-if="files.preview"
        :show-close-button="false"
        fullscreen
        @close="$store.commit('files/setPreview', undefined)"
      >
        <FilesView @close="$store.commit('files/setPreview', undefined)" />
      </UiModal>
      <UiModal
        v-if="isNewAccount"
        @close="$store.commit('accounts/setNewAccount', false)"
      >
        <UiWelcomeModal />
      </UiModal>
    </transition>
    <transition :name="$device.isMobile ? 'slide' : ''">
      <InteractablesQuickProfile v-if="ui.quickProfile" />
    </transition>
    <UiPip
      v-if="$device.isDesktop && isBackgroundCall"
      v-slot="{ dragging, width, height }"
    >
      <MediaPreviewCall :dragging="dragging" :width="width" :height="height" />
    </UiPip>
  </div>
</template>
<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref, watch } from 'vue'
import { ModalWindows, UIState } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { PropCommonEnum } from '~/libraries/Enums/enums'
import { listenToNotifications } from '~/components/compositions/listenToNotifications'
import { FilesState } from '~/store/files/types'
import { SettingsState } from '~/store/settings/types'
import { webrtcHooks } from '~/components/compositions/webrtc'

const { $config, $device, $route, $router, $store } = useNuxtApp()

const showChanges: Ref<boolean> = ref(false)

const ui: ComputedRef<UIState> = computed(() => $store.state.ui)
const files: ComputedRef<FilesState> = computed(() => $store.state.files)
const currentAudioInput: ComputedRef<SettingsState['audioInput']> = computed(
  () => $store.state.settings.audioInput,
)
const currentVideoInput: ComputedRef<SettingsState['videoInput']> = computed(
  () => $store.state.settings.videoInput,
)
const isNewAccount: ComputedRef<UIState> = computed(
  () => $store.state.accounts.isNewAccount,
)

const conversationId: ComputedRef<string | undefined> = computed(() => {
  return $route.params.id
})

const { incomingCall, isBackgroundCall } = webrtcHooks(conversationId.value)

const routeCheck = (conversationId: string) => {
  if (conversationId === $route.params.id) {
    $router.push($device.isMobile ? `/mobile/chat` : `/friends`)
  }
}

iridium.friends.on('routeCheck', (conversationId: string) =>
  routeCheck(conversationId),
)
iridium.chat.on('routeCheck', (conversationId: string) =>
  routeCheck(conversationId),
)

listenToNotifications()

watch(currentAudioInput, (audioInput: string) => {
  updateWebRTCState({ audioInput })
})

watch(currentVideoInput, (videoInput: string) => {
  updateWebRTCState({ videoInput })
})

onMounted(() => {
  updateWebRTCState({
    audioInput: currentAudioInput.value,
    videoInput: currentVideoInput.value,
  })

  const lsVersion = localStorage.getItem('local-version')

  if (!lsVersion) {
    localStorage.setItem('local-version', $config.clientVersion)
    return
  }

  if ($config.clientVersion !== lsVersion) {
    localStorage.setItem('local-version', $config.clientVersion)
    showChanges.value = true
  }
})

/**
 * @method updateWebRTCState
 * @description Updates the WebRTC state with the given settings.
 * @example this.updateWebRTCState({ audioInput: 'default', videoInput: 'default' })
 */
function updateWebRTCState({
  audioInput,
  videoInput,
}: {
  audioInput?: string
  videoInput?: string
}) {
  const streamConstraints = {} as MediaStreamConstraints

  if (audioInput && audioInput !== PropCommonEnum.DEFAULT) {
    streamConstraints.audio = { deviceId: audioInput }
  }
  if (videoInput && videoInput !== PropCommonEnum.DEFAULT) {
    streamConstraints.video = { deviceId: videoInput }
  }

  iridium.webRTC.streamConstraints = streamConstraints
}

/**
 * @method toggleModal
 * @description
 * @example
 */
function toggleModal(modalName: ModalWindows): void {
  $store.commit('ui/toggleModal', {
    name: modalName,
    state: !ui.value.modals[modalName],
  })
}
</script>
