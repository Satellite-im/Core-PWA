<template>
  <!-- Desktop Context Menu -->
  <div
    v-if="!$device.isMobile"
    @contextmenu="contextMenu"
    @click.stop.prevent="handleClick"
  >
    <slot />
  </div>

  <!-- Mobile Context Menu -->
  <div v-else v-contextmenu="showMenu">
    <slot />
    <ActionSheet
      :items="items"
      :is-visible="isVisible"
      @click.stop.prevent="handleClick"
      @action="handleAction"
      @hide="hideMenu"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { ContextMenuItem, EmojiUsage } from '~/store/ui/types'
import ActionSheet from '~/components/ui/ActionSheet/ActionSheet.vue'

export default Vue.extend({
  components: { ActionSheet },
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
    hideMenu(): void {
      this.isVisible = false
    },
    handleAction(func: Function): void {
      func()
      this.hideMenu()
    },
    handleClick(): void {
      if (this.isVisible) {
        this.hideMenu()
        return
      }
      this.$emit('click')
    },
  },
})
</script>

<style lang="less" scoped></style>
