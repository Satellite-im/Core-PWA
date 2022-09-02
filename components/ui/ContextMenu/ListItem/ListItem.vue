<template>
  <div>{{ item.text }}</div>
</template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'
import { ContextMenuItem } from '~/store/ui/types'

export default Vue.extend({
  components: {},
  mixins: [],
  props: {
    item: {
      type: Object as PropType<ContextMenuItem>,
      required: true,
    },
  },
  data() {},
  methods: {},
})
</script>

<style lang="less"></style>
