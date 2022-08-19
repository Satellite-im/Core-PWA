<template>
  <div :class="`chip-item size-${size}`">
    <UiCircle
      v-if="friend"
      :type="src ? 'image' : 'random'"
      :seed="friend.did"
      :size="16"
      :source="src"
    />
    <div class="text">
      {{ text }}
    </div>
    <x-icon class="delete-icon" size="1x" @click="$emit('delete')" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { XIcon } from 'satellite-lucide-icons'
import { Friend } from '~/types/ui/friends'

export enum ChipSize {
  Medium = 'medium',
  Small = 'small',
}

export default Vue.extend({
  components: {
    XIcon,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    size: {
      type: String as unknown as PropType<ChipSize>,
      default: ChipSize.Medium,
    },
    friend: {
      type: Object as PropType<Friend> | undefined,
      default: undefined,
    },
  },
  computed: {
    src(): string {
      const hash = this.friend.profilePicture
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less">
.chip-item {
  .fa-times {
    cursor: pointer;
  }

  display: inline-flex;
  flex-shrink: 0;
  flex-direction: row;
  align-items: center;
  padding: @xlight-spacing;
  border-radius: @corner-rounding-xxlarge;
  color: white;
  max-width: 100%;

  .circle,
  .delete-icon {
    flex-shrink: 0;
  }

  .text {
    margin: 0 0.125rem 0 @xlight-spacing;
    &:extend(.ellipsis);
    align-self: stretch;
  }

  &.size-small {
    font-size: @mini-text-size;
  }

  .delete-icon {
    cursor: pointer;
  }
}
</style>
