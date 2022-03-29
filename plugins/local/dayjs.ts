/* eslint-disable import/no-named-as-default-member */
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import Vue from 'vue'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs: typeof dayjs
  }
}

declare module '@nuxt/types' {
  interface Context {
    $dayjs: typeof dayjs
  }
}

Vue.prototype.$dayjs = dayjs
