<template>
  <div class="checkbox" :class="{ checked: value }">
    <check-icon />
    <input
      type="checkbox"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    />
  </div>
</template>

<script setup lang="ts">
import { CheckIcon } from 'satellite-lucide-icons'

interface Props {
  value?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  value: false,
})
</script>

<style scoped lang="less" src="./Checkbox.less"></style>
