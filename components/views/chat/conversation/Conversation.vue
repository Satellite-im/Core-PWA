<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'
import { ChevronDownIcon } from 'satellite-lucide-icons'

import { MessageGroup } from '~/types/messaging'
import Group from '~/components/views/chat/group/Group.vue'

export default Vue.extend({
  components: { 'virtual-list': VirtualList },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array as PropType<MessageGroup>,
      default: () => [],
    },
    groupId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      itemComponent: Group,
    }
  },
  computed: {
    ...mapState(['ui', 'textile']),
    showOlderMessageInfo() {
      return this.ui.showOlderMessagesInfo
    },
  },
  watch: {
    messages() {
      this.setVirtualListToBottom()
    },
  },
  mounted() {
    this.setVirtualListToBottom()
  },
  created() {
    this.$nuxt.$on('scrollToBottom', this.setVirtualListToBottom)
  },
  beforeDestroy() {
    this.$nuxt.$off('scrollToBottom')
  },
  methods: {
    setVirtualListToBottom() {
      if (!this.$refs.vsl) {
        return
      }
      this.$refs.vsl.scrollToBottom()
    },
    onScroll() {
      if (!this.$refs.vsl) {
        return
      }
      const scrollSize = this.$refs.vsl.getScrollSize()
      const clientSize = this.$refs.vsl.getClientSize()
      const offset = this.$refs.vsl.getOffset()

      if (scrollSize - clientSize - 300 > offset) {
        if (!this.ui.showOlderMessagesInfo) {
          this.$store.commit('ui/setShowOlderMessagesInfo', true)
        }
      } else if (this.ui.showOlderMessagesInfo) {
        this.$store.commit('ui/setShowOlderMessagesInfo', false)
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
