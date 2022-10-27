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

export default Vue.extend({
  data() {
    return {
      webrtc: iridium.webRTC.state,
      callTimeString: '',
    }
  },
  computed: {
    remoteParticipant(): User | undefined {
      return iridium.webRTC.remoteParticipants()?.[0] ?? undefined
    },
  },
  watch: {
    webrtc: {
      handler() {
        this.callTimeString = this.$dayjs(this.webrtc.callStartedAt).toNow(true)
      },
      deep: true,
    },
  },
  methods: {
    navigateToActiveConversation() {
      const conversationId = this.webrtc.activeCall?.callId
      if (!conversationId) {
        return
      }

      console.log('test', conversationId)

      this.$router.push(`/mobile/chat/${conversationId}`)
    },
  },
})
</script>

<style scoped lang="less" src="./BackgroundCall.less"></style>
