<template>
  <span class="dynamic-icon">
    <svg
      v-if="icon === 'online'"
      width="12"
      height="20"
      viewBox="0 0 12 12"
      class="is-online"
    >
      <rect width="12" height="12" rx="6" ry="6" />
    </svg>
    <svg
      v-else-if="icon === 'busy'"
      width="12"
      height="20"
      viewBox="0 0 12 12"
      class="is-busy"
    >
      <rect width="12" height="12" rx="6" ry="6" />
      <rect width="6" height="2" class="mask" rx="1" ry="1" y="5" x="3" />
    </svg>
    <svg
      v-else-if="icon === 'away'"
      width="12"
      height="20"
      viewBox="0 0 12 12"
      class="is-away"
    >
      <rect width="12" height="12" rx="6" ry="6" />
    </svg>
    <svg
      v-else-if="icon === 'offline'"
      width="12"
      height="20"
      viewBox="0 0 12 12"
      class="is-offline"
    >
      <rect width="12" height="12" rx="6" ry="6" />
    </svg>
  </span>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { UserStatus } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  props: {
    icon: {
      type: String as PropType<UserStatus>,
      required: true,
    },
  },
})
</script>
<style scoped lang="less">
.dynamic-icon {
  display: flex;
  align-content: center;

  .is {
    &-online {
      fill: @green;
    }
    &-busy {
      fill: @red;

      .mask {
        fill: @black;
      }
    }
    &-offline {
      fill: @gray;
    }
    &-away {
      fill: @yellow;
    }
  }
}
</style>
