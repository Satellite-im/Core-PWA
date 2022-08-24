<template src="./Realm.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { Realm } from '~/types/ui/core'

export default Vue.extend({
  props: {
    realm: {
      type: Object as PropType<Realm>,
      default: () => ({}),
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
  display: flex;
  align-items: center;
  border: 1px solid @green;
  margin-top: @normal-spacing;
  gap: 16px;
  background: @foreground-gradient;
  padding: 8px 16px;
  &:extend(.round-corners);

  .details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    .available {
      display: flex;
      gap: 0.5rem;
    }
  }
}
.realm-disabled {
  opacity: 0.4;
  cursor: unset;
  &:extend(.bordered);
}
</style>
