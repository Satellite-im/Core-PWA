import Vue from 'vue'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import * as Logger from '~/utilities/Logger'
import { Config } from '~/config'
import * as actions from '~/store/webrtc/actions'

Vue.prototype.$Config = Config

const DefaultLogger = Logger.default
Vue.prototype.$Logger = new DefaultLogger(Vue.prototype.$Config.debug)
Vue.prototype.$WebRTC = new WebRTC()

describe.skip('actions.default.initialize', () => {
  test('0', async () => {
    const commit = jest.fn()
    const originator = 'string'
    const LoggerPrototype = Vue.prototype.$Logger
    LoggerPrototype.log = jest.fn()
    const WebRTCPrototype = Vue.prototype.$WebRTC
    WebRTCPrototype.init = jest.fn()

    await actions.default.initialize({ commit }, originator)

    expect(commit).toHaveBeenCalledWith('setActiveCall', '')
    expect(WebRTCPrototype.init).toHaveBeenCalled()
  })
})
describe('actions.default.hangUp', () => {
  test('0', async () => {
    const commit = jest.fn()

    await actions.default.hangUp({ commit })

    expect(commit).toHaveBeenCalledWith('setActiveCall', '')
  })
})
describe('actions.default.denyCall', () => {
  test('0', async () => {
    const commit = jest.fn()

    await actions.default.denyCall({ commit })

    expect(commit).toHaveBeenCalledWith('setIncomingCall', '')
  })
})
