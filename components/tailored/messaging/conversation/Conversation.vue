<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import vuescroll from 'vuescroll'

import { MessageGroup } from '~/types/messaging'

export default Vue.extend({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array as PropType<MessageGroup>,
      default: () => [],
    },
  },
  data() {
    return {
      updated: Date.now(),
      updateInterval: null,
      ops: {
        bar: {
          opacity: '0'
        },
        vuescroll: {
          mode: 'slide',
          pullRefresh: {
            enable: true,
            tips: {
              start: this.$t('scrolling.pull_down.active_message'), // Message shown while waiting for timeout/ajax retrieval
              active: this.$t('scrolling.pull_down.release_message'), // Message shown when user scrolls down far enough for method to be called, eg: let go to fire method
              deactive: this.$t('scrolling.pull_down.hint_message'), // Message that appears when use begins to pull down
            }
          },
          pushLoad: {
            enable: true,
            auto: true,
            start: this.$t('scrolling.pull_up.active_message'),
            active: this.$t('scrolling.pull_up.release_message'),
            deactive: this.$t('scrolling.pull_up.hint_message'),
          },
        },
      },
      noData: false,
      triggerType: 'load'
    }
  },
  mounted() {
    // Updates time ago
    this.$data.updateInterval = setInterval(() => {
      this.updated = Date.now()
    }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.$data.updateInterval)
  },
  methods: {
    // TODO: In these pull up/down methods remove the timeouts once we are really pulling data async
    pullUpStart(vm: vuescroll, dom: Element, done: () => void) {
      setTimeout(() => {
        this.noData = true;
        done();
      }, 3000);
    },
    pullUpEnd(vm: vuescroll, dom: Element) {
      setTimeout(() => {
      }, 3000);
    },
    pullDownStart(vm: vuescroll, dom: Element, done: () => void) {
      setTimeout(() => {
        this.noData = true;
        done();
      }, 3000);
    },
    pullDownEnd(vm: vuescroll, dom: Element) {
      setTimeout(() => {
      }, 3000);
    },
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>