<template>
  <div id="friends-add" v-scroll-lock="true" class="hidden-scroll">
    <UiScroll vertical-scroll enable-wrap scrollbar-visibility="scroll">
      <!--<FriendsNav :setRoute="setRoute" :route="route" />-->
      <div class="columns">
        <div class="column top-bar">
          <arrow-left-icon
            size="1.2x"
            class="icon-button toggle-sidebar"
            full-width
            @click="goBack"
          />
          <TypographyTitle :text="$t('friends.add')" :size="5" />
        </div>
        <div class="column is-half-desktop">
          <FriendsAdd />
        </div>
      </div>
    </UiScroll>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { ArrowLeftIcon } from 'satellite-lucide-icons'
import { DataStateType } from '~/store/dataState/types'

type Route = 'active' | 'requests' | 'blocked' | 'add'
declare module 'vue/types/vue' {
  interface Vue {
    friends: any
    initRoute: () => void
  }
}
export default Vue.extend({
  name: 'FriendsList',
  components: {
    ArrowLeftIcon,
  },
  data() {
    return {
      route: 'active',
      featureReadyToShow: false,
    }
  },
  computed: {
    DataStateType: () => DataStateType,
    ...mapState(['friends', 'dataState']),
    ...mapGetters('friends', ['alphaSortedFriends', 'alphaSortedOutgoing']),
  },
  watch: {
    '$route.query'() {
      this.initRoute()
    },
  },
  mounted() {
    this.initRoute()
  },
  methods: {
    /**
     * @method setRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    setRoute(route: Route) {
      this.$router.replace({ path: this.$route.path, query: { tab: route } })
    },
    /**
     * @method initRoute DocsTODO
     * @description
     * @param
     * @example
     */
    initRoute() {
      const query = this.$route.query
      if (query && query.tab) {
        this.$data.route = query.tab
        return
      }
      this.$data.route = 'active'
    },
    /**
     * @method goBack
     * @description go back to last route
     */
    goBack() {
      this.$router.back()
    },
  },
})
</script>

<style scoped lang="less">
.alpha-divider {
  &:extend(.full-width);
  display: inline-block;
  padding-left: @normal-spacing;
  font-size: @mini-text-size;
  font-family: @primary-font;
}

.scrolling {
  height: @full;
  min-height: @full;
}
.loading-container {
  text-align: center;
}

.padded_divider {
  padding: @light-spacing @normal-spacing;
}

#friends-add {
  margin-top: @normal-spacing;
  .top-bar {
    flex-flow: row;
    display: flex;
    padding: @large-spacing;
    .toggle-sidebar {
      position: relative;
      display: flex;
      margin-right: @light-spacing;
    }

    .icon-button {
      margin-right: @large-spacing;
    }
  }
}
</style>
