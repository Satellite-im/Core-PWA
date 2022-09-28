import Vue from 'vue'

import { filesize } from '~/utilities/Filesize'

declare module 'vue/types/vue' {
  interface Vue {
    $filesize: typeof filesize
  }
}

declare module '@nuxt/types' {
  interface Context {
    $filesize: typeof filesize
  }
}

Vue.prototype.$filesize = filesize
