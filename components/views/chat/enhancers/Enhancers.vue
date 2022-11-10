<template>
  <div ref="enhancers" class="enhancers">
    <div class="navbar">
      <InteractablesButtonGroup>
        <InteractablesButton
          v-for="el in buttons"
          :key="el.id"
          :text="el.label"
          :data-cy="
            enhancersRoute === el.id
              ? 'glyphs-emoji-active'
              : 'glyphs-emoji-inactive'
          "
          :color="enhancersRoute === el.id ? 'primary' : 'dark'"
          @click="enhancersRoute = el.id"
        >
          <component :is="el.icon" size="1x" />
        </InteractablesButton>
      </InteractablesButtonGroup>
    </div>
    <div class="container">
      <EnhancersGlyphs v-if="enhancersRoute === 'glyph'" />
      <EnhancersEmoji v-else-if="enhancersRoute === 'emoji'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, WritableComputedRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { SmileIcon, BoxSelectIcon } from 'satellite-lucide-icons'
import { TranslateResult } from 'vue-i18n'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { EnhancersRoute } from '~/store/chat/types'

type EnhancersButton = {
  id: EnhancersRoute
  label: string | TranslateResult
  icon: any
}

const { $store, $i18n } = useNuxtApp()

const enhancers: Ref<HTMLElement | null> = ref(null)

onClickOutside(enhancers, close)

const enhancersRoute: WritableComputedRef<EnhancersRoute> = computed({
  get: () => $store.state.chat.enhancersRoute,
  set: (v: EnhancersRoute) => $store.commit('chat/setEnhancersRoute', v),
})

const buttons: EnhancersButton[] = [
  {
    id: 'glyph',
    label: $i18n.t('ui.glyphs'),
    icon: BoxSelectIcon,
  },
  {
    id: 'emoji',
    label: $i18n.t('ui.emoji'),
    icon: SmileIcon,
  },
  // {
  //   id: 'gif',
  //   label: $i18n.t('ui.emoji'),
  //   icon: SmileIcon,
  // },
]

function close() {
  enhancersRoute.value = ''
}
</script>

<style scoped lang="less" src="./Enhancers.less"></style>
