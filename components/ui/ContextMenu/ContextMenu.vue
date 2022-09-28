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
      <!-- Quick Reactions -->
      <div class="actions-group">
        <template v-for="item in items">
          <div
            v-if="item.text === 'quickReaction' && mostUsedEmojis.length"
            :key="String(item.text) + '-action'"
            class="quick-reaction-container"
          >
            <div
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              class="reaction"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </div>
          </div>
        </template>
      </div>

      <!-- Item Buttons -->
      <div class="actions-group">
        <template v-for="item in items">
          <button
            v-if="item.text !== 'quickReaction'"
            :key="String(item.text) + '-action'"
            class="action-button"
            :class="item?.type"
            @click="(e) => handleAction(e, item.func)"
          >
            <TypographyText :color="item?.type">
              {{ item.text }}
            </TypographyText>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { ContextMenuItem, EmojiUsage } from '~/store/ui/types'

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
    ...mapGetters('ui', ['getSortedMostUsedEmojis']),
    mostUsedEmojis(): EmojiUsage[] {
      return this.getSortedMostUsedEmojis || []
    },
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
  padding: 0 @normal-spacing @normal-spacing;
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
    &:extend(.round-corners);

    .action-button {
      height: 56px;
      justify-content: center;
      align-items: center;
      width: 100%;

      &.disabled {
        opacity: 0.5;
      }

      &:not(:last-child) {
        border-bottom: 0.5px solid @foreground;
      }
    }

    .quick-reaction-container {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
      height: 64px;
      overflow: hidden;

      .reaction {
        display: flex;
        flex: 1 0 20%;
        justify-content: center;
        align-items: center;
        height: 100%;
        font-size: 24px;
      }
    }
  }
}
</style>
