<template>
  <div
    class="user-state"
    data-cy="user-state"
    :style="`width:${size}px; height:${size}px`"
  >
    <svg width="40" height="40" viewBox="0 0 40 40" class="mask">
      <foreignObject
        x="0"
        y="0"
        width="40"
        height="40"
        :mask="`url(#${finalMask}-mask)`"
      >
        <UiCircle
          :type="imageSource ? 'image' : 'random'"
          :seed="user.did"
          :size="size"
          :source="imageSource"
          data-cy="satellite-circle-profile"
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
import { PropType, Ref } from 'vue'
import { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserStatus } from '~/libraries/Iridium/users/types'
import { Config } from '~/config'

const props = defineProps({
  user: { type: Object as PropType<User>, required: true },
  isTyping: {
    type: Boolean,
    default: false,
    required: false,
  },
  size: {
    type: Number,
    default: 36,
    required: false,
  },
})

const status = reactive({ data: iridium.users.userStatus })

const userStatus: Ref<UserStatus> = computed(() => {
  if (props.user.did === iridium.connector?.id) return 'online'

  return status.data[props.user.did] || 'offline'
})

const state: Ref<UserStatus | 'typing'> = computed(() => {
  if (props.isTyping) return 'typing'

  return userStatus.value
})

const finalMask: Ref<string> = computed(() => {
  if (
    state.value === 'online' ||
    state.value === 'offline' ||
    state.value === 'busy' ||
    state.value === 'away'
  )
    return 'circle'

  return state.value
})

const imageSource: Ref<string> = computed(() => {
  return props.user.photoHash ? Config.ipfs.gateway + props.user.photoHash : ''
})
</script>

<style scoped lang="less" src="./State.less"></style>
