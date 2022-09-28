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
      passPhrase: (state: RootState) => state.accounts.phrase,
    }),
    splitPhrase(): Array<String> {
      return this.passPhrase.split(' ')
    },
  },
  methods: {
    isOdd(num: number): boolean {
      return num % 2 === 1
    },
    confirm(): void {
      this.$router.replace('/')
    },
    copyPhrase(): void {
      navigator.clipboard.writeText(this.passPhrase)
      this.$toast.show(this.$t('ui.copied') as string)
    },
  },
})
</script>

<style lang="less" scoped src="./Phrase.less"></style>
