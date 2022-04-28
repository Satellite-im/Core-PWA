<template src="./Quick.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Quick',
  data() {
    return {
      friends: [],
      isLoading: false,
      error: '',
      name: '',
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  watch: {
    'ui.modals.quickchat'(val) {
      if (!val) {
        this.friends = []
        this.isLoading = false
        this.name = ''
        this.error = ''
      }
    },
  },
  methods: {
    async confirm() {
      /* Create Group and Start Chat.  For now Group Messages needs some changes on Solana & IPFS so leave this blank  */

      if (this.$data.friends.length === 1) {
        this.$router.push(`/chat/direct/${this.$data.friends[0].address}`)
        this.$store.commit('ui/toggleModal', {
          name: 'quickchat',
          state: false,
        })
      } else {
        // logic for creating group chat
        try {
          this.isLoading = true
          this.error = ''
          const groupId = await this.$store.dispatch('groups/createGroup', {
            name: this.name,
          })

          await Promise.all(
            this.$data.friends.map(({ address }: { address: string }) =>
              this.$store.dispatch('groups/sendGroupInvite', {
                group: { id: groupId },
                recipient: address,
              }),
            ),
          )
          // close quickchat modal after redirecting to chat
          this.$store.commit('ui/toggleModal', {
            name: 'quickchat',
            state: false,
          })
          this.$router.push(`/chat/groups/${groupId}`)
        } catch (e: any) {
          this.error = `Failed to create group: ${e.message}`
        } finally {
          this.isLoading = false
        }
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Quick.less"></style>
