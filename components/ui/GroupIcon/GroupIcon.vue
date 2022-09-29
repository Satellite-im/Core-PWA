<template src="./GroupIcon.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Conversation } from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/users/types'
import iridium from '~/libraries/Iridium/IridiumManager'

type GroupType = 'multi' | 'double' | 'single'

function getIconSize(type: GroupType, index: number) {
  switch (type) {
    case 'multi':
      if (index === 0) return 30
      if (index === 1) return 20
      return 10
    case 'double':
      if (index === 0) return 30
      return 20
    default:
      return 36
  }
}

export default Vue.extend({
  props: {
    members: {
      type: Array as PropType<Conversation['participants']>,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
  },
  data() {
    return {
      users: iridium.users.state,
    }
  },
  computed: {
    /**
     * @method groupClass
     * @description Returns classname as string based on group members
     * @example :class="groupClass"
     */
    groupClass(): GroupType {
      if (this.members.length > 2) return 'multi'
      if (this.members.length > 1) return 'double'
      return 'single'
    },
    membersInfo(): User[] {
      return this.members
        .map((did, i) => ({
          ...(this.users?.[did] || {
            did,
            name: did,
          }),
          size: getIconSize(this.groupClass, i),
        }))
        .slice(0, 3)
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
