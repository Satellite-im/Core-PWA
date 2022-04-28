# Description

Generic button component.

# Usage

```vue
<InteractablesButton
  text="Test Button"
  size="normal"
  type="primary"
  :outlined="false"
  :action="testAction"
/>
```

# Props

**text** Button display text

**size** Button display size, honors bulma.io sizes

**type** Button style, honors bumla.io styles

**icon** Provide icons as a slot

**outlined** Add the outline style to the button

**action** Function or method to be called when the button is clicked

**loading** Optionall loading state for the button (useful for async tasks)

**loadingText** Ability to add custom loading texts into the button
