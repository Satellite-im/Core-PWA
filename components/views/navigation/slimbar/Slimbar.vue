<template>
  <div class="slimbar hidden-scroll">
    <UiCircle class="sat-icon" type="icon" :size="40">
      <satellite-icon size="0.75x" />
    </UiCircle>
    <hr />
    <UiComingSoon :tooltip-text="$t('coming_soon.communities')">
      <div class="circle-group">
        <UiCircle
          v-for="server in servers"
          :key="server.address"
          type="random"
          :size="40"
          :seed="server.address"
          :name="server.name"
        />
      </div>
    </UiComingSoon>
    <hr />
    <div class="circle-group">
      <UiComingSoon :tooltip-text="$t('coming_soon.communities')">
        <button disabled>
          <plus-icon size="1.8x" />
        </button>
      </UiComingSoon>
      <button
        v-tooltip.right="$t('pages.settings.settings')"
        data-cy="go-to-settings"
        @click="$store.commit('ui/setSettingsRoute')"
      >
        <settings-icon size="1.8x" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SettingsIcon, PlusIcon, SatelliteIcon } from 'satellite-lucide-icons'

type UiServer = {
  name: string
  address: string
}

const servers: UiServer[] = [
  {
    name: 'Solana Fans',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    name: 'Satellite.im',
    address: '0x00000000219ab540356cbb839cbe05303d7705fa',
  },
  {
    name: 'Gaming',
    address: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
  },
  {
    name: 'Blockchain Devs',
    address: '0x73bceb1cd57c711feac4224d062b0f6ff338501e',
  },
]
</script>

<style scoped lang="less" src="./Slimbar.less"></style>
