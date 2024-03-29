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
              <UiDotBadge :show="Boolean(incomingRequests.length)">
                <user-check-icon />
              </UiDotBadge>
            </button>
          </div>
        </div>
        <FriendsMobileList v-if="friendsList.length" :list="friendsList" />
        <div v-else class="empty-friends-container">
          <FriendsEmptyMessage class="empty-friends" @click="setSwiperAsTab" />
        </div>
      </div>
      <div class="swiper-slide">
        <div class="top">
          <button @click="previous">
            <arrow-left-icon class="arrow" />
          </button>
          <TypographyText v-if="route">
            {{ $t(`friends.${route}`) }}
          </TypographyText>
        </div>
        <div class="bottom">
          <template v-if="route === 'request'">
            <UiResultsMessage
              v-if="!incomingRequests.length && !outgoingRequests.length"
              :title="$t('friends.no_requests')"
              :subtitle="$t('friends.no_requests_subtitle')"
            />
            <div v-if="incomingRequests.length" class="list-wrapper">
              <TypographyText>{{ $t('friends.received') }}</TypographyText>
              <FriendsMobileRequestList
                :list="incomingRequests"
                type="incoming"
              />
            </div>
            <div v-if="outgoingRequests.length" class="list-wrapper">
              <TypographyText>{{ $t('friends.sent') }}</TypographyText>
              <FriendsMobileRequestList
                :list="outgoingRequests"
                type="outgoing"
              />
            </div>
          </template>
          <template v-else-if="route === 'add'">
            <div>{{ $t('friends.add_description') }}</div>
            <FriendsSearch />
            <!-- <FriendsQrSection /> -->
            <!-- Commented out because QR section doesn't work -->
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  ArrowLeftIcon,
  UserPlusIcon,
  UserCheckIcon,
} from 'satellite-lucide-icons'
import { Swiper, SwiperOptions } from 'swiper'
import 'swiper/css'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Friend, FriendRequest } from '~/libraries/Iridium/friends/types'
import { FriendsTabs } from '~/libraries/Enums/enums'
import { truthy } from '~/utilities/typeGuard'
import { DismissSoftwareKeyboard, swiperOptions } from '~/utilities/swiper'

export default Vue.extend({
  name: 'MobileFriends',
  components: {
    ArrowLeftIcon,
    UserPlusIcon,
    UserCheckIcon,
  },
  layout: 'mobile',
  data: () => ({
    swiper: undefined as Swiper | undefined,
    friends: iridium.friends.state,
    users: iridium.users,
  }),
  computed: {
    route(): FriendsTabs {
      return this.$route.query.route as FriendsTabs
    },
    swiperConfig(): SwiperOptions {
      return swiperOptions({
        allowSlidePrev: false,
        on: {
          activeIndexChange: ({ activeIndex }) => {
            if (!this.swiper) {
              return
            }
            if (activeIndex === 0) {
              this.swiper.allowSlidePrev = false
              this.swiper.allowSlideNext = true
              this.removeRoutes()
            }
            if (activeIndex === 1) {
              this.swiper.allowSlidePrev = true
              this.swiper.allowSlideNext = false
            }
          },
        },
      })
    },
    friendsList(): Friend[] {
      return this.friends.friends
        .map((did) => this.users.state[did])
        .filter(truthy)
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        )
    },
    requests(): FriendRequest[] {
      return Object.values(this.friends.requests).filter(truthy)
    },
    incomingRequests(): FriendRequest[] {
      return this.requests.filter(
        (r: FriendRequest) => r.incoming && r.status !== 'accepted',
      )
    },
    outgoingRequests(): FriendRequest[] {
      return this.requests.filter(
        (r: FriendRequest) => !r.incoming && r.status === 'pending',
      )
    },
  },
  watch: {
    route() {
      // Return to main tab if route is not valid
      if (!this.route && this.swiper?.activeIndex === 1) {
        this.swiper.slideTo(0)
      }
      // Go to route tab if route is valid
      if (this.route && this.swiper?.activeIndex === 0) {
        this.swiper.slideTo(1)
      }
    },
  },
  mounted() {
    this.swiper = new Swiper(
      this.$refs.swiper as HTMLElement,
      this.swiperConfig,
    )

    // Activate swiper on first load if user sent directly to a tab
    if (this.route) {
      this.setSwiperAsTab()
    }
  },
  methods: {
    toTab(tab: FriendsTabs) {
      this.next(tab)
    },
    next(route: FriendsTabs) {
      this.$router.push({
        query: {
          route,
        },
      })
    },
    previous() {
      this.removeRoutes()
    },
    removeRoutes() {
      this.$router.push({
        query: {},
      })
    },
    setSwiperAsTab() {
      this.swiper?.slideTo(1)
    },
  },
})
</script>

<style lang="less" scoped>
.friends {
  display: flex;
  flex: 1;
  min-height: 0;

  .swiper-slide {
    display: flex;
    flex-direction: column;

    .empty-friends-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 16px;

      .empty-friends {
        max-width: 320px;

        &-side {
          max-width: 240px;
        }
      }
    }

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

    .bottom {
      flex: 1;
      overflow-y: scroll;
      padding: 0 1rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 32px;

      .list-wrapper {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }
  }
}
</style>
