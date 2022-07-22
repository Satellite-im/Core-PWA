<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  GroupConfig,
  GroupMemberDetails,
} from '~/libraries/Iridium/groups/types'

export default Vue.extend({
  props: {
    group: {
      type: Object as PropType<GroupConfig>,
      required: true,
    },
  },
  computed: {
    members(): GroupMemberDetails[] {
      return Object.values(this.group.members)
    },
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
     * @param member <GroupMember> the User object/info for a member
     * @example :source="getSource(member)"
     */
    getSource(member: GroupMemberDetails) {
      return member.photoHash
        ? this.$Config.ipfs.gateway + member.photoHash
        : ''
    },
  },
})
</script>

<style scoped lang="less" src="./GroupIcon.less"></style>
