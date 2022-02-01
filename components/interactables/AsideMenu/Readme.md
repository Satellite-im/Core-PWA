# AsideMenu

AsideMenu displays list of links in an organized fashion

## Usage

```vue
<UiAsideMenu
  :menu-content="sidebarLayout"
  :title="title"
  :toggleable="toggleable"
  :toggle="toggle"
  :active="$route.path.split('/')[2]"
/>
```

## Props

**menu-content** List of content to display in the sidebar. Please see typings.

**title** Optional title for the sidebar

**toggleable** If enabled, there will be a toggle button added

**toggle** Callback function for toggle events

**active** Active route, used for highlighting
