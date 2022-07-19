import dayjs from 'dayjs'
import {
  MeasurementUnitsEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { MessageGroup, UIReaction, UIReply } from '~/types/messaging'
import { RootState } from '~/types/store/store'
import {
  FileMessage,
  GlyphMessage,
  Message,
  MessagesTracker,
  ReactionMessage,
  ReactionsTracker,
  RepliesTracker,
  ReplyMessage,
  TextMessage,
} from '~/types/textile/mailbox'

function messageRepliesToUIReplies(
  replies: ReplyMessage[],
  reactions: ReactionsTracker,
) {
  return replies.map((reply) =>
    replyMessageToUIReply(reply, reactions[reply.id]),
  )
}

function getMessageUIReactions(message: Message, reactions: ReactionMessage[]) {
  const groupedReactions: { [key: string]: UIReaction } = {}
  if (reactions) {
    reactions.forEach((reactionMessage) => {
      let reactors = groupedReactions[reactionMessage.payload]?.reactors || []
      if (!reactors.includes(reactionMessage.from)) {
        reactors = [...reactors, reactionMessage.from]
      }
      groupedReactions[reactionMessage.payload] = {
        emoji: reactionMessage.payload,
        reactors,
        showReactors: true,
      }
    })
  }

  return Object.values(groupedReactions)
}

function replyMessageToUIReply(
  reply: ReplyMessage,
  reactions: ReactionMessage[],
): UIReply {
  return { ...reply, reactions: getMessageUIReactions(reply, reactions) }
}

export function groupMessages(
  messages: MessagesTracker,
  replies: RepliesTracker,
  reactions: ReactionsTracker,
): MessageGroup {
  const chatList: MessageGroup = []

  // Get the sorted array of messages (not replies or reactions)
  const messagesArray = Object.values(messages).sort((a, b) => a.at - b.at)

  for (let i = 0; i < messagesArray.length; i++) {
    const prevMessage = i > 0 ? messagesArray[i - 1] : null
    const currentMessage = messagesArray[i]

    // TODO: Update the typings and embed this data in grouped messages - AP-403
    const currentMessageReplies = replies[currentMessage.id] || []
    const currentMessageReactions = reactions[currentMessage.id] || []

    let isSameDay = false
    let isSameChatElement = false

    if (prevMessage) {
      const currentAt = dayjs(currentMessage.at)
      const prevAt = dayjs(prevMessage.at)
      const isToday = dayjs().isSame(currentAt, MeasurementUnitsEnum.DAY)

      isSameDay = currentAt.isSame(prevAt, MeasurementUnitsEnum.DAY)
      isSameChatElement = !isToday
        ? isSameDay
        : currentAt.diff(prevAt, MeasurementUnitsEnum.MINUTES) < 15
    }

    // Eventually place a divider if the day changes
    if (!isSameDay) {
      chatList.push({
        id: `${currentMessage.id}-divider`,
        at: currentMessage.at,
        type: MessagingTypesEnum.DIVIDER,
      })
    }
    const isSameSender = currentMessage.from === prevMessage?.from

    // Checks if the message must be included in a new group
    const isNewChatElement =
      !isSameDay || !isSameSender || (prevMessage && !isSameChatElement)

    chatList.push({
      avatar: isNewChatElement,
      id: currentMessage.id,
      type: MessagingTypesEnum.GROUP,
      at: currentMessage.at,
      from: currentMessage.from,
      sender: currentMessage.sender, // TODO add types - AP-1128
      to: currentMessage.to,
      message: {
        ...currentMessage,
        replies: messageRepliesToUIReplies(currentMessageReplies, reactions),
        reactions: getMessageUIReactions(
          currentMessage,
          currentMessageReactions,
        ),
      },
    })
  }

  return chatList
}

type TrackingValues = {
  messages: MessagesTracker
  replies: RepliesTracker
  reactions: ReactionsTracker
}

export function updateMessageTracker(
  inputMessages: Message[],
  initialValues?: TrackingValues,
): TrackingValues {
  const messagesTracker: MessagesTracker = initialValues?.messages || {}
  const repliesTracker: RepliesTracker = initialValues?.replies || {}
  const reactionsTracker: ReactionsTracker = initialValues?.reactions || {}

  for (let i = 0; i < inputMessages.length; i++) {
    const currentMessage = inputMessages[i]
    switch (currentMessage.type) {
      case MessagingTypesEnum.REPLY: {
        const reply: ReplyMessage = currentMessage
        repliesTracker[reply.repliedTo] = repliesTracker[reply.repliedTo] || []
        if (
          !repliesTracker[reply.repliedTo].some((elm) => elm.id === reply.id)
        ) {
          repliesTracker[reply.repliedTo].push(reply)
        }
        break
      }
      case MessagingTypesEnum.REACTION: {
        const reaction: ReactionMessage = currentMessage
        reactionsTracker[reaction.reactedTo] =
          reactionsTracker[reaction.reactedTo] || []
        if (
          !reactionsTracker[reaction.reactedTo].some(
            (elm) => elm.id === reaction.id,
          )
        ) {
          reactionsTracker[reaction.reactedTo].push(reaction)
        }
        break
      }
      case MessagingTypesEnum.FILE: {
        const fileMessage: FileMessage = currentMessage

        messagesTracker[fileMessage.id] = fileMessage
        break
      }
      case 'direct': {
        const textMessage: TextMessage = currentMessage

        messagesTracker[textMessage.id] = textMessage
        break
      }
      case MessagingTypesEnum.GLYPH: {
        const glyphMessage: GlyphMessage = currentMessage

        messagesTracker[glyphMessage.id] = glyphMessage
        break
      }
      default:
        break
    }
  }

  return {
    messages: messagesTracker,
    replies: repliesTracker,
    reactions: reactionsTracker,
  }
}

export function getUsernameFromState(
  textilePublicKey: string,
  state: RootState,
) {
  return (
    getFullUserInfoFromState(textilePublicKey, state)?.name ||
    PropCommonEnum.UNKNOWN
  )
}

export function getAddressFromState(
  textilePublicKey: string,
  state: RootState,
) {
  return (
    getFullUserInfoFromState(textilePublicKey, state)?.address ||
    PropCommonEnum.UNKNOWN
  )
}

export function getFullUserInfoFromState(
  textilePublicKey: string,
  state: RootState,
) {
  const accountDetails = state.accounts.details
  const isMe =
    accountDetails && accountDetails.textilePubkey === textilePublicKey

  const userInfo = isMe
    ? accountDetails
    : state.friends.all.find(
        (friend) => friend.textilePubkey === textilePublicKey,
      )

  return userInfo
}

export function convertTimestampToDate(
  chatTranslations: any,
  timestamp: number,
) {
  if (timestamp > 0) {
    const secondsDif = dayjs().diff(timestamp, 'second')

    if (secondsDif < 30) {
      return chatTranslations.now
    }

    const lastUpdate = dayjs(timestamp)
    const sameDay = dayjs().isSame(lastUpdate, 'day')

    if (sameDay) {
      return lastUpdate.format('LT')
    }

    const daysDif = dayjs().diff(lastUpdate, 'day')

    if (daysDif <= 1) {
      return chatTranslations.yesterday
    }

    if (daysDif > 1 && daysDif <= 2) {
      return `${daysDif} ${chatTranslations.days_short}`
    }

    return lastUpdate.format('L')
  }

  return ''
}

export function refreshTimestampInterval(
  timestamp: number,
  action: (timePassed: number) => any,
  interval: number,
) {
  return setInterval(() => {
    action(timestamp)
  }, interval)
}

export const exportedForTesting = {
  messageRepliesToUIReplies,
  getMessageUIReactions,
  replyMessageToUIReply,
}
