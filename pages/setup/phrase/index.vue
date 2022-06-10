<template src="./Phrase.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ClipboardIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'PhraseScreen',
  components: {
    ClipboardIcon,
  },
  computed: {
    ...mapState({
      passPhrase: (state) => (state as RootState).accounts.phrase,
    }),
    splitPhrase(): Array<String> {
      return this.passPhrase.split(' ')
    },
  },
  methods: {
    isOdd(num: any) {
      return num % 2
    },
    confirm() {
      this.$router.replace('/')
    },
    copyPhrase() {
      navigator.clipboard.writeText(this.passPhrase)
      this.$toast.show(this.$t('ui.copied') as string)
    },
  },
})
</script>

<style lang="less" scoped src="./Phrase.less"></style>
