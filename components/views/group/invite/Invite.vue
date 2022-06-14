<template src="./Invite.html" />

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Friend } from '~/types/ui/friends'
import { Group } from '~/store/groups/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'GroupInvite',
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
  },
  data() {
    return {
      recipients: [] as Friend[],
      isLoading: false,
      recipient: '',
      error: '',
    }
  },
  computed: {
    groupMembers() {
      return this.group.members.map((p) => p.address)
    },
  },
  methods: {
    async confirm() {
      try {
        this.error = ''
        this.isLoading = true

        await Promise.all(
          this.recipients.map(
            async (recipient) =>
              await this.$store.dispatch('groups/sendGroupInvite', {
                group: this.modal.group,
                recipient: recipient.address,
              }),
          ),
        )

        this.$store.commit('ui/toggleModal', {
          name: 'groupInvite',
          state: { isOpen: false },
        })
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Invite.less"></style>
