<template src="./NewSelect.html"></template>

<script lang="ts">
import keyCodes from './keyCodes'

export default {
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
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    emptyOptionLabel: {
      type: String,
      default: 'Choose a value',
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    keyClear: null,
    keysSoFar: '',
    listboxHidden: true,
    searchIndex: null,
  }),
  computed: {
    selectedOptionLabel() {
      const selectedOption = this.options.find(
        (option) => option.value === this.value,
      )
      return selectedOption && selectedOption.label
    },
  },
  methods: {
    /**
     * On option click it focuses on the option.
     *
     * @param {PointerEvent} event
     */
    checkClickItem(event: PointerEvent) {
      if (!event.target) {
        return
      }
      if ((event.target as HTMLElement).getAttribute('role') === 'option') {
        this.focusItem(event.target)
        this.hideListbox()
        if (this.$refs.listboxButton)
          (this.$refs.listboxButton as HTMLElement).focus()
      }
    },
    /**
     * Handles various keyboard controls; UP/DOWN/HOME/END/PAGE_UP/PAGE_DOWN
     *
     * @param {Event} event The keydown event object
     */
    checkKeyDown(event: KeyboardEvent) {
      const key = event.which || event.keyCode

      switch (key) {
        case keyCodes.UP:
        case keyCodes.DOWN: {
          event.preventDefault()
          const selectedItemIndex = this.options.findIndex(
            (option) => option.value === this.value,
          )
          let nextItem = selectedItemIndex
            ? this.$refs.listboxOptions[selectedItemIndex]
            : this.$refs.listboxOptions[0]

          if (key === keyCodes.UP) {
            // If there's an option above the selected one
            if (selectedItemIndex - 1 >= 0) {
              // Assign the previous option to nextItem
              nextItem = this.$refs.listboxOptions[selectedItemIndex - 1]
            }
          } else {
            // If there's an option below the selected one
            // eslint-disable-next-line no-lonely-if
            if (selectedItemIndex + 1 <= this.options.length) {
              nextItem = this.$refs.listboxOptions[selectedItemIndex + 1]
            }
          }

          if (nextItem) {
            this.focusItem(nextItem)
          }

          break
        }
        case keyCodes.HOME:
        case keyCodes.PAGE_UP:
          event.preventDefault()
          this.focusFirstItem()
          break
        case keyCodes.END:
        case keyCodes.PAGE_DOWN:
          event.preventDefault()
          this.focusLastItem()
          break
        case keyCodes.RETURN:
        case keyCodes.ESC:
          event.preventDefault()
          this.hideListbox()
          this.$refs.listboxButton.focus()
          break
        default: {
          // If the user typed a set of characters,
          // focus the option that matches those characters
          const itemToFocus = this.findItemToFocus(key)
          if (itemToFocus) {
            this.focusItem(itemToFocus)
          }
          break
        }
      }
    },
    /**
     * Keypress handler for the listbox button.
     * It shows the listbox list on up/down key press.
     */
    checkShow(event) {
      const key = event.which || event.keyCode

      switch (key) {
        case keyCodes.UP:
        case keyCodes.DOWN:
          event.preventDefault()
          this.showListbox()
          this.checkKeyDown(event)
          break
        default:
          break
      }
    },
    // Resets the keysSoFar after 500ms
    clearKeysSoFarAfterDelay() {
      if (this.keyClear) {
        clearTimeout(this.keyClear)
        this.keyClear = null
      }
      this.keyClear = setTimeout(() => {
        this.keysSoFar = ''
        this.keyClear = null
      }, 500)
    },
    /**
     * defocus on the element passed as a parameter.
     *
     * @param {Element} element
     */
    defocusItem(element) {
      if (!element) {
        return
      }
      element.removeAttribute('aria-selected')
    },
    /**
     * Returns an option that its label matches the key or
     * null if none of the match the key entered.
     *
     * @param {String} key typed characters to check whether they match an option
     */
    findItemToFocus(key) {
      const character = String.fromCharCode(key)

      // If it's the first time the user is typing to find an option
      // set the search index to the active option
      if (!this.keysSoFar) {
        this.searchIndex = this.options.findIndex(
          (option) => option.value === this.value,
        )
      }

      this.keysSoFar += character
      this.clearKeysSoFarAfterDelay()

      // Find the next matching element starting from the search index
      // until the end of all the options
      let nextMatch = this.findMatchInOptions(
        this.searchIndex + 1,
        this.options.length,
      )

      // If there wasn't a match search for a match from the start of
      // all the options until the search index
      if (!nextMatch) {
        nextMatch = this.findMatchInOptions(0, this.searchIndex)
      }

      return nextMatch
    },
    /**
     * Returns an element that its label starts with keysSoFar
     * or null if none is found in the options.
     *
     * @param {String} keysSoFar
     */
    findMatchInOptions(startIndex, endIndex) {
      for (let i = startIndex; i < endIndex; i++) {
        if (
          this.options[i].label &&
          this.options[i].label.toUpperCase().indexOf(this.keysSoFar) === 0
        ) {
          return this.$refs.listboxOptions[i]
        }
      }
      return null
    },
    /**
     *  Focus on the first option
     */
    focusFirstItem() {
      this.focusItem(this.$refs.listboxOptions[0])
    },
    /**
     * Select the option passed as the parameter.
     *
     * @param {Element} element - the option to select
     */
    focusItem(element) {
      // Defocus active element
      if (this.value) {
        const index = this.options.findIndex(
          (option) => option.value === this.value,
        )
        const listboxOption = this.$refs.listboxOptions[index]
        this.defocusItem(listboxOption)
      }
      element.setAttribute('aria-selected', 'true')
      this.$refs.listboxNode.setAttribute(
        'aria-activedescendant',
        element.getAttribute('data-value'),
      )
      // Trigger the v-model "input" event with value equal to element.id
      this.$emit('input', element.getAttribute('data-value'))

      // Scroll up/down to show the listbox within the viewport
      if (
        this.$refs.listboxNode.scrollHeight >
        this.$refs.listboxNode.clientHeight
      ) {
        const scrollBottom =
          this.$refs.listboxNode.clientHeight + this.$refs.listboxNode.scrollTop
        const elementBottom = element.offsetTop + element.offsetHeight

        if (elementBottom > scrollBottom) {
          this.$refs.listboxNode.scrollTop =
            elementBottom - this.$refs.listboxNode.clientHeight
        } else if (element.offsetTop < this.$refs.listboxNode.scrollTop) {
          this.$refs.listboxNode.scrollTop = element.offsetTop
        }
      }
    },
    /**
     *  Focus on the last option
     */
    focusLastItem() {
      const lastListboxOption =
        this.$refs.listboxOptions[this.options.length - 1]
      this.focusItem(lastListboxOption)
    },
    // Hides the ListBox list
    hideListbox() {
      this.listboxHidden = true
      this.$refs.listboxButton.removeAttribute('aria-expanded')
    },
    // Shows the ListBox list and puts its on focus
    showListbox() {
      this.listboxHidden = false
      this.$refs.listboxButton.setAttribute('aria-expanded', 'true')
      this.$refs.listboxNode.focus()
    },
    // Toggles Listbox based on this.listboxHidden
    toggleListbox() {
      this.listboxHidden ? this.showListbox() : this.hideListbox()
    },
  },
}
</script>

