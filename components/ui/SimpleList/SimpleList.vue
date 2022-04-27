<template src="./SimpleList.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  ClockIcon,
  TrashIcon,
  HeartIcon,
  FolderIcon,
  LinkIcon,
} from 'satellite-lucide-icons'
import { FileIconsEnum, FileAsideRouteEnum } from '~/libraries/Enums/enums'
import { SimpleItem } from '~/types/ui/sidebar'

export default Vue.extend({
  components: {
    ClockIcon,
    TrashIcon,
    HeartIcon,
    FolderIcon,
    LinkIcon,
  },
  props: {
    items: {
      type: Array as PropType<SimpleItem[]>,
      required: true,
    },
  },
  computed: {
    icons() {
      return {
        [FileIconsEnum.CLOCK]: ClockIcon,
        [FileIconsEnum.TRASH]: TrashIcon,
        [FileIconsEnum.HEART]: HeartIcon,
        [FileIconsEnum.FOLDER]: FolderIcon,
        [FileIconsEnum.LINK]: LinkIcon,
      }
    },
  },
  methods: {
    setActive(route: FileAsideRouteEnum) {
      if (!route) {
        this.$router.push({ query: {} })
        return
      }
      this.$router.push({ query: { route } })
    },
    isActiveRoute(route: FileAsideRouteEnum) {
      if (!this.$route.query.route && route === FileAsideRouteEnum.DEFAULT) {
        return true
      }
      if (
        !Object.values(FileAsideRouteEnum).includes(this.$route.query.route) &&
        route === FileAsideRouteEnum.DEFAULT
      ) {
        return true
      }
      return route === this.$route.query.route
    },
  },
})
</script>

<style scoped lang="less" src="./SimpleList.less"></style>
