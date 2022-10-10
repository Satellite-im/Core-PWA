<template>
  <div class="modal">
    <button
      v-for="status in statusList"
      :key="status"
      class="status-button"
      :class="{ selected: currentStatus === status }"
      @click="setStatus(status)"
    >
      <div class="inner-container">
        <UiDynamicIcon size="1x" :icon="status" />
        <TypographyText size="sm" weight="bold">
          {{ $t(`popups.status_change.${status}`) }}
        </TypographyText>
      </div>
      <TypographyText size="xs">
        {{ $t(`popups.status_change.${status}_sub`) }}
      </TypographyText>
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
      statusList: ['online', 'busy', 'away', 'offline'],
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
.modal {
  &:extend(.modal-gradient);
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: calc(@sidebar-controls-height + @light-spacing);
  left: 0;
  width: @full;
  border-radius: 5px;
  box-shadow: 0 5px 5px 5px rgba(0, 0, 0, 0.1);

  .separator {
    padding: 0 @light-spacing;
  }

  .status-button {
    display: flex;
    flex-direction: column;
    padding: @light-spacing @large-spacing;
    text-align: left;
    box-sizing: border-box;

    .inner-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &.selected {
      color: @light;
      .background-semitransparent-lighter();
    }
    &:hover:not(.selected) {
      color: @body;
      .background-semitransparent-lighter();
    }

    .tag {
      margin-left: auto;
    }
  }
}
</style>
