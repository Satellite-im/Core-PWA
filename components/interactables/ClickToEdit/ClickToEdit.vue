<template src="./ClickToEdit.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Config } from '~/config'
import { KeybindingEnum } from '~/libraries/Enums/enums'

export default Vue.extend({
  components: {},
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    maxChars: {
      type: Number,
      default: Config.profile.noteMaxChars,
    },
  },
  data() {
    return {
      html: '',
      focused: false,
    }
  },
  mounted() {
    this.updateHTML(this.$props.value)
  },
  methods: {
    normalizeText(text: string) {
      return text
        .replace(/&nbsp;/g, ' ')
        .replace(/\r?\n|\r/g, '')
        .trim()
    },

    textContent(text: string) {
      return this.normalizeText(text.replace(/<[^>]+>/g, ''))
    },

    selectedTextLength() {
      const selText = document.getSelection()?.toString() || ''
      const selTextLength =
        selText.length > this.maxChars ? this.maxChars : selText.length
      return selTextLength
    },

    updateHTML(value: string) {
      const el = this.$refs.input as HTMLDivElement
      this.html = value
      if (this.focused) {
        el.innerHTML = value
        const sel = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(el)
        if (sel) {
          sel.removeAllRanges()
          sel.addRange(range)
        }
        return
      }
      el.innerHTML = value || this.$props.placeholder
    },

    handleInput(event: Event) {
      const el = event.target as HTMLElement
      this.html = el.innerHTML
    },

    handleFocus() {
      this.focused = true
      const html = this.normalizeText(this.value)
      this.updateHTML(html)
    },

    handleBlur() {
      this.focused = false
      const html = this.normalizeText(this.html)
      this.updateHTML(html)
      this.$emit('change', html)
    },

    handleEnter(event: Event) {
      event.preventDefault()
      event.stopPropagation()
      const el = event.target as HTMLElement
      el.blur()
      this.handleBlur()
    },

    handlePaste(event: ClipboardEvent) {
      event.preventDefault()
      const text = this.textContent(
        event.clipboardData?.getData('text/plain') || '',
      )
      const selectedTextLength = this.selectedTextLength()
      const el = event.target as HTMLElement
      const textContent = el.textContent?.toString() || ''
      const remainLength =
        this.maxChars + selectedTextLength - textContent.length

      if (remainLength > 0) {
        const remainText =
          text.length > 0
            ? text.substring(
                0,
                remainLength > text.length ? text.length : remainLength,
              )
            : ''
        if (document.queryCommandSupported('insertText')) {
          document.execCommand('insertText', false, remainText)
        } else {
          document.execCommand('paste', false, remainText)
        }
      }
    },

    handleKeydown(event: KeyboardEvent) {
      this.$emit('keydown', event)
      if (event.ctrlKey) {
        return
      }
      switch (event.key) {
        case KeybindingEnum.ENTER:
          if (!event.shiftKey) {
            event.preventDefault()
            event.stopPropagation()
            const el = event.target as HTMLElement
            el.blur()
            this.handleBlur()
          }
          break
        case KeybindingEnum.HOME:
        case KeybindingEnum.DELETE:
        case KeybindingEnum.BACKSPACE:
        case KeybindingEnum.ARROW_DOWN:
        case KeybindingEnum.ARROW_LEFT:
        case KeybindingEnum.ARROW_UP:
        case KeybindingEnum.ARROW_RIGHT:
          break
        default: {
          const el = event.target as HTMLElement
          const textContent = el.textContent?.toString() || ''
          if (textContent.length >= this.maxChars + this.selectedTextLength()) {
            event.preventDefault()
            event.stopPropagation()
            break
          }
          break
        }
      }
    },
  },
})
</script>

<style scoped lang="less" src="./ClickToEdit.less"></style>
