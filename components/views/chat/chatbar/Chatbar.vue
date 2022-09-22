<template src="./Chatbar.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { throttle, debounce } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'
import { parseCommand, commands } from '~/libraries/ui/Commands'
import { KeybindingEnum, MessagingTypesEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ChatbarUploadRef } from '~/components/views/chat/chatbar/upload/Upload.vue'
import {
  Conversation,
  ConversationMessage,
  ConversationMessagePayload,
  MessageAttachment,
} from '~/libraries/Iridium/chat/types'
import notNull from '~/utilities/notNull'
import { EditableRef } from '~/components/interactables/Editable/Editable.vue'

function typingFunction(conversationId: string) {
  const deb = debounce(() => {
    iridium.webRTC.sendTyping(conversationId)
  }, Config.chat.typingInputDebounce)

  return {
    thr: throttle(deb, Config.chat.typingInputThrottle, { trailing: false }),
    deb,
  }
}

function isVisible(ele: HTMLElement, container: HTMLElement, partial = false) {
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

const Chatbar = Vue.extend({
  components: {
    TerminalIcon,
  },
  data() {
    return {
      typingFunction: null as {
        thr: ReturnType<typeof throttle>
        deb: ReturnType<typeof debounce>
      } | null,
    }
  },
  computed: {
    ...mapState({
      ui: (state: RootState) => state.ui,
      chat: (state: RootState) => state.chat,
      files(state: RootState) {
        return state.chat.files?.[this.$route.params.id] ?? []
      },
    }),
    consentToScan(): boolean {
      return iridium.settings.state.privacy.consentToScan
    },
    /**
     * @method charlimit DocsTODO
     * @description Checks if current text is longer than the max character limit
     * @returns Boolean based on if the current text length is longer than the max character limit
     * @example
     */
    charlimit(): boolean {
      return this.text.length > this.$Config.chat.maxChars
    },
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand(): boolean {
      const parsedCommand = parseCommand(this.ui.chatbarContent)
      const currentCommand = commands.find(
        (cmd) => cmd.name === parsedCommand.name.toLowerCase(),
      )
      // Hide commands for early access
      // return currentCommand != null
      return false
    },
    /**
     * @method hasCommandPreview DocsTODO
     * @description
     * @returns
     * @example
     */
    commandPreview(): boolean {
      // Hide commands for early access
      // return hasCommandPreview(this.ui.chatbarContent)
      return false
    },
    /**
     * @method isValidCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    isValidCommand(): boolean {
      const currentText = parseCommand(
        this.ui.chatbarContent,
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)
      // Hide commands for early access
      // return currentCommand && isArgsValid(currentCommand, currentArgs)
      return false
    },
    isSharpCorners(): boolean {
      return (
        Boolean(this.files.length) ||
        Boolean(this.chat.replyChatbarMessages[this.conversationId]) ||
        this.commandPreview ||
        this.chat.countError
      )
    },
    isSubscribed(): boolean {
      return iridium.chat.ready
    },
    text: {
      /**
       * @method get
       * @description Gets chatbars current text
       * @returns String of chatbars current text
       * @example const currText = this.get()
       */
      get(): string {
        return this.ui.chatbarContent
      },
      /**
       * @method set
       * @description Sets current chatbar text to new value
       * @param val Value to set the chatbar content to
       * @example set('This is the new chatbar content')
       */
      set(value: string) {
        this.$store.dispatch('ui/setChatbarContent', {
          content: value,
          // userId: this.recipient?.did,
        })
        this.$store.commit('chat/setDraftMessage', {
          conversationId: this.conversationId,
          message: value,
        })
      },
    },
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    placeholder(): string {
      return !this.hasCommand && this.text === ''
        ? (this.$t('ui.talk') as string)
        : ''
    },
    userLastTextMessage(): ConversationMessage | undefined {
      if (!this.conversationId) return

      return Object.values(
        iridium.chat.state.conversations[this.conversationId].message,
      )
        .filter((m) => m.from === iridium.id && m.type === 'text')
        .sort((a, b) => a.at - b.at)
        .at(-1)
    },
  },
  mounted() {
    const message = this.chat.draftMessages[this.conversationId] ?? ''
    this.$store.commit('chat/clearReplyChatbarMessage', {
      conversationId: this.conversationId,
    })
    this.$store.dispatch('ui/setChatbarContent', { content: message })
    if (this.$device.isDesktop) {
      this.$store.dispatch('ui/setChatbarFocus')
    }

    this.typingFunction = typingFunction(this.conversationId)
  },
  methods: {
    /**
     * @method smartTypingStart
     * @description Let's us send out events when a user starts typing without spam.
     */
    smartTypingStart() {
      this.typingFunction?.thr && this.typingFunction.thr()
    },
    /**
     * @method handleInputKeydown DocsTODO
     * @description Called from chatbar's keydown event to process all key events for typing in chatbar.
     * This interacts with handleInputChange in order to convert typed input to markdown expression.
     * This controls the caret position when Backspace, Spacebar is pressed.
     * @param event Keydown event object
     * @returns Boolean
     * @example
     */
    handleInputKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case KeybindingEnum.ENTER:
          if (!event.shiftKey) {
            event.preventDefault()
            if (!this.hasCommand) {
              return this.sendMessage()
            }
            if (this.hasCommand && !this.isValidCommand) {
              this.$Logger.log('Commands', 'dispatch command')
              return
            }
            return
          }
          // If there is a command disable shift + enter
          if (this.hasCommand) {
            event.preventDefault()
          }
          break
        default:
          break
      }
      this.smartTypingStart()
    },
    handleInputKeyup(event: KeyboardEvent) {
      switch (event.key) {
        case KeybindingEnum.ARROW_UP:
          if (!event.shiftKey) {
            this.editMessage()
          }
          break
        default:
          break
      }
    },
    async uploadAttachments(): Promise<MessageAttachment[]> {
      if (!this.files.length) {
        return []
      }
      const conversationId = this.$route.params.id
      this.$store.commit('chat/setActiveUploadChat', conversationId)
      const files = this.files.map((a) => {
        return { ...a }
      })
      this.$store.commit('chat/deleteFiles', conversationId)
      const attachments = await Promise.all(
        files.map(async (upload, index) => {
          return await iridium.chat.addFile(
            { upload, conversationId },
            // {
            //   progress: (bytes) => {
            //     this.$store.commit('chat/setFileProgress', {
            //       id: conversationId,
            //       index,
            //       progress: Math.floor((bytes / upload.file.size) * 100),
            //     })
            //   },
            // },
          )
        }),
      )
      this.$store.commit('chat/removeActiveUploadChat', conversationId)
      return attachments.filter(notNull)
    },
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related fields to their default (empty)
     * @example v-on:click="sendMessage"
     */
    async sendMessage() {
      if (this.text.length > this.$Config.chat.maxChars) {
        return
      }

      if (
        !this.files.length &&
        (!this.text.trim().length || !this.isSubscribed)
      ) {
        return
      }

      const value = this.text
      this.text = ''

      const conversationId = this.$route.params.id
      const attachments = await this.uploadAttachments()

      const payload: ConversationMessagePayload = {
        conversationId,
        type: 'text',
        body: value,
        at: Date.now(),
        attachments,
      }

      if (this.chat.replyChatbarMessages[conversationId]) {
        payload.replyToId = this.chat.replyChatbarMessages[conversationId].id

        this.$store.commit('chat/clearReplyChatbarMessage', { conversationId })
      }

      this.typingFunction?.thr?.cancel()
      this.typingFunction?.deb?.cancel()
      await iridium.chat?.sendMessage(payload)
    },
    /**
     * @method handlePaste
     * @description Allows the pasting of files into the chatbar
     * @param e Paste event data object
     * @example v-on:paste="handlePaste"
     */
    handlePaste(e: ClipboardEvent) {
      e.stopPropagation()
      if (!e.clipboardData?.items) {
        return
      }

      this.handleUpload([...e.clipboardData.items])
    },
    /**
     * @method handleUpload
     * @description if event has files attached
     * @param items Array of objects
     * @example this.handleUpload(someEvent.itsData.items)
     */
    handleUpload(items: DataTransferItem[]) {
      const files = items
        .filter((f) => {
          return f.kind !== MessagingTypesEnum.STRING
        })
        .map((f) => f.getAsFile())
        .filter(notNull)

      if (files.length && this.$refs.upload) {
        if (!this.consentToScan) {
          this.$store.dispatch('ui/displayConsentSettings')
          return
        }
        ;(this.$refs.upload as ChatbarUploadRef).handleFile({
          target: { files },
        })
      }
    },
    handleChatTextFromOutside(text: string) {
      if (!this.$refs.editable) {
        return
      }
      ;(this.$refs.editable as EditableRef).handleTextFromOutside(text)
    },
    editMessage() {
      if (!this.userLastTextMessage) return
      const { id, payload, from } = this.userLastTextMessage
      this.$store.commit('ui/setEditMessage', {
        id,
        payload,
        from,
      })

      this.$nextTick(() => {
        const el = document.querySelector(
          `[data-message-id="${id}"]`,
        ) as HTMLElement

        const container = document.getElementById('conversation-container')
        if (!el || !container) return
        const { isElVisible, scrolledAfter } = isVisible(el, container)

        if (!isElVisible) {
          el.scrollIntoView(scrolledAfter)
        }
      })
    },
  },
})
export type ChatbarRef = InstanceType<typeof Chatbar>
export default Chatbar
</script>
<style scoped lang="less" src="./Chatbar.less"></style>
