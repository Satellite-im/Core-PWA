<template>
  <div
    class="user-state"
    data-cy="user-state"
    :style="`width:${size}px; height:${size}px`"
  >
    <svg width="44" height="40" viewBox="0 0 44 40" class="mask">
      <foreignObject
        x="0"
        y="0"
        width="40"
        height="40"
        :mask="`url(#${finalMask}-mask)`"
      >
        <UiCircle
          data-cy="satellite-circle-profile"
          :type="src ? 'image' : 'random'"
          :seed="user.address"
          :size="40"
          :source="src"
          @click="$emit('click', $event)"
        />
      </foreignObject>
      <svg width="28" height="18" x="12" y="22" viewBox="0 0 28 18">
        <rect
          :class="`status is-${state}`"
          width="28"
          height="18"
          :mask="`url(#mask-state-${state})`"
        />
        <foreignObject
          v-if="state === 'typing'"
          x="3"
          y="9"
          width="25"
          height="6"
        >
          <div id="typing-loader-container">
            <div id="typing-loader" />
          </div>
        </foreignObject>
      </svg>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { User, UserState } from '~/types/ui/user'

const props = defineProps({
  user: { type: Object as PropType<User>, required: true },
  isTyping: {
    type: Boolean,
    default: false,
    required: false,
  },
  src: { type: String, default: '', required: false },
  size: {
    type: Number,
    default: 36,
    required: false,
  },
})

const state: UserState | 'typing' = computed(() => {
  // Intentionally disable isTyping indicator in case of offline state
  if (props.user.state === 'offline') return 'offline'
  if (props.isTyping) return 'typing'

  return props.user.state
})

const finalMask = computed(() => {
  if (
    state.value === 'online' ||
    state.value === 'offline' ||
    state.value === 'idle'
  )
    return 'circle'

  return state.value
})
</script>

<style scoped lang="less" src="./State.less"></style>