<style scoped lang="less">
.listbox {
  font-size: 0;
  font-family: Arial, Helvetica, sans-serif;
}

[role='listbox'] {
  min-height: 18em;
  padding: 0;
  background: white;
  border: 1px solid #aaa;
}

[role='option'] {
  display: block;
  padding: 0 1em 0 1.5em;
  position: relative;
  line-height: 1.8em;
  font-size: 1rem;
  color: black;

  &.focused {
    background: #bde4ff;
  }
}

[role='option'][aria-selected='true']::before {
  content: '✓';
  position: absolute;
  left: 0.5em;
}

button {
  font-size: 16px;

  &[aria-disabled='true'] {
    opacity: 0.5;
  }
}

.listbox__button {
  font-size: 1rem;
  text-align: left;
  padding: 5px 10px;
  width: 150px;
  position: relative;

  &:after {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #6bc2d6;
    content: ' ';
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &[aria-expanded='true']::after {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 0;
    border-bottom: 5px solid #6bc2d6;
  }
}

.listbox__list {
  border-top: 0;
  max-height: 10rem;
  overflow-y: auto;
  position: absolute;
  margin: 0;
  width: 148px;
}

.listbox__label {
  font-size: 1rem;
  padding-bottom: 0.5rem;
  display: inline-block;
}

.listbox__label--visually-hidden {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
</style>
