<template>
  <div
    ref="contextMenu"
    class="context-menu-container"
    :class="{ 'is-visible': isVisible }"
    data-cy="context-menu"
    @click.stop="hideMenu"
  >
    <!-- Quick Reactions -->
    <!-- <div
      v-if="quickReactions.length && mostUsedEmojis.length"
      class="actions-group"
    >
      <template v-for="reaction in quickReactions">
        <div
          v-if="reaction.text === 'quickReaction' && mostUsedEmojis.length"
          :key="String(reaction.text) + '-action'"
          class="quick-reaction-container"
        >
          <div
            v-for="emoji of mostUsedEmojis"
            :key="emoji.content"
            class="reaction"
            data-cy="quick-reaction"
            @click.stop="
              () =>
                handleAction(() => {
                  reaction.func(reaction)
                })
            "
          >
            {{ emoji.content }}
          </div>
        </div>
      </template>
    </div> -->

    <!-- Item Buttons -->
    <div class="actions-group">
      <template v-for="item in items">
        <button
          v-if="item.text !== 'quickReaction'"
          :key="String(item.text) + '-action'"
          class="action-button"
          :class="item.type"
          @click.stop="() => handleAction(item.func, item.type)"
        >
          <TypographyText :color="item?.type" class="action-button-text">
            {{ item.text }}
          </TypographyText>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed, ComputedRef, ref } from 'vue'
import { mapGetters } from 'vuex'
import { ContextMenuItem, EmojiUsage } from '~/store/ui/types'

interface Props {
  items: ContextMenuItem[]
  isVisible: boolean
}
interface Emits {
  (e: 'action', event: Function): void
  (e: 'hide'): void
}
const emit = defineEmits<Emits>()

const props = defineProps<Props>()

// @ts-ignore
const { $store } = useNuxtApp()
const contextMenu = ref<HTMLElement>()
const { getSortedMostUsedEmojis } = mapGetters('ui', [
  'getSortedMostUsedEmojis',
])
const mostUsedEmojis: ComputedRef<EmojiUsage[]> = computed(
  () => getSortedMostUsedEmojis() || [],
)

const quickReactions = computed(() => {
  return props.items.filter((item) => item.text === 'quickReaction')
})

const handleAction = (func: Function, type?: string) => {
  if (type === 'disabled') {
    return
  }
  emit('action', func)
}

const isVisible = computed(() => props.isVisible)

watch(isVisible, (isVisible) => {
  $store.commit('ui/setIsMobileNavVisible', !isVisible)
})

const hideMenu = () => {
  emit('hide')
}
</script>

<style lang="less" scoped>
.context-menu-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  padding: 0 @normal-spacing @normal-spacing;
  &:extend(.fourth-layer);
  position: fixed;
  width: 100%;
  &:extend(.blur-less);
  gap: @normal-spacing;
  left: 0;
  top: 0;

  opacity: 0;
  height: 0;
  transition: opacity @animation-speed-long ease, height 0.5s ease 2s;

  &.is-visible {
    opacity: 1;
    height: 100%;
    transition: opacity @animation-speed-long ease;
  }

  .actions-group {
    max-width: 600px;
    width: 100%;
    margin: 0 @normal-spacing;

    .background-semitransparent-light();
    .round-corners();
    .blur();

    .action-button {
      .background-semitransparent-light();
      .blur();
      height: 56px;
      justify-content: center;
      align-items: center;
      width: 100%;

      &.disabled {
        .action-button-text {
          color: @dark;
          opacity: 0.5;
        }
      }

      &:not(:last-child) {
        border-bottom: 0.5px solid @foreground-alt;
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
