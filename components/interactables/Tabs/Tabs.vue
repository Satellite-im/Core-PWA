<template>
  <div class="tabs" data-cy="tab-group">
    <button
      v-for="tab in tabs"
      :key="tab.route"
      class="tab"
      data-cy="tab-element"
      :class="{ active: route === tab.route }"
      @click="setRoute(tab.route)"
    >
      {{ tab.text }}
      <TypographyTag v-if="tab.badge" data-cy="tab-badge" small>
        {{ tab.badge }}
      </TypographyTag>
    </button>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { Tab } from '~/types/ui/tab'

interface Props {
  route: string
  tabs: Tab[]
}
interface Emits {
  (e: 'setRoute', route: string): void
}

withDefaults(defineProps<Props>(), {
  route: '',
})
const emit = defineEmits<Emits>()

function setRoute(route: string) {
  emit('setRoute', route)
}
</script>
<style scoped lang="less" src="./Tabs.less"></style>
