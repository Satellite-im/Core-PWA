<template>
  <UiBanner>
    <template #header>{{ $t('pages.unlock.browser_warning_header') }}</template>
    <template #content>
      {{ $t('pages.unlock.browser_warning_content') }}
      {{ $t('pages.unlock.browser_warning_content2') }}
      <p>
        <a
          :href="$t('pages.unlock.browser_warning_link')"
          class="link"
          target="_blank"
          >Blog Post
        </a>
      </p>
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
    UiBanner,
  },
})
</script>

<style lang="less" scoped>
.link {
  text-decoration-color: #feca5770;
  text-decoration: underline;
  &:extend(.color-warning);
}
</style>
