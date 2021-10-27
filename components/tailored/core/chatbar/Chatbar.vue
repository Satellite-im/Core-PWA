<template src="./Chatbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  TerminalIcon,
  GridIcon,
  ArrowRightIcon,
  BanknoteIcon,
} from 'satellite-lucide-icons'

import FileUpload from '../fileupload/FileUpload.vue'
import {
  commandPrefix,
  containsCommand,
  parseCommand,
  commands,
  isArgsValid,
} from '~/libraries/ui/Commands'
import {
  htmlToMarkdown,
  markDownToHtml,
  getCaretPosition,
  setCaretPosition,
} from '~/libraries/ui/Chatbar'

declare module 'vue/types/vue' {
  interface Vue {
    autoGrow: Function
    sendMessage: Function
    handleInputChange: Function
    value: string
  }
}

export default Vue.extend({
  components: {
    FileUpload,
    TerminalIcon,
    BanknoteIcon,
    GridIcon,
    ArrowRightIcon,
  },
  data() {
    return {
      text: '',
      maxChars: 256,
      showEmojiPicker: false,
      // lastEdited: 0,
    }
  },
  computed: {
    ...mapState(['ui']),
    /**
     * Computes the amount of characters left
     */
    /**
     * @method charlimit DocsTODO
     * @description Checks if current text is longer than the max character limit
     * @returns Boolean based on if the current text length is longer than the max character limit
     * @example
     */
    charlimit() {
      return this.$data.text.length > this.$data.maxChars
    },
    /**
     * @method hasCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    hasCommand() {
      const parsedCommand = parseCommand(this.ui.chatbarContent)
      const currentCommand = commands.find(
        (cmd) => cmd.name === parsedCommand.name.toLowerCase()
      )
      return currentCommand != null
    },
    /**
     * @method isValidCommand DocsTODO
     * @description
     * @returns
     * @example
     */
    isValidCommand() {
      const currentText = parseCommand(
        this.ui.chatbarContent
      ).name.toLowerCase()
      const currentArgs = parseCommand(this.ui.chatbarContent).args
      const currentCommand = commands.find((c) => c.name === currentText)
      return currentCommand && isArgsValid(currentCommand, currentArgs)
    },
    value: {
      /**
       * @method get
       * @description Gets chatbars current text
       * @returns String of chatbars current text
       * @example const currText = this.get()
       */
      get() {
        return this.ui.chatbarContent
      },
      /**
       * @method set
       * @description Sets current chatbar text to new value
       * @param val Value to set the chatbar content to
       * @example set('This is the new chatbar content')
       */
      set(val: string) {
        this.$store.commit('ui/chatbarContent', val)
        this.$data.text = val
      },
    },
    placeholder() {
      if (!this.hasCommand && this.$data.text === '') {
        return this.$t('global.talk')
      } else {
        return ''
      }
    },
    // editStatus() {
    //   return Date.now() - this.$data.lastEdited <= 1000
    // },
  },
  methods: {
    /**
     * @method toggleEnhancers
     * @description Toggles enhancers by commiting the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers() {
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
      })
    },
    /**
     * @method autoGrow DocsTODO
     * @description When textarea for chat is changed, autoGrow handles chat section to grow and allow multi-line display
     * @example
     * When Shift+Enter is pressed, this controls chatbar's height so that user can input multiple lines.
     * This is called after the typed inputed are processed in order to display markdown expression.
     */
    autoGrow() {
      // made const variables from this.$refs --> HTMLElement through typecasting
      const messageBox = this.$refs.messageuser as HTMLElement
      const chatbarGroup = this.$refs.chatbar as HTMLElement
      const wrap = this.$refs.wrap as HTMLElement

      if (this.$data.text.split('\n').length > 1) {
        wrap.classList.add('expanded')
      } else {
        wrap.classList.remove('expanded')
      }
      if (messageBox.scrollHeight < 112) {
        chatbarGroup.style.height = `${messageBox.scrollHeight + 42}px`
      } else {
        chatbarGroup.style.height = '152px'
      }
    },
    /**
     * @method handleInputChange DocsTODO
     * @description Called from handleInputKeydown function when normal key events are fired for typing in chatbar.
     * Decodes current HTML content of chatbar to plain text and Encodes plain text to Markdown HTML expression.
     * Once replaced current HTML content, move the caret to proper position.
     * @example
     */
    handleInputChange() {
      const messageBox = this.$refs.messageuser as HTMLElement
      if (messageBox.textContent) {
        const markDown = htmlToMarkdown(messageBox.innerHTML)
        this.value = markDown
        let caretPosition = getCaretPosition(messageBox)
        let offset = messageBox.textContent.trim().length
        let html = markDownToHtml(markDown)

        const parsedCommand = parseCommand(this.value)
        const currentCommand = commands.find(
          (c) => c.name === parsedCommand.name.toLowerCase()
        )
        if (
          currentCommand &&
          currentCommand.args.length > 0 &&
          parsedCommand.args.length > 0 &&
          currentCommand.args[0].name === parsedCommand.args[0]
        ) {
          html = html.replace(
            parsedCommand.args[0] as string,
            "<span class='chatbar-tag'>" + parsedCommand.args[0] + '</span>'
          )
        }

        messageBox.innerHTML = html
        if (offset >= messageBox.textContent.trim().length + 2) {
          offset -= messageBox.textContent.trim().length
          caretPosition -= offset
          if (messageBox.innerHTML.includes('blockquote')) {
            caretPosition += 1
          }
        } else if (
          offset < messageBox.textContent.trim().length &&
          caretPosition === offset
        ) {
          offset = messageBox.textContent.trim().length - offset
          caretPosition += offset
        }
        setCaretPosition(messageBox, caretPosition)
        messageBox.focus()
      }
      this.autoGrow()
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
      const messageBox = this.$refs.messageuser as HTMLElement
      switch (event.key) {
        case 'Backspace':
          this.$nextTick(() => {
            if (messageBox.textContent) {
              const parsedCommand = parseCommand(messageBox.textContent)
              const currentCommand = commands.find(
                (c) => c.name === parsedCommand.name.toLowerCase()
              )
              if (
                currentCommand &&
                currentCommand.args.length > 0 &&
                parsedCommand.args.length === 1 &&
                currentCommand.args[0].name === parsedCommand.args[0]
              ) {
                const text = commandPrefix + currentCommand.name
                messageBox.innerHTML = text
                setCaretPosition(messageBox, text.length)
              }
              this.value = htmlToMarkdown(messageBox.innerHTML)
              this.autoGrow()
            }
          })
          return
        case 'Delete':
          this.autoGrow()
          return
        case 'Enter':
          if (!event.shiftKey) {
            event.preventDefault()
            if (this.value !== '' && !this.hasCommand) {
              this.sendMessage()
            } else if (this.hasCommand && !this.isValidCommand) {
              console.log('dispatch command')
            }
          } else if (!this.hasCommand) {
            this.autoGrow()
          } else {
            event.preventDefault()
          }
          return
        case 'Spacebar':
        case ' ':
          {
            event.preventDefault()
            const parsedCommand = parseCommand(this.value)
            const currentCommand = commands.find(
              (c) => c.name === parsedCommand.name.toLowerCase()
            )
            if (
              currentCommand &&
              parsedCommand.args.length === 0 &&
              currentCommand.args.length > 0 &&
              messageBox.textContent
            ) {
              const tag = currentCommand.args[0]
              messageBox.innerHTML =
                '<p>' +
                messageBox.textContent.trim() +
                "<span>&nbsp;</span><span class='chatbar-tag'>" +
                tag.name +
                '</span><span>&nbsp;</span></p>'
              this.value = commandPrefix + currentCommand.name + ' ' + tag.name
              const caretPosition = messageBox.textContent.length
              setCaretPosition(messageBox, caretPosition)
            } else {
              const caretPosition = getCaretPosition(messageBox)
              this.$nextTick(() => {
                setCaretPosition(messageBox, caretPosition + 1)
                messageBox.focus()
              })
            }
          }
          return
        case 'Left':
        case 'ArrowLeft':
        case 'Right':
        case 'ArrowRight':
        case 'End':
        case 'Shift':
          return
        case 'a':
        case 'A':
          if (event.ctrlKey) {
            return
          }
          break
        case 'ArrowUp':
        case 'Up':
          if (this.value === '') {
            let bset = false
            const messages = this.ui.messages
            for (let i = messages.length - 1; i >= 0 && !bset; i--) {
              if (messages[i].from === this.$mock.user.address) {
                for (let j = messages[i].messages.length - 1; j >= 0; j--) {
                  const lastMessage = messages[i].messages[j]
                  if (lastMessage.type === 'text') {
                    this.$store.commit('ui/setEditMessage', {
                      id: lastMessage.id,
                      payload: lastMessage.payload,
                      from: messages[i].id,
                    })
                    bset = true
                    break
                  }
                }
              }
            }
          }
          return
      }
      this.$nextTick(() => {
        this.handleInputChange()
      })
      // this.$data.lastEdited = Date.now()
    },
    handleInputKeyup(event: KeyboardEvent) {
      const messageBox = this.$refs.messageuser as HTMLElement
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          if (messageBox.textContent && messageBox.textContent.trim() === '') {
            messageBox.innerHTML = ''
            this.autoGrow()
          }
          break
      }
    },
    /**
     * @method sendMessage
     * @description Sends message by calling the sendMessage action with current data and
     * then setting all related feilds to their default (empty)
     * @example v-on:click="sendMessage"
     */
    sendMessage() {
      this.$store.dispatch('ui/sendMessage', {
        value: this.value,
        user: this.$mock.user,
        isOwner: true,
      })
      const messageBox = this.$refs.messageuser as HTMLElement
      messageBox.innerHTML = ''
      this.value = ''
      this.$nextTick(() => {
        this.autoGrow()
      })
    },
    handleDrop(e: any) {
      e.preventDefault()
      const file = e.dataTransfer.items[0].getAsFile()
      const handleFileExpectEvent = { target: { files: [file] } }
      // @ts-ignore
      this.$refs['file-upload']?.handleFile(handleFileExpectEvent)
    },
  },
})
</script>

<style scoped lang="less" src="./Chatbar.less"></style>

<style lang="less">
.messageuser {
  blockquote {
    border-left: 4px solid @text-muted;
    padding-left: @light-spacing;
  }
  p {
    font-size: @text-size !important;
    .chatbar-tag {
      border-radius: @corner-rounding;
      background-color: @dark-gray;
      padding: @xlight-spacing;
    }
  }
}
</style>
