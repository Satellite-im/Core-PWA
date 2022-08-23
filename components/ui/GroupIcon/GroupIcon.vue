<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  props: {
    members: {
      type: Array as PropType<User[]>,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
  },
  computed: {
    /**
     * @method groupClass
     * @description Returns classname as string based on group members
     * @example :class="groupClass"
     */
    groupClass(): string {
      if (this.members.length > 2) return 'multi'
      if (this.members.length > 1) return 'double'
      return 'single'
    },
    /**
     * @method groupIconSize
     * @description Returns icon size for UICircle for single/two person groups
     * @example :size="groupIconSize"
     */
    groupIconSize(): number {
      if (this.members.length > 1) return 25
      return 36
    },
  },
  methods: {
    /**
     * @method getSource
     * @description Returns user profile image source hash, stored in IPFS, if they have one
     * @param did
     * @example :source="getSource(did)"
     */
    getSource(user: User) {
      return user?.photoHash && this.$Config.ipfs.gateway + user.photoHash
    },
  },
})
</script>

<style scoped lang="less" src="./GroupIcon.less"></style>
