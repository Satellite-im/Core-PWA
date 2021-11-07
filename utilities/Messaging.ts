import dayjs from 'dayjs'
import { Group, MessageGroup, UIReaction, UIReply } from '~/types/messaging'
import {
  FileMessage,
  Message,
  ReactionMessage,
  ReplyMessage,
  TextMessage,
  MessagesTracker,
  ReactionsTracker,
  RepliesTracker,
} from '~/types/textile/mailbox'

function messageRepliesToUIReplies(
  replies: ReplyMessage[],
  reactions: ReactionMessage[]
) {
  return replies.map((reply) => replyMessageToUIReply(reply, reactions))
}

function getMessageUIReactions(message: Message, reactions: ReactionMessage[]) {
  let groupedReactions: { [key: string]: UIReaction } = {}
  reactions.forEach((reactionMessage) => {
    const reactors = groupedReactions[reactionMessage.payload]?.reactors || []
    groupedReactions[reactionMessage.payload] = {
      emoji: reactionMessage.payload,
      reactors: [...reactors, reactionMessage.from],
      showReactors: true,
    }
  })

  return Object.values(groupedReactions)
}

function replyMessageToUIReply(
  reply: ReplyMessage,
  reactions: ReactionMessage[]
): UIReply {
  return { ...reply, reactions: getMessageUIReactions(reply, reactions) }
}

export function groupMessages(
  messages: MessagesTracker,
  replies: RepliesTracker,
  reactions: ReactionsTracker
): MessageGroup {
  let groupedMessages: MessageGroup = []

  // Get the sorted array of messages (not replies or reactions)
  const messageArray = Object.values(messages).sort((a, b) => a.at - b.at)

  for (let i = 0; i < messageArray.length; i++) {
    const prevMessage = i > 0 ? messageArray[i - 1] : null
    const currentMessage = messageArray[i]

    // TODO: Update the typings and embed this data in grouped messages
    const currentMessageReplies = replies[currentMessage.id] || []
    const currentMessageReactions = reactions[currentMessage.id] || []

    const isSameDay = prevMessage
      ? dayjs(currentMessage.at).isSame(prevMessage.at, 'day')
      : false

    // Eventually place a divider if the day changes
    if (!isSameDay) {
      groupedMessages.push({
        id: `${currentMessage.id}-divider`,
        at: currentMessage.at,
        type: 'divider',
      })
    }
    const isSameSender = currentMessage.from === prevMessage?.from

    // Extract the last item from the array that can be either a Group or a Divider
    // at this point
    const groupOrDivider = groupedMessages[groupedMessages.length - 1]

    // Checks if the message must be included in a new group
    const isNewGroup =
      groupedMessages.length === 0 ||
      groupOrDivider?.type === 'divider' ||
      !isSameSender ||
      (prevMessage && !isSameDay)

    if (isNewGroup) {
      groupedMessages.push({
        id: currentMessage.id,
        type: 'group',
        at: currentMessage.at,
        from: currentMessage.from,
        to: currentMessage.to,
        messages: [
          {
            ...currentMessage,
            replies: messageRepliesToUIReplies(
              currentMessageReplies,
              currentMessageReactions
            ),
            reactions: getMessageUIReactions(
              currentMessage,
              currentMessageReactions
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
        ? [...group.messages, { ...currentMessage, replies: [], reactions: [] }]
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
  initialValues?: TrackingValues
): TrackingValues {
  let messagesTracker: MessagesTracker = initialValues?.messages || {}
  let repliesTracker: RepliesTracker = initialValues?.replies || {}
  let reactionsTracker: ReactionsTracker = initialValues?.reactions || {}

  for (let i = 0; i < inputMessages.length; i++) {
    const currentMessage = inputMessages[i]

    switch (currentMessage.type) {
      case 'reply':
        const reply: ReplyMessage = currentMessage
        repliesTracker[reply.repliedTo]
          ? repliesTracker[reply.repliedTo].push(reply)
          : (repliesTracker[currentMessage.repliedTo] = [reply])
        break
      case 'reaction':
        const reaction: ReactionMessage = currentMessage
        reactionsTracker[reaction.reactedTo]
          ? reactionsTracker[reaction.reactedTo].push(reaction)
          : (reactionsTracker[reaction.reactedTo] = [reaction])
        break
      case 'file':
        const fileMessage: FileMessage = currentMessage

        messagesTracker[fileMessage.id] = fileMessage
        break
      case 'text':
        const textMessage: TextMessage = currentMessage

        messagesTracker[textMessage.id] = textMessage
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
