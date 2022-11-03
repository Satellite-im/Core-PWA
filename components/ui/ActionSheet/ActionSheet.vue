<template>
  <transition name="context-menu">
    <div
      v-if="isVisible"
      class="context-menu-container"
      data-cy="context-menu"
      @click.stop="hideMenu"
    >
      <div class="inner">
        <!-- Quick Reactions -->
        <div
          v-if="quickReactions?.length && mostUsedEmojis?.length"
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
        </div>

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

        <!-- Cancel Button -->
        <div class="actions-group">
          <button class="action-button" @click.stop="hideMenu">
            {{ $t('ui.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
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

// TODO: Enable when feature is ready
// const { getSortedMostUsedEmojis } = mapGetters('ui', [
//   'getSortedMostUsedEmojis',
// ])
// const mostUsedEmojis: ComputedRef<EmojiUsage[]> = computed(
//   () => getSortedMostUsedEmojis() || [],
// )
const mostUsedEmojis: ComputedRef<EmojiUsage[]> = computed(() => [])

const quickReactions = computed(() => {
  return props.items.filter((item) => item.text === 'quickReaction')
})

const handleAction = (func: Function, type?: string) => {
  if (type === 'disabled') {
    return
  }
  emit('action', func)
}

const hideMenu = () => {
  emit('hide')
}
</script>

<style lang="less" scoped>
.context-menu-container {
  position: fixed;
  background: fade(@black, 25%);
  z-index: 100;
  top: calc(0px - var(--safe-area-inset-top));
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;

  .inner {
    position: absolute;
    inset: auto 0 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    padding-bottom: ~'max(1rem, var(--safe-area-inset-bottom))';
  }

  .actions-group {
    max-width: 600px;
    width: 100%;
    overflow: hidden;

    .background-semitransparent-light();
    .round-corners();
    .blur();
    box-shadow: @ui-shadow;

    .action-button {
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

.context-menu-enter-active {
  transition: background @animation-speed-medium ease;

  .inner {
    transition: transform @animation-speed-medium ease-out;
  }
}

.context-menu-leave-active {
  transition: background @animation-speed-medium ease;

  .inner {
    transition: transform @animation-speed-medium ease-in;
  }
}

.context-menu-enter,
.context-menu-leave-to {
  background: fade(@black, 0%);

  .inner {
    transform: translateY(
      calc(100% + max(@normal-spacing, var(--safe-area-inset-bottom)))
    );
  }
}
</style>
