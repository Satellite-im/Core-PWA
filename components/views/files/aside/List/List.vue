<template src="./List.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  ClockIcon,
  TrashIcon,
  HeartIcon,
  FolderIcon,
  LinkIcon,
} from 'satellite-lucide-icons'
import { FileIconsEnum, FileRouteEnum } from '~/libraries/Enums/enums'
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
  watch: {
    '$route.query.route': {
      handler(value) {
        this.$store.commit('files/setPath', [])
        // if invalid route, reset to default
        if (!Object.values(FileRouteEnum).includes(value)) {
          this.$router.push({ query: {} })
          this.$store.commit('files/setRoute', FileRouteEnum.DEFAULT)
        }
      },
    },
  },
  methods: {
    /**
     * @method setActive
     * @description set files page route (default, recent, deleted, etc...)
     * @param {FileRouteEnum} route clicked route string value
     */
    setActive(route: FileRouteEnum) {
      // if invalid route, reset to default
      if (!route) {
        this.$router.push({ query: {} })
        this.$store.commit('files/setRoute', FileRouteEnum.DEFAULT)
        return
      }
      this.$router.push({ query: { route } })
      this.$store.commit('files/setRoute', route)
    },
    /**
     * @method isActiveRoute
     * @description used to set active css class on list
     * @param {FileRouteEnum} route clicked route string value
     */
    isActiveRoute(route: FileRouteEnum) {
      // if default route
      if (!this.$route.query.route && !route) {
        return true
      }
      return route === this.$route.query.route
    },
  },
})
</script>

<style scoped lang="less" src="./List.less"></style>
