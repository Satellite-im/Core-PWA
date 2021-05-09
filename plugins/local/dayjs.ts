import Vue from 'vue'

import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
// @ts-ignore
dayjs.extend(relativeTime)

declare module '@nuxt/types' {
  interface Context {
    $dayjs: typeof dayjs
  }
}

Vue.prototype.$dayjs = dayjs
