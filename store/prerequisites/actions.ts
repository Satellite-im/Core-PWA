import Vue from 'vue'
import { PrerequisiteState } from './types'
import { ActionsArguments } from '~/types/store/store'

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
