import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueMeta from 'vue-meta'

// page or layout to test
import pageOrLayoutToTest from '../../layouts/chat.vue'

// create vue with vue-meta
const localVue = createLocalVue()
localVue.use(VueMeta, { keyName: 'head' })

import * as module from './useMeta'

describe('pageOrLayoutToTest.vue', () => {
  let wrapper

  // test set up
  beforeEach(() => {
    wrapper = shallowMount(pageOrLayoutToTest, {
      localVue,
    })
  })

  // test tear down
  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
  })

  test('', () => {
    module.default()
  })
})
