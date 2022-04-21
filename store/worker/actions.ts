import SatelliteWorker from 'worker-loader!~/worker/worker.ts'
import { ActionsArguments } from '~/types/store/store'
import { WorkersState } from '~/store/accounts/types'
import { SolanaWallet } from '~/types/solana/solana'

const worker = new SatelliteWorker()

export type WorkersConfig = {
  id: string
  pass: string
  wallet: SolanaWallet
}

export default {
  async initialize(
    { commit, dispatch }: ActionsArguments<WorkersState>,
    config: WorkersConfig,
  ) {
    worker.postMessage({
      type: 'initialize',
      data: config,
    })

    worker.addEventListener('message', async (event: MessageEvent) => {
      const { type, ...rest } = event.data
      if (type === 'commit') {
        const { action, ...next } = rest
        await commit(action, next, { root: true })
        return
      }
      await dispatch(type, rest, { root: true })
    })

    commit('initialize', worker)
  },
  async postMessage(
    {}: ActionsArguments<WorkersState>,
    action: string,
    data: any,
  ) {
    worker.postMessage({
      type: action,
      ...data,
    })
  },
}
