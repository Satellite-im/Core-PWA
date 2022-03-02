import Vue from 'vue'

import { filesize } from '~/utilities/Filesize'

declare module '@nuxt/types' {
  interface Context {
    $filesize: typeof Function
  }
}

Vue.prototype.$filesize = filesize
