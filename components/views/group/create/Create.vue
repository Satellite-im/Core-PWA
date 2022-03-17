<template src="./Create.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'CreateGroup',
  data() {
    return {
      loading: false,
      name: '',
      users: '',
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    async confirm() {
      try {
        this.loading = true
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
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }

      this.$store.commit('ui/toggleModal', {
        name: 'creategroup',
        state: false,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Create.less"></style>
