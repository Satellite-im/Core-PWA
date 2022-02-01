# Description

User Permissions mixin. Makes querying for permissions easier. Firefox and Safari haven't implemented the query api, so this mostly provides a way around that. Firefox and Safari don't support selecting a different output though.

# Usage

```vue
Import the mixin into the Vue Component mixins: [UserPermissions] Call in the
function that you need. Returns a promise.
UserPermissions.methods.getUserPermissions() or
UserPermissions.methods.requestUserPermissions('audio') // or video
```
