<template>
  <div class="permissions-container">
    <TypographyText v-if="state === 'granted'" color="success">
      {{ $t('pages.privacy.permissions.granted') }}
    </TypographyText>
    <InteractablesButton
      v-else-if="state === 'prompt'"
      color="primary"
      :text="$t('pages.privacy.permissions.ask_permission')"
      @click="$emit('click', $event)"
    />
    <TypographyText v-else-if="state === 'denied'" color="danger">
      {{ $t('pages.privacy.permissions.denied') }}
    </TypographyText>
    <UiLoadersLoadingBar v-else-if="state === 'loading'" />
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
