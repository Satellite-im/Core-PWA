<template>
  <div id="bottom-bar-container">
    <UiChatTypingIndicator v-if="typing" :users="usersTyping" />
    <span :class="['charlimit', charlimit ? 'is-error' : 'is-normal']">
      {{ `${calculateLength(ui.chatbarContent)}/${maxChars}` }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'
import { toArray } from 'lodash'

export default Vue.extend({
  props: {
    charlimit: {
      type: Boolean,
    },
    usersTyping: {
      type: Array,
      default: () => [{ name: 'Phoenix' }, { name: 'Ariel' }],
    },
    typing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maxChars: 256,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method calculateLength
     * @description Calculates the length of a message; and handles emojis to only be counted as one character length
     * @returns new length of message
     * @example calculateLength(ui.chatbarContent)
     */
    calculateLength(inputString: string) {
      return _.toArray(inputString).length
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
    color: @text-muted;
    margin-left: auto;
    &.is-error {
      color: @red;
    }
  }
  &.is-error {
    border: 1px solid @red;

    .control-icon {
      &:nth-child(4) {
        color: @red;
      }
    }
  }
}
</style>
