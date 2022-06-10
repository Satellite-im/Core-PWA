<template src="./Chatbar.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { throttle } from 'lodash'
import { TerminalIcon } from 'satellite-lucide-icons'

import Upload from '../../files/upload/Upload.vue'
import FilePreview from '../../files/upload/filePreview/FilePreview.vue'

import { parseCommand, commands } from '~/libraries/ui/Commands'
import { Friend } from '~/types/ui/friends'
import {
  KeybindingEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { UploadDropItemType } from '~/types/files/file'
import { Group } from '~/types/messaging'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    TerminalIcon,
    Upload,
    FilePreview,
  },
  props: {
    recipient: {
      type: Object as PropType<Friend | Group>,
      default: () => {},
    },
  },
  data() {
    return {
      showEmojiPicker: false,
      nsfwUploadError: false,
      files: [] as Array<UploadDropItemType>,
    }
  },
  computed: {
    ...mapGetters('chat', ['getFiles']),
    ...mapGetters('friends', ['getActiveFriend']),
    ...mapState({
      ui: (state) => (state as RootState).ui,
      friends: (state) => (state as RootState).friends,
      webrtc: (state) => (state as RootState).webrtc,
      chat: (state) => (state as RootState).chat,
      textile: (state) => (state as RootState).textile,
      conversation: (state) => (state as RootState).conversation,
    }),
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
          userId: this.recipient?.address,
        })
      },
    },
    placeholder(): string {
      return !this.hasCommand && this.text === ''
        ? (this.$t('ui.talk') as string)
        : ''
    },
  },
  watch: {
    'recipient.address': {
      handler(value) {
        const findItem = this.chat.chatTexts.find(
          (item: any) => item.userId === value,
        )
        const message = findItem ? findItem.value : ''
        this.$refs.editable?.resetHistory()
        this.$store.commit('ui/setReplyChatbarContent', {
          id: '',
          payload: '',
          from: '',
        })
        this.$store.dispatch('ui/setChatbarContent', { content: message })
        // in desktop, stay chatbar focused when switching recipient
        if (this.$device.isDesktop) {
          this.$store.dispatch('ui/setChatbarFocus')
        }

        this.onRecipientChangeResetUploadState(value)
      },
    },
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === 'chat/addFile' ||
        mutation.type === 'chat/setFiles'
      ) {
        if (this.recipient) {
          this.files = this.getFiles(this.recipient?.address)
        }
      }

      if (mutation.type === 'chat/deleteFiles') {
        if (this.recipient) {
          this.files = []
        }
      }
    })
  },
  methods: {
    /**
     * @method typingNotifHandler
     * @description Wraps the event handler for dispatching typing notifications
     * TODO: Right now this is hard coded to the WebRTC Data method, in the future this should be
     * agnostic and the method should be passed to chatbar so we can support group, and direct messages.
     */
    typingNotifHandler(
      state: PropCommonEnum.TYPING | PropCommonEnum.NOT_TYPING,
    ) {
      // TODO use conversation participants
    },
    /**
     * @method throttleTyping
     * @description Throttles the typing event so that we only send the typing once every two seconds
     */
    throttleTyping: throttle(function (ctx) {
      ctx.typingNotifHandler(PropCommonEnum.TYPING)
    }, Config.chat.typingInputThrottle),
    /**
     * @method smartTypingStart
     * @description Let's us send out events when a user starts typing without spam.
     */
    smartTypingStart() {
      this.throttleTyping(this)
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
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related fields to their default (empty)
     * @example v-on:click="sendMessage"
     */
    async sendMessage() {
      if (!this.recipient) {
        return
      }
      // @ts-ignore
      await this.$refs['file-upload']?.sendMessage()
      // return if input is empty or over max length
      if (
        this.text.length > this.$Config.chat.maxChars ||
        !this.text.trim().length
      ) {
        return
      }
      const value = this.text
      this.text = ''
      if (
        this.ui.replyChatbarContent.from &&
        !RegExp(this.$Config.regex.uuidv4).test((this.recipient as Group)?.id)
      ) {
        this.$store.dispatch('textile/sendReplyMessage', {
          to: (this.recipient as Friend).textilePubkey,
          text: value,
          replyTo: this.ui.replyChatbarContent.messageID,
          replyType: MessagingTypesEnum.TEXT,
        })
        return
      }

      if (
        RegExp(this.$Config.regex.uuidv4).test(
          (this.recipient as Group)?.id?.split('|')[1],
        )
      ) {
        if (this.ui.replyChatbarContent.from) {
          this.$store.dispatch('textile/sendGroupReplyMessage', {
            to: (this.recipient as Group).id,
            text: value,
            replyTo: this.ui.replyChatbarContent.messageID,
            replyType: MessagingTypesEnum.TEXT,
          })
          this.text = ''
          return
        }
        this.$store.dispatch('textile/sendGroupMessage', {
          groupId: (this.recipient as Group).id,
          message: value,
        })
      } else {
        this.$store.dispatch('textile/sendTextMessage', {
          to: (this.recipient as Friend).textilePubkey,
          text: value,
        })
      }
      this.nsfwUploadError = false
    },
    /**
     * @method handlePaste
     * @description Allows the pasting of files into the chatbar
     * @param e Paste event data object
     * @example v-on:paste="handlePaste"
     */
    handlePaste(e: ClipboardEvent) {
      /* Don't use event.preventDefault(). It prevent original text copy-paste */
      e.stopPropagation()
      /* Upload if image, if not then no action */
      this.handleUpload(e?.clipboardData?.items, e)
    },
    /**
     * @method handleUpload
     * @description Takes in an array of event items and uploads the file objects
     * @param items Array of objects
     * @example this.handleUpload(someEvent.itsData.items)
     */
    handleUpload(items: Array<object>, e: Event) {
      const arrOfFiles: File[] = [...items]
        .filter((f: any) => {
          return f.kind !== MessagingTypesEnum.STRING
        })
        .map((f: any) => f.getAsFile())
      if (arrOfFiles.length) {
        e.preventDefault()
        const handleFileExpectEvent = { target: { files: [...arrOfFiles] } }
        // @ts-ignore
        this.$refs['file-upload']?.handleFile(handleFileExpectEvent)
      }
    },
    handleChatTextFromOutside(text: string) {
      this.$refs.editable?.handleTextFromOutside(text)
    },
    /**
     * @method cancelUpload
     * @description Cancels file upload by setting file and url in local data to false
     * TODO: Clear input field, this currently breaks when you upload the same file after cancelling //AP-401
     * @example @click="cancelUpload"
     */
    onCancelUpload() {
      document.body.style.cursor = PropCommonEnum.DEFAULT
      this.$store.commit('chat/setContainsNsfw', false)
      this.$store.commit('chat/setCountError', false)
    },
    onRecipientChangeResetUploadState(recipient: string) {
      this.files = this.getFiles(recipient)
      this.$store.commit('chat/setContainsNsfw', false)
      this.$store.commit('chat/setCountError', false)
      this.$store.commit('chat/setAlertNsfw', false)
    },
    beforeDestroy() {
      this.unsubscribe()
    },
  },
})
</script>
<style scoped lang="less" src="./Chatbar.less"></style>
