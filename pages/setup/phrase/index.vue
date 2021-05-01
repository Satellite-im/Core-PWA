<template src="./Phrase.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      phrase:
        'truth brown crater taste unable cup modify brass today valley opera moment',
    }
  },
  computed: {
    splitPhrase(): Array<String> {
      return this.$data.phrase.split(' ')
    },
  },
  methods: {
    isOdd(num: any) {
      return num % 2
    },
  },
})
</script>

<style lang="less" scoped src="./Phrase.less"></style>
