import { WorkerActionPayload } from './types'

export async function dispatch(type: string, payload: WorkerActionPayload) {
  postMessage({ type, payload })
}

export async function commit(mutation: string, payload: WorkerActionPayload) {
  postMessage({ type: 'commit', mutation, payload })
}
