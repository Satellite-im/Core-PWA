<template>
  <div class="message-actions">
    <div
      class="reply-command has-tooltip has-tooltip-primary"
      :data-tooltip="$t('global.glyphs')"
    >
      <font-awesome-icon
        :icon="['far', 'grin-tongue-wink']"
        :class="`control-icon emoji-icon ${ui.showEnhancers ? 'primary' : ''}`"
        @click="emojiReaction"
      />
    </div>
    <div
      v-if="!hideReply"
      class="reply-command has-tooltip has-tooltip-primary"
      :data-tooltip="$t('global.reply')"
      @click="setReplyChatbarContent"
    >
      <font-awesome-icon :icon="['fas', 'reply']" :class="'control-icon'" />
    </div>
    <div
      class="reply-command has-tooltip has-tooltip-primary"
      :data-tooltip="$t('global.pin')"
    >
      <font-awesome-icon :icon="['far', 'thumbtack']" :class="'control-icon'" />
    </div>
    <div
      class="reply-command has-tooltip has-tooltip-primary"
      :data-tooltip="$t('global.more')"
    >
      <font-awesome-icon
        :icon="['fas', 'ellipsis-h']"
        :class="'control-icon'"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
  props: {
    setReplyChatbarContent: {
      type: Function,
      default: () => () => {},
    },
    emojiReaction: {
      type: Function,
      default: () => () => {},
    },
    hideReply: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
})
</script>
<style lang="less" scoped>
.message-actions {
  position: absolute;
  border: @light-border;
  border-radius: @corner-rounding;
  background: @semitransparent-light-gradient;
  backdrop-filter: @blur;

  top: -18px;
  right: 0;
  display: flex;
  box-sizing: border-box;
  height: 36px;
  .reply-command {
    width: 35px;
    // height: 35px;
    padding: 0.25rem;
    display: flex;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: @semitransparent-light-gradient;
      .control-icon {
        color: @bright-text;
      }
    }

    .control-icon {
      justify-self: center;
      align-self: center;
      font-size: @small-icon-size;
      color: @text;
    }
  }
}
</style>
