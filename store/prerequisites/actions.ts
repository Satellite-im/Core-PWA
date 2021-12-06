import Vue from 'vue'
import { ActionsArguments } from '~/types/store/store'
import { PrerequisiteState } from './types'

export default {
  /**
   * @method startup DocsTODO
   * @description
   * @param
   * @example
   */
  async startup({ dispatch }: ActionsArguments<PrerequisiteState>) {
    Vue.prototype.$Logger.log('WebRTC', 'Identified')
    // // Load Account
    // dispatch('accouns/loadAccount')
  },
}
