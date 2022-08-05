<template>
  <div ref="swiper" class="friends">
    <div class="swiper-wrapper">
      <div class="swiper-slide" :class="{ 'disable-swipe': !Boolean(route) }">
        <div class="top">
          <div>Friends</div>
          <div class="button-container">
            <button @click="next('add')">
              <user-plus-icon />
            </button>
            <button @click="next('request')">
              <user-check-icon />
            </button>
            <button>
              <more-vertical-icon />
            </button>
          </div>
        </div>
        <FriendsMobileList :list="friendsList" />
      </div>
      <div class="swiper-slide">
        <div class="top">
          <button @click="previous">
            <arrow-left-icon class="arrow" />
          </button>
          <!-- todo improve typography with new component -->
          <div>{{ $t(`friends.${route}`) }}</div>
        </div>
        <template v-if="route === 'request'">
          <div>incoming</div>
          <FriendsMobileRequestList :list="incomingRequests" type="incoming" />
          <div>outgoing</div>
          <FriendsMobileRequestList :list="outgoingRequests" type="outgoing" />
        </template>
        <template v-else-if="route === 'add'">
          <div>{{ $t('friends.add_description') }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ArrowLeftIcon,
  MoreVerticalIcon,
  UserPlusIcon,
  UserCheckIcon,
} from 'satellite-lucide-icons'
import { Swiper, SwiperOptions } from 'swiper'
import 'swiper/css'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  name: 'MobileFriends',
  components: {
    ArrowLeftIcon,
    MoreVerticalIcon,
    UserPlusIcon,
    UserCheckIcon,
  },
  layout: 'mobile',
  data: () => ({
    swiper: undefined as Swiper | undefined,
    route: '' as '' | 'request' | 'add',
    friends: iridium.friends.state,
  }),
  computed: {
    swiperConfig(): SwiperOptions {
      return {
        noSwipingClass: 'disable-swipe',
        allowSlidePrev: false,
        on: {
          activeIndexChange: ({ activeIndex }) => {
            if (!this.swiper) {
              return
            }
            if (activeIndex === 0) {
              this.swiper.allowSlidePrev = false
              this.swiper.allowSlideNext = true
              this.route = ''
            }
            if (activeIndex === 1) {
              this.swiper.allowSlidePrev = true
              this.swiper.allowSlideNext = false
            }
          },
        },
      }
    },
    friendsList(): Friend[] {
      return Object.values(this.friends.details).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      )
    },
    incomingRequests(): FriendRequest[] {
      return Object.values(this.friends.requests)
        .filter((r: FriendRequest) => r.incoming && r.status !== 'accepted')
        .sort((a, b) =>
          a.user.name.localeCompare(b.user.name, undefined, {
            sensitivity: 'base',
          }),
        )
    },
    outgoingRequests(): FriendRequest[] {
      return Object.values(this.friends.requests)
        .filter((r: FriendRequest) => !r.incoming && r.status === 'pending')
        .sort((a, b) =>
          a.user.name.localeCompare(b.user.name, undefined, {
            sensitivity: 'base',
          }),
        )
    },
  },
  mounted() {
    this.swiper = new Swiper(
      this.$refs.swiper as HTMLElement,
      this.swiperConfig,
    )
  },
  methods: {
    next(route: 'request' | 'add') {
      this.route = route
      this.swiper?.slideNext()
    },
    previous() {
      this.route = ''
      this.swiper?.slidePrev()
    },
  },
})
</script>

<style lang="less" scoped>
.friends {
  display: flex;
  flex: 1;
  overflow: hidden;

  .swiper-slide {
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
      .button-container {
        display: flex;
        margin-left: auto;
        gap: 2rem;
      }
      .arrow {
        color: @flair-color;
      }
    }
  }
}
</style>
