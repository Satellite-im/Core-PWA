import dayjs from 'dayjs'
import {
    MeasurementUnitsEnum, MessagingTypesEnum, PropCommonEnum
} from '~/libraries/Enums/enums'
import { Group, MessageGroup, UIReaction, UIReply } from '~/types/messaging'
import { RootState } from '~/types/store/store'
import {
    FileMessage, GlyphMessage, Message, MessagesTracker, ReactionMessage, ReactionsTracker,
    RepliesTracker, ReplyMessage,
    TextMessage
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
  if (reactions)
    reactions.forEach((reactionMessage) => {
      let reactors = groupedReactions[reactionMessage.payload]?.reactors || []
      if (!reactors.includes(reactionMessage.from))
        reactors = [...reactors, reactionMessage.from]
      groupedReactions[reactionMessage.payload] = {
        emoji: reactionMessage.payload,
        reactors,
        showReactors: true,
      }
    })

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
  const groupedMessages: MessageGroup = []

  // Get the sorted array of messages (not replies or reactions)
  const messageArray = Object.values(messages).sort((a, b) => a.at - b.at)

  for (let i = 0; i < messageArray.length; i++) {
    const prevMessage = i > 0 ? messageArray[i - 1] : null
    const currentMessage = messageArray[i]

    // TODO: Update the typings and embed this data in grouped messages - AP-403
    const currentMessageReplies = replies[currentMessage.id] || []
    const currentMessageReactions = reactions[currentMessage.id] || []
    const isSameDay = prevMessage
      ? dayjs(currentMessage.at).isSame(
          prevMessage.at,
          MeasurementUnitsEnum.DAY,
        )
      : false

    let isSameGroup
    if (!prevMessage) {
      isSameGroup = false
    } else {
      const currentAt = dayjs(currentMessage.at)
      const prevAt = dayjs(prevMessage.at)
      if (!dayjs().isSame(currentAt, MeasurementUnitsEnum.DAY)) {
        isSameGroup = currentAt.isSame(prevAt, MeasurementUnitsEnum.DAY)
      } else {
        const prevAt = dayjs(prevMessage.at)
        isSameGroup = currentAt.diff(prevAt, MeasurementUnitsEnum.MINUTES) < 15
      }
    }

    // Eventually place a divider if the day changes
    if (!isSameDay) {
      groupedMessages.push({
        id: `${currentMessage.id}-divider`,
        at: currentMessage.at,
        type: MessagingTypesEnum.DIVIDER,
      })
    }
    const isSameSender = currentMessage.from === prevMessage?.from

    // Extract the last item from the array that can be either a Group or a Divider
    // at this point
    const groupOrDivider = groupedMessages[groupedMessages.length - 1]

    // Checks if the message must be included in a new group
    const isNewGroup =
      groupedMessages.length === 0 ||
      groupOrDivider?.type === MessagingTypesEnum.DIVIDER ||
      !isSameSender ||
      (prevMessage && !isSameGroup)
    if (isNewGroup) {
      groupedMessages.push({
        id: currentMessage.id,
        type: MessagingTypesEnum.GROUP,
        at: currentMessage.at,
        from: currentMessage.from,
        to: currentMessage.to,
        messages: [
          {
            ...currentMessage,
            replies: messageRepliesToUIReplies(
              currentMessageReplies,
              reactions,
            ),
            reactions: getMessageUIReactions(
              currentMessage,
              currentMessageReactions,
            ),
          },
        ],
      })
    } else {
      // Since we already checked that it's not a divider we can
      // enforce the group type (not really needed since is handled under the hood
      // by typescript. We reassign it in a new variable only for readability reasons)
      const group: Group = groupOrDivider

      const newMessages = group.messages
        ? [
            ...group.messages,
            {
              ...currentMessage,
              replies: messageRepliesToUIReplies(
                currentMessageReplies,
                reactions,
              ),
              reactions: getMessageUIReactions(
                currentMessage,
                currentMessageReactions,
              ),
            },
          ]
        : [{ ...currentMessage, replies: [], reactions: [] }]

      groupedMessages[groupedMessages.length - 1] = {
        ...group,
        messages: newMessages,
      }
    }
  }

  return groupedMessages
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
        if (!repliesTracker[reply.repliedTo].some((elm) => elm.id === reply.id))
          repliesTracker[reply.repliedTo].push(reply)
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
        )
          reactionsTracker[reaction.reactedTo].push(reaction)
        break
      }
      case MessagingTypesEnum.FILE: {
        const fileMessage: FileMessage = currentMessage

        messagesTracker[fileMessage.id] = fileMessage
        break
      }
      case MessagingTypesEnum.TEXT: {
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

export function refreshTimestampInterval(
  timestamp: number,
  action: (timePassed: string) => any,
  interval: number,
) {
  return setInterval(() => {
    const updatedTimestamp = dayjs(timestamp).fromNow()

    action(updatedTimestamp)
  }, interval)
}

export const exportedForTesting = {
  messageRepliesToUIReplies,
  getMessageUIReactions,
  replyMessageToUIReply,
}
