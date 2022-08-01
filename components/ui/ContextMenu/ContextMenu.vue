<template>
  <!-- Desktop Context Menu -->
  <div v-if="!$device.isMobile" @contextmenu="contextMenu" @click="handleClick">
    <slot />
  </div>

  <!-- Mobile Context Menu -->
  <div v-else v-contextmenu="showMenu" @click="handleClick">
    <slot />
    <div
      v-if="isVisible"
      ref="contextMenu"
      v-click-outside="hideMenu"
      class="context-menu-container"
      data-cy="context-menu"
    >
      <!-- Item Buttons -->
      <div class="actions-group">
        <button
          v-for="item in items"
          :key="String(item.text)"
          class="action-button"
          :class="{ danger: item.type === 'danger' }"
          @click="(e) => handleAction(e, item.func)"
        >
          {{ item.text }}
        </button>
      </div>

      <!-- Cancel Button -->
      <div class="actions-group">
        <button class="action-button danger" @click="hideMenu">
          <TypographyText text="Cancel">Cancel</TypographyText>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { ContextMenuItem } from '~/store/ui/types'

export default Vue.extend({
  mixins: [ContextMenu],
  props: {
    items: {
      type: Array as PropType<ContextMenuItem[]>,
      required: true,
    },
  },
  data() {
    return {
      isVisible: false,
    }
  },
  computed: {
    contextMenuValues(): ContextMenuItem[] {
      return this.items
    },
  },
  methods: {
    showMenu(): void {
      this.isVisible = true
    },
    hideMenu(e: Event): void {
      e.stopPropagation()
      this.isVisible = false
    },
    handleAction(e: Event, func: Function): void {
      func()
      this.hideMenu(e)
    },
    handleClick(e: Event): void {
      if (this.isVisible) {
        this.hideMenu(e)
        return
      }
      this.$emit('click')
    },
  },
})
</script>

<style lang="less">
.context-menu-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding: 0 @normal-spacing;
  padding-bottom: 100px;
  &:extend(.fourth-layer);
  position: fixed;
  width: 100%;
  height: 100%;
  &:extend(.blur-less);
  gap: @normal-spacing;
  left: 0;
  top: 0;

  .actions-group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: 600px;
    width: 100%;
    margin: 0 @normal-spacing;

    &:extend(.background-semitransparent-dark);
    &:extend(.font-secondary);
    &:extend(.round-corners);

    .danger {
      color: @red;
    }

    .action-button {
      height: 48px;
      align-items: center;

      &:not(:last-child) {
        border-bottom: 0.5px solid @foreground;
      }
    }
  }
}
</style>
