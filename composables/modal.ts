import Vue, { reactive } from 'vue'
export enum ModalTypes {
  EMPTY,
  QUICK_CHAT,
}

type Modal<T = {}> = {
  type: ModalTypes
  data?: T
}

export const modal = reactive<Modal<object>>({ type: ModalTypes.EMPTY })

export function setModal({ type, data }: Modal) {
  modal.type = type
  if (data) {
    Vue.set(modal, 'data', data)
  }
}
