<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import VirtualList from 'vue-virtual-scroll-list'

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
  },
  watch: {
    messages() {
      this.setVirtualListToBottom()
    },
  },
  mounted() {
    this.setVirtualListToBottom()
  },
  methods: {
    setVirtualListToBottom() {
      if (!this.$refs.vsl) {
        return
      }
      this.$refs.vsl.scrollToBottom()
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
