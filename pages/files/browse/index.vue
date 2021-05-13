<template src="./Browse.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Files',
  layout: 'files',
  data() {
    return {
      root: 'root',
      path: [],
    }
  },
  methods: {
    /**
     * Allows you to get the current path file object
     */
    getPath(): any {
      if (this.$data.path.length === 0) {
        // @ts-ignore
        return this.$mock.files
      }
      // @ts-ignore
      let files = this.$mock.files
      for (let i = 0; i < this.$data.path.length; i++) {
        // @ts-ignore
        files = files.children.filter(
          (item: any) => item.name === this.$data.path[i]
        )[0]
      }
      return files
    },
    /**
     * Push a new child name to the path array
     */
    push(item: any) {
      if (item.children) {
        this.$data.path.push(item.name)
      }
    },
    /**
     * Pull n items from the file path array
     */
    pull(count: number = 1) {
      for (let i = 0; i < count; i++) {
        this.$data.path.pop()
      }
    },
    /**
     * Manually override the path array from a child component
     */
    setPath(pth: Array<String>) {
      this.$data.path = pth
    },
  },
})
</script>

<style scoped lang="less" src="./Browse.less"></style>
