<template>
  <div class="no-results">
    <TypographyText class="no-results-icon">
      <message-circle-icon />
    </TypographyText>
    <div class="no-results-text">
      <TypographyText v-if="title" class="no-results-title">
        {{ title }}
      </TypographyText>
      <TypographyText v-if="subtitle" class="no-results-subtitle">
        {{ subtitle }}
      </TypographyText>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MessageCircleIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'UiResultsMessage',
  components: {
    MessageCircleIcon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
})
</script>

<style lang="less" scoped>
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  height: 100%;
  gap: 16px;
  padding: 16px 0;

  .no-results-icon {
    display: flex;
  }
}
</style>
