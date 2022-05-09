<template>
  <div id="app" :class="$store.state.ui.theme.base.class">
    <UiModal v-if="$store.state.ui.modals.errorNetwork.isOpen" nopad>
      <UiPopupsErrorNetwork />
    </UiModal>
    <Nuxt />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ $store.state.ui.theme.flair.value }}; }
    </v-style>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import useMeta from '~/components/compositions/useMeta'

export default Vue.extend({
  setup() {
    useMeta()
  },
})
</script>
<style lang="less">
@import 'bulma/css/bulma.css';

@font-face {
  font-family: 'SpaceMono';
  font-style: normal;
  font-weight: 400;
  src: url('~assets/fonts/SpaceMono-Regular.ttf');
}
@font-face {
  font-family: 'SpaceMono';
  font-style: normal;
  font-weight: 700;
  src: url('~assets/fonts/SpaceMono-Bold.ttf');
}
@font-face {
  font-family: @secondary-font;
  font-style: normal;
  font-weight: 400;
  src: url('~assets/fonts/Poppins-Regular.ttf');
}
@font-face {
  font-family: @secondary-font;
  font-style: normal;
  font-weight: 700;
  src: url('~assets/fonts/Poppins-Bold.ttf');
}
p {
  font-family: @secondary-font;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: @full;
  -webkit-text-size-adjust: @full;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

@import url('~/assets/styles/base.less');
@import url('~/assets/styles/thirdparty/multiselect.less');
@import url('~/assets/styles/thirdparty/v-calendar.less');
</style>
