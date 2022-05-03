<template>
  <div
    id="app-wrap"
    :class="`${$store.state.ui.theme.base.class}
    ${showSidebar ? 'is-open' : 'is-collapsed chat-page'} ${
      asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
    } ${selectedGroup ? 'active-group' : null}`"
  >
    <div
      id="app"
      :class="`${showSidebar ? 'is-open' : 'is-collapsed'} ${
        asidebar && selectedGroup ? 'is-open-aside' : 'is-collapsed-aside'
      } ${selectedGroup ? 'group' : 'direct'} ${
        $device.isMobile ? 'mobile-app' : 'desktop'
      }`"
    >
      <UiGlobal />

      <swiper
        ref="swiper"
        class="swiper"
        :options="{ ...swiperOption, initialSlide: swiperSlideIndex }"
      >
        <nuxt v-if="!$slots.default" />
        <slot />
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flairColor }}; --flair-color-rgb:
      {{ flairColorRGB }} }
    </v-style>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import useMeta from '~/components/compositions/useMeta'
import { hexToRGB } from '~/utilities/Colors'
import { AccountsError } from '~/store/accounts/types'

export default Vue.extend({
  name: 'DefaultLayout',
  setup() {
    useMeta()
  },
  data() {
    return {
      sidebar: !this.$device.isMobile,
      asidebar: !this.$device.isMobile,
      swiperOption: {
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              const activeIndex = this.$refs.swiper.$swiper.activeIndex
              this.$store.commit('ui/setSwiperSlideIndex', activeIndex)

              const newShowSidebar = activeIndex === 0

              // force virtual keyboard hide on mobile when swiper slide change
              if (newShowSidebar) {
                document.activeElement.blur()
              }

              if (this.showSidebar !== newShowSidebar) {
                this.$store.commit('ui/showSidebar', newShowSidebar)
              }
              this.$data.asidebar = this.$refs.swiper.$swiper.activeIndex === 2
            }
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters('ui', ['showSidebar', 'swiperSlideIndex']),
    ...mapGetters('accounts', ['getEncryptedPhrase', 'getActiveAccount']),
    ...mapGetters(['allPrerequisitesReady']),
    flairColor() {
      return this.$store.state.ui.theme.flair.value
    },
    flairColorRGB() {
      return hexToRGB(this.$store.state.ui.theme.flair.value)
    },
    selectedGroup() {
      return this.$route.params.id // TODO: change with groupid - AP-400
    },
  },
  watch: {
    allPrerequisitesReady(val) {
      if (!val) {
        return
      }
      this.$store.dispatch('friends/initialize', {}, { root: true })
      this.$store.dispatch('groups/initialize', {}, { root: true })
    },
    showSidebar(newValue, oldValue) {
      if (newValue !== oldValue) {
        newValue
          ? this.$refs.swiper.$swiper.slidePrev()
          : this.$refs.swiper.$swiper.slideNext()
      }
    },
    swiperSlideIndex(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$refs.swiper.$swiper.slideTo(newValue)
      }
    },
  },
  mounted() {
    // Handle the case that the wallet is not found

    if (this.getEncryptedPhrase === '') {
      this.$router.replace('/setup/disclaimer')
      return
    }

    this.loadAccount()

    this.$store.dispatch('ui/activateKeybinds')
  },
  methods: {
    /**
     * @method loadAccount
     * @description Load user account by dispatching the loadAccount action in store/accounts/actions.ts,
     * if successful route user to home page at /allcomponents,
     * if an error is thrown route user to authentication at /auth/register
     * @example mounted() { this.loadAccount() }
     */
    async loadAccount() {
      try {
        await this.$store.dispatch('accounts/loadAccount')
      } catch (error: any) {
        if (error.message === AccountsError.USER_NOT_REGISTERED) {
          this.$router.replace('/auth/register')
        }
        if (error.message === AccountsError.USER_DERIVATION_FAILED) {
          this.$router.replace('/setup/disclaimer')
        }
      }
    },
  },
})
</script>
<style lang="less">
@import 'bulma/css/bulma.css';

@font-face {
  font-family: 'SpaceMono';
  font-style: normal;
  font-weight: 400;
  src: url('~assets/fonts/SpaceMono-Regular.ttf');
}
@font-face {
  font-family: 'SpaceMono';
  font-style: normal;
  font-weight: 700;
  src: url('~assets/fonts/SpaceMono-Bold.ttf');
}
@font-face {
  font-family: @secondary-font;
  font-style: normal;
  font-weight: 400;
  src: url('~assets/fonts/Poppins-Regular.ttf');
}
@font-face {
  font-family: @secondary-font;
  font-style: normal;
  font-weight: 700;
  src: url('~assets/fonts/Poppins-Bold.ttf');
}
p {
  font-family: @secondary-font;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: @full;
  -webkit-text-size-adjust: @full;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

@import url('~/assets/styles/base.less');
@import url('~/assets/styles/thirdparty/multiselect.less');
@import url('~/assets/styles/thirdparty/v-calendar.less');
@import url('./Layout.less');
</style>
