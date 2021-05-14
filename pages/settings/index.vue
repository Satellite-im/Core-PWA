<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Settings',
  layout: 'settings',
  beforeCreate() {
    this.$router.push('/settings/personalize')
  },
})
</script>
