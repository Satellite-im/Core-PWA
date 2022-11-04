<template>
  <typography> {{ username }}</typography>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'InviteFriend',
  data() {
    return {
      username: this.$route.query.did,
    }
  },
})
</script>
