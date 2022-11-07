<template>
  <div>
    <TypographyHorizontalRuleText plaintext value="OR" />
    <TypographyText as="h3"> {{ $t('friends.add_via_qr') }} </TypographyText>
    <TypographyText>
      {{ $t('friends.add_qrcode_description') }}
    </TypographyText>
    <div class="card">
      <div class="qr-container">
        <div class="qr-section">
          <TypographyText>
            {{ $t('friends.friend_code') }}
          </TypographyText>
          <qrcode-vue
            :value="friendInviteUrl"
            :size="200"
            level="H"
            class="qr-code"
            @click="copyId"
          />
          <div class="copy-button">
            <button @click="copyId">
              <TypographyText align="center"> Invitation Link </TypographyText>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import QrcodeVue from 'qrcode.vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { capacitorHooks } from '~/components/compositions/capacitor'

export default Vue.extend({
  name: 'QrSection',
  components: {
    QrcodeVue,
  },
  setup() {
    const { copyText } = capacitorHooks()

    return {
      copyText,
    }
  },
  data() {
    return {
      friendInviteUrl:
        window.location.origin +
        '/#/invite/friend?username=' +
        iridium.shortId.split('#')[0] +
        '&did=' +
        iridium.shortId.split('#')[1],
    }
  },
  async mounted() {
    // this.friendInviteUrl = await iridium.friends.getFriendInviteUrl()
  },
  methods: {
    copyId() {
      this.copyText(this.friendInviteUrl)
    },
  },
})
</script>

<style lang="less" scoped>
.card {
  &:extend(.background-semitransparent-light);
  &:extend(.bordered);
  &:extend(.font-primary);
  max-width: 250px;
  margin: auto;
  margin-top: 32px;

  @media only screen and (max-width: @small-breakpoint) {
    max-width: 320px;
  }

  .qr-container {
    flex: 1;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    gap: 32px;

    @media only screen and (max-width: @small-breakpoint) {
      flex-direction: column-reverse;
      justify-content: center;
      align-items: center;
    }

    .qr-section {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @media only screen and (max-width: @small-breakpoint) {
        width: 100%;
      }

      .qr-code {
        @media only screen and (max-width: @small-breakpoint) {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
