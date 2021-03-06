// This file should include valid icons allowed for use in the app.
// Valid icons can be added & found in plugins/fontawesome.ts

export type IconStyle = 'fas' | 'far'
export type IconName =
  | 'spinner-third'
  | 'arrow-circle-right'
  | 'lock-open'
  | 'bars'
  | 'lock'
  | 'times-circle'
  | 'plus'
  | 'save'
  | 'user'
  | 'globle-americas'
  | 'users'
  | 'folder'
  | 'user-friends'
  | 'comment-alt-lines'
  | 'cog'
export type Icon = {
  style: IconStyle
  name: IconName
}
