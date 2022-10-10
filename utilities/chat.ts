import { ConversationMessage } from '~/libraries/Iridium/chat/types'

export function conversationMessageIsNotice(message: ConversationMessage) {
  switch (message.type) {
    case 'member_join':
    case 'member_leave':
      return true
    default:
      return false
  }
}

export function isVisible(
  ele: HTMLElement,
  container: HTMLElement,
  partial = false,
) {
  const cTop = container.scrollTop
  const cBottom = cTop + container.clientHeight

  const eTop = ele.offsetTop
  const eBottom = eTop + ele.clientHeight

  const scrolledBefore = eTop >= cTop
  const scrolledAfter = eBottom <= cBottom
  const isTotal = scrolledBefore && scrolledAfter
  const isPartial =
    partial &&
    ((eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom))

  return { isElVisible: isTotal || isPartial, scrolledAfter, scrolledBefore }
}
