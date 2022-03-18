<template src="./Create.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'CreateGroup',
  data() {
    return {
      error: '',
      name: '',
      users: '',
      isLoading: false,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    async confirm() {
      try {
        this.error = ''
        this.isLoading = true
        const usersToInvite = this.users.split(',')

        const groupId = await this.$store.dispatch('groups/createGroup', {
          name: this.name,
        })

        await Promise.all(
          usersToInvite.filter(Boolean).map((user: string) =>
            this.$store.dispatch('groups/sendGroupInvite', {
              group: { id: groupId },
              recipient: user,
            }),
          ),
        )
        this.$store.commit('ui/toggleModal', {
          name: 'creategroup',
          state: false,
        })
      } catch (e: any) {
        this.error = `Failed to create group: ${e.message}`
      } finally {
        this.isLoading = false
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Create.less"></style>
