<template src="./Realm.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Realm } from '~/types/ui/core'

export default Vue.extend({
  props: {
    realm: {
      type: Object as PropType<Realm>,
      default: {},
    },
  },
  computed: {
    networkName() {
      return (
        this.$props.realm.id.charAt(0).toUpperCase() +
        this.$props.realm.id.slice(1)
      )
    },
  },
})
</script>

<style lang="less">
.inline-realm {
  cursor: pointer;
  display: inline-flex;
  flex-direction: row;
  &:extend(.full-width);
  &:extend(.more-pad-sides);
  &:extend(.round-corners);
  &:extend(.background-semitransparent-light);
  border: 1px solid @green;
  margin-top: @normal-spacing;
  align-content: center;

  .status {
    display: inline-flex;
    align-items: center;
  }

  .details {
    display: inline-flex;
    flex-direction: column;

    .subtitle {
      font-size: @text-size;
      margin: 0;
      margin-left: @normal-spacing;
      font-weight: bold;
    }
    .detail {
      font-weight: normal;
      font-size: @mini-text-size;
      font-family: @primary-font;
    }
  }
}
.realm-disabled {
  opacity: 0.4;
  cursor: unset;
  &:extend(.bordered);
}
</style>
