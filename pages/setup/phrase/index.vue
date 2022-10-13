<template src="./Phrase.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ClipboardIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import { capacitorHooks } from '~/components/compositions/capacitor'

export default Vue.extend({
  name: 'PhraseScreen',
  components: {
    ClipboardIcon,
  },
  setup() {
    const { copyText } = capacitorHooks()

    return {
      copyText,
    }
  },
  computed: {
    ...mapState({
      passPhrase: (state) => (state as RootState).accounts.phrase,
    }),
    splitPhrase(): String[] {
      return this.passPhrase.split(' ')
    },
  },
  methods: {
    isOdd(num: number): boolean {
      return num % 2 === 1
    },
    confirm() {
      this.$router.replace('/')
    },
  },
})
</script>

<style lang="less" scoped src="./Phrase.less"></style>
