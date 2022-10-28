<template>
  <div class="list-item" @click="emit('click')">
    <UiCircle
      :type="src ? 'image' : 'random'"
      :seed="friend.did"
      :size="32"
      :source="src"
    />
    <div class="name" :title="friend.name">{{ friend.name }}</div>
    <InteractablesCheckbox :value="selected" />
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { Config } from '~/config'
import { User } from '~/libraries/Iridium/users/types'

interface Props {
  friend: User
  selected?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  selected: false,
})

interface Emits {
  (e: 'click'): void
}
const emit = defineEmits<Emits>()

const src: ComputedRef<string> = computed(() => {
  const hash = props.friend?.photoHash
  return hash ? `${Config.ipfs.gateway}${hash}` : ''
})
</script>

<style scoped lang="less" src="./ListItem.less"></style>
