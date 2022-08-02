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
            <p
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </p>
            <p
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </p>
            <p
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </p>
            <p
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </p>
            <p
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </p>
            <p
              v-for="reaction of mostUsedEmojis"
              :key="reaction.content"
              data-cy="quick-reaction"
              @click="
                (e) =>
                  handleAction(e, () => {
                    item.func(reaction)
                  })
              "
            >
              {{ reaction.content }}
            </p>
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
            :class="{ danger: item.type === 'danger' }"
            @click="(e) => handleAction(e, item.func)"
          >
            <TypographySubtitle
              :text="item.text"
              :size="6"
              :class="{ danger: item.type === 'danger' }"
            />
          </button>
        </template>
      </div>

      <!-- Cancel Button -->
      <div class="actions-group">
        <button class="action-button" @click="hideMenu">
          <TypographySubtitle
            :text="$t('ui.cancel')"
            :size="6"
            class="danger"
          />
        </button>
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
      justify-content: center;
      align-items: center;
      width: @full;

      &:not(:last-child) {
        border-bottom: 0.5px solid @foreground;
      }
    }

    .quick-reaction-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
      grid-template-rows: auto;
      grid-auto-rows: 0px;
      overflow: hidden;
      overflow-y: hidden;
      width: @full;
      padding: @light-spacing;

      p {
        display: flex;
        flex-grow: 1;
        font-size: 1.25rem;
        justify-content: center;
        align-items: center;
        border-radius: unset;

        &:first-of-type {
          border-radius: @corner-rounding 0 0 @corner-rounding;
        }
        &:last-of-type {
          border-radius: 0 @corner-rounding @corner-rounding 0;
        }
      }
    }
  }
}
</style>
