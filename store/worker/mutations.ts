import type { WorkerState } from './state'

export default {
  async initialize(state: WorkerState, worker: Worker) {
    state.worker = worker
    state.initialized = true
  },
}
