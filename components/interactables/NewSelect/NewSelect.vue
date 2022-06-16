<template src="./NewSelect.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { KeybindingEnum } from '~/libraries/Enums/enums'

interface SelectOption {
  value: string
  label: string
  color?: string
}

export default Vue.extend({
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: {
      type: String,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<Array<SelectOption>>,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Choose a value',
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    listboxHidden: true,
  }),
  computed: {
    selectedOptionLabel(): string | undefined {
      const selectedOption = this.options.find(
        (option) => option.value === this.value,
      )
      return selectedOption?.label
    },
  },
  methods: {
    /**
     * @description focus option on click
     * @param {PointerEvent} event
     */
    checkClickItem(event: PointerEvent) {
      if (!event.target) {
        return
      }
      if ((event.target as HTMLElement).getAttribute('role') === 'option') {
        this.focusItem(event.target)
        this.hideListbox()
        if (this.$refs.button) (this.$refs.button as HTMLElement).focus()
      }
    },
    /**
     * @description various keyboard controls; UP/DOWN/HOME/END/PAGE_UP/PAGE_DOWN
     * @param {KeyboardEvent} event The keydown event object
     */
    checkKeyDown(event: KeyboardEvent) {
      const key = event.key

      switch (key) {
        case KeybindingEnum.ARROW_UP:
        case KeybindingEnum.ARROW_DOWN: {
          event.preventDefault()
          const selectedItemIndex = this.options.findIndex(
            (option) => option.value === this.value,
          )
          let nextItem = selectedItemIndex
            ? this.$refs.options[selectedItemIndex]
            : this.$refs.options[0]

          if (key === KeybindingEnum.ARROW_UP) {
            // If there's an option above the selected one
            if (selectedItemIndex - 1 >= 0) {
              // Assign the previous option to nextItem
              nextItem = this.$refs.options[selectedItemIndex - 1]
            }
          } else {
            // If there's an option below the selected one
            // eslint-disable-next-line no-lonely-if
            if (selectedItemIndex + 1 <= this.options.length) {
              nextItem = this.$refs.options[selectedItemIndex + 1]
            }
          }

          if (nextItem) {
            this.focusItem(nextItem)
          }

          break
        }
        case KeybindingEnum.HOME:
        case KeybindingEnum.PAGE_UP:
          event.preventDefault()
          this.focusFirstItem()
          break
        case KeybindingEnum.END:
        case KeybindingEnum.PAGE_DOWN:
          event.preventDefault()
          this.focusLastItem()
          break
        case KeybindingEnum.ENTER:
        case KeybindingEnum.ESCAPE:
          event.preventDefault()
          this.hideListbox()
          this.$refs.button.focus()
          break
        default: {
          // add logic to find result, maybe debounce?
          break
        }
      }
    },
    /**
     * Keypress handler for the listbox button.
     * It shows the listbox list on up/down key press.
     */
    checkShow(event: KeyboardEvent) {
      const key = event.key

      switch (key) {
        case KeybindingEnum.ARROW_UP:
        case KeybindingEnum.ARROW_DOWN:
          event.preventDefault()
          this.showListbox()
          this.checkKeyDown(event)
          break
        default:
          break
      }
    },
    /**
     * defocus on the element passed as a parameter.
     *
     * @param {Element} element
     */
    defocusItem(element: HTMLElement) {
      if (!element) {
        return
      }
      element.removeAttribute('aria-selected')
    },
    /**
     *  Focus on the first option
     */
    focusFirstItem() {
      this.focusItem(this.$refs.options[0])
    },
    /**
     * Select the option passed as the parameter.
     *
     * @param {Element} element - the option to select
     */
    focusItem(element: HTMLElement) {
      // Defocus active element
      if (this.value) {
        const index = this.options.findIndex(
          (option) => option.value === this.value,
        )
        const listboxOption = this.$refs.options[index]
        this.defocusItem(listboxOption)
      }
      element.setAttribute('aria-selected', 'true')
      this.$refs.list.setAttribute(
        'aria-activedescendant',
        element.getAttribute('data-value'),
      )
      // Trigger the v-model "input" event with value equal to element.id
      this.$emit('input', element.getAttribute('data-value'))

      // Scroll up/down to show the listbox within the viewport
      if (this.$refs.list.scrollHeight > this.$refs.list.clientHeight) {
        const scrollBottom =
          this.$refs.list.clientHeight + this.$refs.list.scrollTop
        const elementBottom = element.offsetTop + element.offsetHeight

        if (elementBottom > scrollBottom) {
          this.$refs.list.scrollTop =
            elementBottom - this.$refs.list.clientHeight
        } else if (element.offsetTop < this.$refs.list.scrollTop) {
          this.$refs.list.scrollTop = element.offsetTop
        }
      }
    },
    /**
     *  Focus on the last option
     */
    focusLastItem() {
      const lastListboxOption = this.$refs.options[this.options.length - 1]
      this.focusItem(lastListboxOption)
    },
    // Hides the ListBox list
    hideListbox() {
      this.listboxHidden = true
      this.$refs.button.removeAttribute('aria-expanded')
    },
    // Shows the ListBox list and puts its on focus
    showListbox() {
      this.listboxHidden = false
      this.$refs.button.setAttribute('aria-expanded', 'true')
      this.$refs.list.focus()
    },
    // Toggles Listbox based on this.listboxHidden
    toggleListbox() {
      this.listboxHidden ? this.showListbox() : this.hideListbox()
    },
  },
})
</script>

<style scoped lang="less" src="./NewSelect.less"></style>
