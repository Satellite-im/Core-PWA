<template>
  <div class="glyphs" data-cy="glyphs-picker">
    <div class="search-glyph-box">
      <InteractablesInput
        v-model="search"
        :placeholder="$t('ui.search')"
        size="xs"
        type="search"
      />
    </div>
    <div class="glyph-content">
      <EnhancersGlyphsPack
        v-for="pack in filteredGlyphs"
        :key="pack.id"
        :pack="pack"
      />
    </div>
    <EnhancersGlyphsItemInfo />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import fuzzysort from 'fuzzysort'
import { Glyphs, Pack } from '~/libraries/glyphs'

const search = ref<string>('')

const filteredGlyphs = computed<Pack[]>(() => {
  const glyphsArray = Object.values(Glyphs)
  if (!search.value) {
    return glyphsArray
  }
  return fuzzysort
    .go(search.value, glyphsArray, {
      keys: ['name'],
    })
    .map((result) => result.obj)
})
</script>
<style lang="less" src="./Glyphs.less"></style>
