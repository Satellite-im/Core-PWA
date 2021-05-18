import Vue from 'vue'

import fileSize from 'filesize'

declare module '@nuxt/types' {
  interface Context {
    $filesize: typeof fileSize
  }
}

Vue.prototype.$filesize = fileSize
