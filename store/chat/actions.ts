import { ChatState } from './types'
import { PropCommonEnum } from '~/libraries/Enums/enums'

import { ActionsArguments } from '~/types/store/store'
import { ChatTextObj } from '~/types/chat/chat'
import { UploadDropItemType } from '~/types/files/file'

export default {
  setChatText(
    { commit, dispatch }: ActionsArguments<ChatState>,
    req: ChatTextObj,
  ) {
    commit('chatText', req)
  },
  removeUploadItem(
    { commit, rootState, dispatch }: ActionsArguments<ChatState>,
    {
      itemIndex,
      files,
      recipientAddress,
    }: {
      itemIndex: number
      files: UploadDropItemType[]
      recipientAddress: string
    },
  ) {
    if (files.length === 1) {
      document.body.style.cursor = PropCommonEnum.DEFAULT
      commit('setCountError', false)
      commit('deleteFiles', recipientAddress)
      dispatch('textile/clearUploadStatus')
      if (rootState.textile.messageLoading)
        commit('textile/setMessageLoading', { loading: false })
    }

    commit('setFiles', {
      files: files.filter(
        (file: UploadDropItemType, i: number) => i !== itemIndex,
      ),
      address: recipientAddress,
    })
  },
}
