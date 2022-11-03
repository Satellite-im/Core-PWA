import Vue from 'vue'
import { Glyphs } from '~~/libraries/glyphs'
import {
  marketCategories,
  marketFilters,
  marketGlyphs,
  marketGlyphShopFilter,
  marketProducts,
} from '~/mock/marketplace'
import { RecentTransactions, LinkedAccounts, Details } from '~/mock/wallet'

const mock = {
  wallet: {
    RecentTransactions,
    LinkedAccounts,
    Details,
  },
  marketplace: {
    marketCategories,
    marketFilters,
    marketProducts,
    marketGlyphs,
    marketGlyphShopFilter,
  },
  glyphs: Glyphs,
}

declare module 'vue/types/vue' {
  interface Vue {
    $mock: typeof mock
  }
}

declare module '@nuxt/types' {
  interface Context {
    $mock: typeof mock
  }
}

Vue.prototype.$mock = mock
