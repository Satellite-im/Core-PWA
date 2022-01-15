<template>
  <div id="bottom-bar-container">
    <UiChatTypingIndicator v-if="typing" :users="usersTyping" />
    <span :class="['charlimit', charlimit ? 'is-error' : 'is-normal']">
      {{ lengthCount }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { toArray } from 'lodash'
import { Config } from '~/config'

export default Vue.extend({
  props: {
    charlimit: {
      type: Boolean,
    },
    usersTyping: {
      type: Array,
      default: () => [{ name: 'Phoenix' }, { name: 'Ariel' }],
      required: false,
    },
    typing: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapState(['ui']),
    lengthCount() {
      /* toArray(): https://lodash.com/docs/4.17.15#toArray */
      return `${toArray(this.ui.chatbarContent).length}/${
        this.$Config.chat.maxChars
      }`
    },
  },
})
</script>

<style lang="less">
#bottom-bar-container {
  display: flex;
  justify-content: space-between;
  // height: 1.5rem;
  align-items: center;
  padding: 5px 0px 5px 20px;

  .charlimit {
    float: right;
    margin-right: 2rem;
    font-size: @mini-text-size;
    &:extend(.font-muted);
    margin-left: auto;
    &.is-error {
      &:extend(.color-danger);
    }
  }
  &.is-error {
    border: 1px solid @red;

    .control-icon {
      &:nth-child(4) {
        &:extend(.color-danger);
      }
    }
  }
}
</style>
