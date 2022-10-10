<template>
  <div class="modal">
    <button
      class="status-button"
      :class="{ selected: currentStatus === 'online' }"
      @click="setStatus('online')"
    >
      <div class="inner-container">
        <svg
          width="12"
          height="20"
          viewBox="0 0 12 12"
          class="status is-online"
        >
          <rect width="12" height="12" rx="6" ry="6" />
        </svg>
        <TypographyText size="sm" weight="bold">
          {{ $t('popups.status_change.online') }}
        </TypographyText>
      </div>
      <TypographyText size="xs">
        {{ $t('popups.status_change.online_sub') }}
      </TypographyText>
    </button>
    <button
      class="status-button"
      :class="{ selected: currentStatus === 'busy' }"
      @click="setStatus('busy')"
    >
      <div class="inner-container">
        <svg width="12" height="20" viewBox="0 0 12 12" class="status is-busy">
          <rect width="12" height="12" rx="6" ry="6" />
          <rect width="8" height="4" class="mask" rx="1" ry="1" y="4" x="2" />
        </svg>
        <TypographyText size="sm" weight="bold">
          {{ $t('popups.status_change.busy') }}
        </TypographyText>
      </div>
      <TypographyText size="xs">
        {{ $t('popups.status_change.busy_sub') }}
      </TypographyText>
    </button>
    <button
      class="status-button"
      :class="{ selected: currentStatus === 'away' }"
      @click="setStatus('away')"
    >
      <div class="inner-container">
        <svg width="12" height="20" viewBox="0 0 12 12" class="status is-away">
          <rect width="12" height="12" rx="6" ry="6" />
        </svg>
        <TypographyText size="sm" weight="bold">
          {{ $t('popups.status_change.away') }}
        </TypographyText>
      </div>
      <TypographyText size="xs">
        {{ $t('popups.status_change.away_sub') }}
      </TypographyText>
    </button>
    <button
      class="status-button"
      :class="{ selected: currentStatus === 'offline' }"
      @click="setStatus('offline')"
    >
      <div class="inner-container">
        <svg
          width="12"
          height="20"
          viewBox="0 0 12 12"
          class="status is-offline"
        >
          <rect width="12" height="12" rx="6" ry="6" />
        </svg>
        <TypographyText size="sm" weight="bold">
          {{ $t('popups.status_change.offline') }}
        </TypographyText>
      </div>
      <TypographyText size="xs">
        {{ $t('popups.status_change.offline_sub') }}
      </TypographyText>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import iridium from '~/libraries/Iridium/IridiumManager'
import { UserStatus } from '~/libraries/Iridium/Users/types'

export default Vue.extend({
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
    min-height: 44px;

    .inner-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .is-online {
      fill: @green;
    }
    .is-busy {
      fill: @red;

      .mask {
        fill: @black;
      }
    }
    .is-offline {
      fill: @gray;
    }
    .is-away {
      fill: @yellow;
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
