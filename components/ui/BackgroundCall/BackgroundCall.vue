<template>
  <div class="background-call" @click="navigateToActiveConversation">
    <TypographyText size="xs" class="text">
      {{ $t('ui.background_call') }} -&nbsp;
    </TypographyText>

    <TypographyText
      v-if="remoteParticipant"
      size="xs"
      class="ellipsis text name"
    >
      {{ remoteParticipant.name }}
    </TypographyText>

    <TypographyText v-if="callTimeString" size="xs" class="text">
      &nbsp;-&nbsp; {{ callTimeString }}
    </TypographyText>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { User } from '~/libraries/Iridium/users/types'
import { webrtcHooks } from '~/components/compositions/webrtc'

export default Vue.extend({
  setup() {
    const { useDuration } = webrtcHooks()

    const callTimeString = useDuration()

    return {
      callTimeString,
    }
  },
  data() {
    return {
      webrtc: iridium.webRTC.state,
    }
  },
  computed: {
    remoteParticipant(): User | undefined {
      return iridium.webRTC.remoteParticipants()?.[0] ?? undefined
    },
  },
  methods: {
    navigateToActiveConversation() {
      const conversationId = this.webrtc.activeCall?.callId
      if (!conversationId) {
        return
      }

      this.$router.push(`/mobile/chat/${conversationId}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
