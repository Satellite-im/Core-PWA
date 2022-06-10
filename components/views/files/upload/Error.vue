<template>
  <div class="file-error">
    <TypographyError :text="$t('errors.chat.drop_file_count')" />
    <x-icon
      size="1x"
      class="has-text-danger"
      @click="$store.commit('chat/setCountError', false)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { XIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    XIcon,
  },
})
</script>

<style scoped lang="less">
.file-error {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @normal-spacing;
  width: calc(@full - 2rem);
  margin: 0 @normal-spacing;
  background-color: #181f2c;
  border-bottom-color: rgba(87, 101, 116, 0.3);
  border-radius: @corner-rounding @corner-rounding 0 0;

  svg {
    cursor: pointer;
  }
}
</style>
