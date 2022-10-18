<template src="./Input.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DeleteIcon, EyeIcon, EyeOffIcon } from 'satellite-lucide-icons'
import whatInput from 'what-input'
import { InputType, InputColor } from './types'
import { Size } from '~/types/typography'
import { ButtonType } from '~/components/interactables/Button/types'

const MOBILE_FOCUS_DELAY = 300 // ms

enum Appends {
  Password = 'password',
  Erase = 'erase',
  Custom = 'custom',
}

const Input = Vue.extend({
  components: {
    DeleteIcon,
    EyeIcon,
    EyeOffIcon,
  },
  model: {
    prop: 'text',
    event: 'change',
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<InputType>,
      default: 'text',
    },
    size: {
      type: String as PropType<Size>,
      default: 'md',
    },
    color: {
      type: String as PropType<InputColor>,
      default: 'primary',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
    showLimit: {
      type: Boolean,
      default: false,
    },
    minLength: {
      type: Number,
      default: 0,
    },
    maxLength: {
      type: Number,
      default: 256,
    },
    showClear: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String as PropType<ButtonType>,
      default: 'button',
    },
    transparent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPassword: false,
      isFocused: false,
    }
  },
  computed: {
    Appends: () => Appends,
    isEmpty(): boolean {
      return !this.text.length
    },
    showClearButton(): boolean {
      return this.showClear || this.type === 'search'
    },
    derivedType(): string {
      return this.showPassword ? 'text' : this.type
    },
    // mobile devices need at least 1rem font size on inputs or it zooms the user in on focus
    derivedSize(): string {
      return this.$device.isMobile ? 'md' : this.size
    },
    enabledAppends(): string[] {
      const types: string[] = []
      if (this.type === 'password') {
        types.push(Appends.Password)
      }
      if (this.showClearButton && !this.isEmpty) {
        types.push(Appends.Erase)
      }
      if (this.$slots.append) {
        types.push(Appends.Custom)
      }
      return types
    },
  },
  mounted() {
    if (this.autofocus) {
      const input = this.$refs.input as HTMLInputElement
      // if mobile, delay focus to avoid clash with swiper animation
      if (this.$device.isMobile) {
        setTimeout(() => {
          input.focus()
        }, MOBILE_FOCUS_DELAY)
      } else {
        this.$nextTick(() => input.focus())
      }
    }
  },

  methods: {
    handleSubmit(event: InputEvent) {
      if (this.disabled || this.loading || this.invalid) {
        return
      }
      this.$emit('submit', event)
    },
    handleInput(event: InputEvent) {
      if (!event.target) {
        return
      }
      const target = event.target as HTMLInputElement
      this.$emit('change', target.value)
    },
    clearInput() {
      this.$emit('change', '')
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword
    },
    handleFocus() {
      if (whatInput.ask() === 'keyboard') {
        this.isFocused = true
      }
    },
  },
})

export type InputRef = InstanceType<typeof Input>
export default Input
</script>

<style scoped lang="less" src="./Input.less"></style>
