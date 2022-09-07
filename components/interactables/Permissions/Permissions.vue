<template>
  <div class="permissions-container">
    <InteractablesButton
      v-if="state === 'prompt'"
      color="primary"
      :text="$t('pages.privacy.permissions.ask_permission')"
      @click="$emit('click', $event)"
    />
    <TypographyText v-if="state === 'granted'" color="success">
      {{ $t('pages.privacy.permissions.granted') }}
    </TypographyText>
    <TypographyText v-if="state === 'denied'" color="error">
      {{ $t('pages.privacy.permissions.denied') }}
    </TypographyText>
    <UiLoadersLoadingBar v-if="state === 'loading'" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

type PermissionState = 'granted' | 'prompt' | 'denied' | 'loading'

export default Vue.extend({
  props: {
    state: {
      type: String as PropType<PermissionState>,
      required: true,
    },
  },
})
</script>

<style scoped lang="less"></style>
