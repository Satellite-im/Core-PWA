<template>
  <div>
    <TypographyHorizontalRuleText plaintext value="OR" />
    <TypographyTitle :size="6" :text="$t('friends.add_via_qr')" />
    <TypographyText>
      {{ $t('friends.add_qrcode_description') }}
    </TypographyText>
    <div class="card">
      <div class="qr-container">
        <div class="qr-section">
          <TypographyText>
            {{ $t('friends.scan_code') }}
          </TypographyText>
          <InteractablesButton
            full-width
            size="xs"
            :text="$t('friends.camera_scan')"
          />
        </div>
        <div class="qr-section">
          <TypographyText>
            {{ $t('friends.friend_code') }}
          </TypographyText>
          <qrcode-vue
            :value="friendInviteUrl"
            :size="150"
            level="H"
            class="qr-code"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import QrcodeVue from 'qrcode.vue'

export default Vue.extend({
  name: 'QrSection',
  components: {
    QrcodeVue,
  },
  data() {
    return {
      friendInviteUrl: '',
    }
  },
  async mounted() {
    // this.friendInviteUrl = await iridium.friends.getFriendInviteUrl()
  },
})
</script>

<style lang="less" scoped>
.card {
  &:extend(.background-semitransparent-light);
  &:extend(.bordered);
  &:extend(.font-primary);
  max-width: 400px;
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
