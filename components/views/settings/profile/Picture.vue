<template>
  <div>
    <div class="profile-image" :style="`background-image: url(${image})`" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    image: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
})
</script>

<style scopped lang="less">
.profile-image {
  &:extend(.full-width);
  height: 330px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-top-left-radius: @corner-rounding;
  border-top-right-radius: @corner-rounding;
}
</style>
