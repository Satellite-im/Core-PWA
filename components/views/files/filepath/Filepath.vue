<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { HomeIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    HomeIcon,
  },
  computed: {
    ...mapState({
      path: (state) => (state as RootState).files.path,
    }),
  },
  methods: {
    /**
     * @method goBackToDirectory
     * @description Navigate to specific directory in file system
     * @param string directory name
     */
    setPath(path: string[]) {
      this.$store.commit('files/setPath', path)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
