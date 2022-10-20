<template>
  <div :class="`chip-item size-${size}`">
    <UiCircle
      v-if="user"
      :type="src ? 'image' : 'random'"
      :seed="user.did"
      :size="16"
      :source="src"
    />
    <TypographyText class="text" :size="size">
      {{ text }}
    </TypographyText>
    <button @click="$emit('delete')">
      <x-icon size="1x" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { XIcon } from 'satellite-lucide-icons'
import { User } from '~/libraries/Iridium/users/types'
import { Size } from '~/types/typography'
import { Config } from '~/config'

interface Props {
  text?: string
  size?: Size
  user?: User
}
const props = withDefaults(defineProps<Props>(), {
  text: '',
  size: 'md',
  user: undefined,
})

const src: ComputedRef<string> = computed(() => {
  const hash = props.user.photoHash
  return hash ? `${Config.ipfs.gateway}${hash}` : ''
})
</script>

<style scoped lang="less">
.chip-item {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding: @xlight-spacing;
  border-radius: 24px;
  color: white;
  max-width: 100%;

  > *:not(.text) {
    flex-shrink: 0;
  }

  .text {
    margin: 0 0.125rem 0 0.25rem;
    .ellipsis();
  }
}
</style>
