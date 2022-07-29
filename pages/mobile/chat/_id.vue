<template>
  <!-- Slider main container -->
  <div ref="swiper" class="chat">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
      <!-- Slides -->
      <div class="swiper-slide"><SidebarList /></div>
      <div class="swiper-slide">
        <Toolbar />
        <!-- <Media
          v-if="$device.isMobile"
          :users="$mock.callUsers"
          :max-viewable-users="10"
          :fullscreen-max-viewable-users="6"
        /> -->
        <Conversation />
        <Chatbar ref="chatbar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Swiper } from 'swiper'
import 'swiper/css'

export default Vue.extend({
  name: 'MobileChat',
  layout: 'mobile',
  mounted() {
    // eslint-disable-next-line no-new
    new Swiper(this.$refs.swiper)
  },
})
</script>

<style lang="less" scoped>
.chat {
  .swiper-slide {
    padding: @normal-spacing;
  }
}
</style>
