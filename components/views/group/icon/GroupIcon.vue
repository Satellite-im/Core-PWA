<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Group, GroupMember } from '~/store/groups/types'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
  },
  computed: {
    /**
     * @method groupClass
     * @description Returns classname as string based on group members
     * @example :class="groupClass"
     */
    groupClass(): string {
      if (this.group.members.length > 2) return 'multi'
      if (this.group.members.length > 1) return 'double'
      return 'single'
    },
    /**
     * @method groupIconSize
     * @description Returns icon size for UICircle for single/two person groups
     * @example :size="groupIconSize"
     */
    groupIconSize(): number {
      if (this.group.members.length > 1) return 25
      return 36
    },
  },
  methods: {
    /**
     * @method getSource
     * @description Returns user profile image source hash, stored in IPFS, if they have one
     * @param member <GroupMember> the User object/info for a member
     * @example :source="getSource(member)"
     */
    getSource(member: GroupMember) {
      return member?.photoHash
        ? `${this.$Config.textile.browser}/ipfs/${member.photoHash}`
        : ''
    },
  },
})
</script>

<style scoped lang="less" src="./GroupIcon.less"></style>
