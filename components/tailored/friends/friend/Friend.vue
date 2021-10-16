<template src="./Friend.html"></template>
<script lang="ts">
import { PublicKey } from '@solana/web3.js'
import Vue, { PropType } from 'vue'

import {
  XIcon,
  CheckIcon,
  MoreVerticalIcon,
  MessageSquareIcon,
  CircleIcon,
  SmartphoneIcon,
} from 'satellite-lucide-icons'

import { Friend } from '~/types/ui/friends'

export default Vue.extend({
  components: {
    XIcon,
    CheckIcon,
    MoreVerticalIcon,
    MessageSquareIcon,
    CircleIcon,
    SmartphoneIcon,
  },
  props: {
    friend: {
      type: Object as PropType<Friend>,
      default: () => {},
    },
    request: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    send: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: '' as '' | 'accept' | 'decline' | 'sending',
    }
  },
  methods: {
    async createFriendRequest() {
      this.loading = 'sending'
      try {
        await this.$store.dispatch('createFriendRequest', {
          friendToKey: new PublicKey(this.$props.friend.account.accountId),
          textileMailboxId:
            'cafkwqw5h6zlko43enhmrrlksx3fhitmojzpnwtagbrjcflm737btxbq', // TO DO : change textileMailboxId when it'll be available
        })
        this.$emit('requestSent', '')
      } catch (e) {
        this.$emit('requestSent', e.message)
      } finally {
        this.loading = ''
      }
    },
    async acceptFriendRequest() {
      this.loading = 'accept'
      try {
        await this.$store.dispatch('acceptFriendRequest', {
          friendRequest: this.$props.friend.request,
          textileMailboxId:
            'cafkwqw5h6zlko43enhmrrlksx3fhitmojzpnwtagbrjcflm737btxbq', // TO DO : change textileMailboxId when it'll be available
        })
      } finally {
        this.loading = ''
      }
    },
    async declineFriendRequest() {
      this.loading = 'decline'
      try {
        await this.$store.dispatch(
          'denyFriendRequest',
          this.$props.friend.request
        )
      } finally {
        this.loading = ''
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
