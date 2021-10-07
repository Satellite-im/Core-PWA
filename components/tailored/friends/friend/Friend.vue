<template src="./Friend.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  XIcon,
  CheckIcon,
  MoreVerticalIcon,
  MessageSquareIcon,
  CircleIcon,
  SmartphoneIcon,
} from 'satellite-lucide-icons'

import { Friend, IncomingRequest } from '~/types/ui/friends'

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
  },
  data() {
    return {
      loading: '' as '' | 'accept' | 'decline',
    }
  },
  methods: {
    async acceptFriendRequest() {
      this.loading = 'accept'
      try {
        await this.$store.dispatch('acceptFriendRequest', {
          friendRequest: this.$props.friend.request,
          textileMailboxId:
            'cafkwqw5h6zlko43enhmrrlksx3fhitmojzpnwtagbrjcflm737btxbq', // TO DO : change textileMailboxId when it'll be available
        })
      } catch (e) {
        console.log('error', e)
      } finally {
        this.loading = ''
      }
    },
    async declineFriendRequest() {
      this.loading = 'decline'
      console.log(this.$props.friend.request)
      try {
        await this.$store.dispatch(
          'denyFriendRequest',
          this.$props.friend.request
        )
      } catch (e) {
        console.log('error', e)
      } finally {
        this.loading = ''
      }
      // await new Promise((resolve) => {
      //   setTimeout(() => {
      //     this.loading = ''
      //     return resolve('DECLINE')
      //   }, 2000)
      // })
    },
  },
})
</script>
<style scoped lang="less" src="./Friend.less"></style>
