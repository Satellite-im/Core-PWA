import Vue from 'vue'
import actions from '~/store/prerequisites/actions'
import * as Logger from '~/utilities/Logger'
import { Config } from '~/config'

Vue.prototype.$Config = Config

const DefaultLogger = Logger.default
Vue.prototype.$Logger = new DefaultLogger(Vue.prototype.$Config.debug)

describe('actions.default.startup', () => {
  test('0', async () => {
    const LoggerPrototype = Vue.prototype.$Logger

    const dispatch = jest.fn()
    LoggerPrototype.log = jest.fn()

    await actions.startup({ dispatch })

    expect(LoggerPrototype.log).toHaveBeenCalled()
    expect(LoggerPrototype.log).toHaveBeenCalledWith('WebRTC', 'Identified')
  })
})
