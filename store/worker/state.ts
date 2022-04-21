export type WorkerState = {
  worker?: Worker
  initialized: boolean
}

const InitialWorkerState = (): WorkerState => ({
  initialized: false,
  worker: undefined,
})
export default InitialWorkerState
