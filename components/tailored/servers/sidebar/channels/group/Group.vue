<template src="./Group.html"></template>

<script>
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
} from 'satellite-lucide-icons'

export default {
  name: 'Group',
  components: {
    ChevronRightIcon,
    ChevronDownIcon,
    PlusIcon,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['group', 'channels', 'setActiveChannel'],
  data() {
    return {
      collapsed: false,
    }
  },
  methods: {
    /**
     * @method toggleCollapse DocsTODO
     * @description
     * @example
     */
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Group.less"></style>
