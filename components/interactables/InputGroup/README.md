# Description

Generic input group component.

# Usage

```vue
<InteractablesInputGroup
  v-model="input2Text"
  size="small"
  input-kind="number"
  type="dark"
  :loading="inputGroupLoading"
  :action="
    () => {
      inputGroupLoading = true
    }
  "
/>
```

# Props

**text** Input display text

**size** Input display size, honors bulma.io sizes

**input-kind** Abstracts generic input type attribute

**disabled** Disables the input button

**action** Action that should happen when the attached button is pressed

**icon** Provide in component slot

**buttonText** Optional attached button text

**label-text** Optional label appended to input

**copy-content** If provided, the button will also copy the content to clipboard
