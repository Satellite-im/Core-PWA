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
      /* Create Group and Start Chat.  For now Group Messages needs some changes on Solana & IPFS so leave this blank  */

      // if (this.$data.friends.length === 1) {
      //   this.$router.push(`/chat/group/${this.$data.friends[0].address}`)
      // } else {
      //   // logic for creating group chat
      // }
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
