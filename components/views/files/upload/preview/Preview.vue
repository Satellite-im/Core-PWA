<template src="./Preview.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { XIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    XIcon,
  },
  computed: {
    ...mapState({
      chat: (state) => (state as RootState).chat,
    }),
    ...mapGetters({ files: 'chat/getFiles' }),
    ...mapGetters('conversation', ['recipient']),
    countError: {
      set(state) {
        this.$store.commit('chat/setCountError', state)
      },
      get(): boolean {
        return this.chat.countError
      },
    },
  },
  methods: {
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    removeUploadItem(index: number) {
      this.$store.dispatch('chat/removeUploadItem', {
        itemIndex: index,
        files: this.files,
        recipientAddress: this.recipient.address,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Preview.less"></style>
