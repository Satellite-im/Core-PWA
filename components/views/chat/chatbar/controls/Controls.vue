<template>
  <div class="chatbar-controls">
    <button
      v-for="el in buttons"
      :key="el.id"
      v-tooltip.top="el.label"
      :disabled="disabled"
      :data-cy="`send-${el.id}`"
      @click="el.func"
    >
      <component :is="el.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import {
  ArrowRightIcon,
  SmileIcon,
  BoxSelectIcon,
} from 'satellite-lucide-icons'
import { computed, WritableComputedRef } from 'vue'
import { TranslateResult } from 'vue-i18n'
import { EnhancersRoute } from '~/store/chat/types'

type ChatbarButton = {
  id: EnhancersRoute | 'message'
  label: string | TranslateResult
  icon: any
  func: Function
}

interface Props {
  disabled: boolean
}

interface Emits {
  (e: 'send'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { $store, $i18n } = useNuxtApp()

const enhancersRoute: WritableComputedRef<EnhancersRoute> = computed({
  get: () => $store.state.chat.enhancersRoute,
  set: (v: EnhancersRoute) => $store.commit('chat/setEnhancersRoute', v),
})

const buttons: ChatbarButton[] = [
  {
    id: 'glyph',
    label: $i18n.t('ui.glyphs'),
    icon: BoxSelectIcon,
    func: () => (enhancersRoute.value = 'glyph'),
  },
  {
    id: 'emoji',
    label: $i18n.t('ui.emoji'),
    icon: SmileIcon,
    func: () => (enhancersRoute.value = 'emoji'),
  },
  {
    id: 'message',
    label: $i18n.t('ui.send'),
    icon: ArrowRightIcon,
    func: () => emit('send'),
  },
]
</script>

<style lang="less" src="./Controls.less"></style>
