<template>
  <div class="cta" data-cy="modal-cta">
    <satellite-icon class="sat-icon" size="3.5x" />
    <TypographyText as="h1" class="heading">
      {{ $t('modal.call_to_action.title') }}
    </TypographyText>
    <TypographyText> {{ $t('modal.call_to_action.subtitle') }} </TypographyText>
    <TypographyText>
      <ul>
        <li>{{ $t('modal.call_to_action.item1') }}</li>
        <li>{{ $t('modal.call_to_action.item2') }}</li>
        <li>{{ $t('modal.call_to_action.item3') }}</li>
        <li>{{ $t('modal.call_to_action.item4') }}</li>
        <li>{{ $t('modal.call_to_action.item5') }}</li>
      </ul>
    </TypographyText>
    <hr />
    <TypographyText color="dark">
      {{ $t('modal.call_to_action.description') }}
    </TypographyText>
    <InteractablesButton
      class="button"
      data-cy="btn-call-to-action"
      :text="$t('modal.call_to_action.btn')"
      size="lg"
      link="https://twitter.com/satellite_im"
    >
      <radio-icon size="1.5x" />
    </InteractablesButton>
  </div>
</template>

<script setup lang="ts">
import { RadioIcon, SatelliteIcon } from 'satellite-lucide-icons'
</script>

<style scoped lang="less" src="./CallToAction.less"></style>
