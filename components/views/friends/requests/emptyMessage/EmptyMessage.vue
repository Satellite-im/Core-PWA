<template>
  <div class="no-results">
    <TypographyText class="no-results-icon">
      <message-circle-icon />
    </TypographyText>
    <div class="no-results-text">
      <TypographyText class="no-results-title">
        {{ $t('friends.no_requests') }}
      </TypographyText>
      <TypographyText class="no-results-subtitle">
        {{ $t('friends.no_requests_subtitle') }}
      </TypographyText>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MessageCircleIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'FriendsRequestsEmptyMessage',
  components: {
    MessageCircleIcon,
  },
})
</script>

<style lang="less" scoped>
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  padding: 16px 0;
}
</style>
