<template>
  <div class="status-change" @mouseleave="$emit('close')">
    <button
      v-for="item in statusList"
      :key="item.status"
      class="status-button"
      @click="setStatus(item.status)"
    >
      <div class="wrapper">
        <UiDynamicIcon :icon="item.status" />
        <div class="text-container">
          <TypographyText size="sm" weight="bold">
            {{ $t(`popups.status.${item.status}`) }}
          </TypographyText>
          <TypographyText v-if="item.subtitle" size="xs" color="dark">
            {{ $t(`popups.status.${item.status}_sub`) }}
          </TypographyText>
        </div>
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserStatus } from '~/libraries/Iridium/Users/types'

type StatusListItem = {
  status: UserStatus
  subtitle?: boolean
}

export default Vue.extend({
  data() {
    return {
      statusList: [
        { status: 'online' },
        { status: 'away' },
        { status: 'busy', subtitle: true },
        { status: 'offline' },
      ] as StatusListItem[],
    }
  },
  methods: {
    setStatus(status: UserStatus) {
      // todo - emit status to peers
      this.$emit('close')
    },
  },
})
</script>

<style scoped lang="less">
.status-change {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 256px;
  padding: 8px 4px;
  left: calc(100% + 24px);
  bottom: -16px;
  box-shadow: @ui-shadow;
  .modal-gradient();
  .round-corners();

  .status-button {
    display: flex;
    text-align: left;
    align-items: center;
    padding: 8px 10px;

    &:hover {
      .background-semitransparent-lighter();
    }

    .wrapper {
      display: flex;
      gap: 8px;
      .text-container {
        display: flex;
        flex-direction: column;
        word-break: break-word;
      }
    }
  }
}
</style>
