<template src="./Group.html"></template>

<script>
export default {
  name: 'Group',
  props: ['group', 'channels', 'setActiveChannel'],
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Group.less"></style>