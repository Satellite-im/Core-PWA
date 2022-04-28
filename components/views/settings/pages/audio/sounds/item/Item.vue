<template>
  <div class="sounds-item">
    <TypographyTitle :size="7" :text="title" />
    <InteractablesSwitch :is-enabled="value" @toggle="toggle" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'NotificationsSettingsSoundsItem',
  layout: 'sounds_item',
  model: {
    prop: 'value',
    event: 'toggle',
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      val: true,
    }
  },
  computed: {},
  mounted(): void {},
  methods: {
    toggle(value: Boolean) {
      this.$emit('toggle', value)
    },
  },
})
</script>

<style lang="less" scoped>
.sounds-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @light-spacing 0;
  .title {
    margin-bottom: 0;
  }
}
</style>
