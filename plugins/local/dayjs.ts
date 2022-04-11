/* eslint-disable import/no-named-as-default-member */
import Vue from 'vue'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

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
