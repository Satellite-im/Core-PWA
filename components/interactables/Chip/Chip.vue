<template>
  <div v-if="show" :class="`chip-item size-${size}`">
    <UiCircle
      v-if="friend"
      :type="src ? 'image' : 'random'"
      :seed="friend.address"
      :size="16"
      :source="src"
    />
    <div class="text">
      {{ text }}
    </div>
    <x-icon size="1x" @click="hide" />
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
  data() {
    return {
      show: true,
    }
  },
  computed: {
    src(): string {
      const hash = this.friend.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
  methods: {
    /**
     * @method hide
     * @description Hides chip element
     */
    hide() {
      this.show = false
      this.$emit('delete')
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
  margin-right: @light-spacing;
  margin-bottom: @light-spacing;
  padding: @xlight-spacing;
  border-radius: @corner-rounding-xxlarge;
  color: white;
  line-height: 0;

  .text {
    margin: 0 0.125rem 0 @xlight-spacing;
  }

  &.size-small {
    font-size: @mini-text-size;
  }
}
</style>
