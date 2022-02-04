<template>
  <div id="bottom-bar-container">
    <div v-if="!typing" class="is-connected">
      <circle-icon
        :class="`status is-${
          $store.state.webrtc.connectedPeer ? 'online' : 'offline'
        }`"
        size="1x"
      />
      <TypographyText
        v-if="$Hounddog.getActiveFriend($store.state.friends)"
        :text="`${$Hounddog.getActiveFriend($store.state.friends).name}`"
        :size="6"
      />
      <TypographyText
        :text="`is ${
          $store.state.webrtc.connectedPeer ? 'connected' : 'not connected'
        }`"
        :size="6"
      />
    </div>
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
import { CircleIcon } from 'satellite-lucide-icons'
import { Config } from '~/config'

export default Vue.extend({
  components: {
    CircleIcon,
  },
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
    user-select: none;
    -webkit-user-select: none;
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

  .is-connected {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: 20px;
    margin-left: calc(1.4rem - 4px);

    p {
      &:first-of-type {
        font-weight: bold;
      }
      margin-left: 0.4rem;
      margin-bottom: 0;
      line-height: 1.6rem;
      font-size: 0.7em;
    }

    .status {
      font-size: @text-size;
      text-shadow: 0 0 3px #000;
      width: 8px;

      circle {
        stroke: @midground;
        stroke-width: 5;
        paint-order: stroke;
      }
      &.is-online {
        &:extend(.color-success);
        fill: @green;
      }
      &.is-offline {
        &:extend(.font-gray);
        fill: @gray;
      }
      &.is-idle {
        &:extend(.color-warning);
        fill: @yellow;
      }
    }
  }
}
</style>
