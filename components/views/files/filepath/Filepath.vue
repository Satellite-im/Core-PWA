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
     * @description Navigate to specific directory in file system
     * @param {string} id desired path id
     */
    setPath(id: string) {
      const newPath = []
      for (let i = 0; i < this.path.length; i++) {
        newPath.push(this.path[i])
        if (this.path[i].id === id) {
          break
        }
      }
      this.$store.commit('files/setPath', newPath)
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
