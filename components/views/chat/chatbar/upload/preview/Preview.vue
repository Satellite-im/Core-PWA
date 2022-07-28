<template src="./Preview.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      countError: (state: RootState) => state.chat.countError,
      files(state: RootState) {
        return state.chat.files?.[this.$route.params.id] ?? []
      },
    }),
  },
  methods: {
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    removeUploadItem(index: number) {
      this.$store.commit('chat/removeFile', {
        id: this.$route.params.id,
        index,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Preview.less"></style>
