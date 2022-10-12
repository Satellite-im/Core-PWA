<template>
  <div class="status-change">
    <button
      v-for="status in statusList"
      :key="status"
      class="status-button"
      :class="{ selected: currentStatus === status }"
      @click="setStatus(status)"
    >
      <UiDynamicIcon size="1x" :icon="status" />
      <div class="text-container">
        <TypographyText size="sm" weight="bold">
          {{ $t(`popups.status_change.${status}`) }}
        </TypographyText>
        <TypographyText size="xs">
          {{ $t(`popups.status_change.${status}_sub`) }}
        </TypographyText>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserStatus } from '~/libraries/Iridium/Users/types'

export default Vue.extend({
  data() {
    return {
      statusList: ['online', 'busy', 'away', 'offline'] as UserStatus[],
    }
  },
  computed: {
    currentStatus(): string | undefined {
      return iridium.profile.state?.status
    },
  },
  methods: {
    innermask(status: UserStatus): string {
      return `url(#mask-state-${status})`
    },
    setStatus(status: UserStatus) {
      this.$emit('closeStatus')
      // TODO create method to save status on iridium

      return status
    },
  },
})
</script>

<style scoped lang="less">
.status-change {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: calc(@sidebar-controls-height + 16px);
  left: 0;
  box-shadow: @ui-shadow;
  .modal-gradient();
  .round-corners();

  .separator {
    padding: 0 @light-spacing;
  }

  .status-button {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    text-align: left;

    .text-container {
      display: flex;
      flex-direction: column;
    }

    &.selected {
      color: @light;
      .background-semitransparent-lighter();
    }
    &:hover:not(.selected) {
      color: @body;
      .background-semitransparent-lighter();
    }
  }
}
</style>
