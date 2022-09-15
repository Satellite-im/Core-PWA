<template>
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
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, PropType } from 'vue'
import { mapGetters } from 'vuex'
import { ContextMenuItem, EmojiUsage } from '~/store/ui/types'

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<ContextMenuItem[]>,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['click', 'action', 'hide'],
  setup(props, { emit }) {
    const contextMenu = ref<HTMLElement>()
    const { getSortedMostUsedEmojis } = mapGetters('ui', [
      'getSortedMostUsedEmojis',
    ])
    const mostUsedEmojis: ComputedRef<EmojiUsage[]> = computed(
      () => getSortedMostUsedEmojis() || [],
    )

    const handleAction = (e: Event, func: Function) => {
      emit('action', e, func)
    }

    const hideMenu = (e: Event) => {
      emit('hide', e)
    }

    const handleClick = (e: Event) => {
      if (props.isVisible) {
        hideMenu(e)
        return
      }
      emit('click')
    }

    return {
      contextMenu,
      mostUsedEmojis,
      handleAction,
      handleClick,
    }
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
