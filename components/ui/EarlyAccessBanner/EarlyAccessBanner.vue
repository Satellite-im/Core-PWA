<template>
  <UiBanner>
    <template #icon><package-icon size="1x" /></template>
    <template #header>{{ $t('ui.early_access') }}</template>
    <template #content>
      {{ $t('ui.early_access_message') }}
      <a :href="$t('ui.early_access_link')" class="banner-link" target="_blank">
        {{ $t('ui.early_access_link') }}
      </a>
    </template>
  </UiBanner>
</template>

<script lang="ts">
import Vue from 'vue'
import { PackageIcon } from 'satellite-lucide-icons'
import UiBanner from '~/components/ui/Banner/Banner.vue'

export default Vue.extend({
  components: {
    PackageIcon,
    UiBanner,
  },
})
</script>

<style lang="less" scoped>
.banner-link {
  text-decoration-color: #feca5770;
  &:extend(.color-warning);
}
</style>
