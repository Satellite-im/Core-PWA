<template>
  <UiBanner>
    <template #icon><package-icon size="1x" /></template>
    <template #header>{{ $t('ui.early_access') }}</template>
    <template #content>
      {{ $t('ui.early_access_message') }}
      <a
        :href="$config.feedbackUrl"
        class="link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $config.feedbackUrl }}
      </a>
    </template>
  </UiBanner>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { PackageIcon } from 'satellite-lucide-icons'
import UiBanner from '~/components/ui/Banner/Banner.vue'

export default defineComponent({
  name: 'EarlyAccessBanner',
  components: {
    PackageIcon,
    UiBanner,
  },
})
</script>

<style lang="less" scoped>
.link {
  text-decoration-color: #feca5770;
  &:extend(.color-warning);
}
</style>
