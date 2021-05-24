export const mobileSwipe = {
  methods: {
    // Handles the toggling of sidebars via swipe actions
    sidebarSwipeHandler(currThis: any) {
      return function (direction: any) {
        switch (direction) {
          case 'left':
            currThis.sidebar = false
            break
          case 'right':
            currThis.sidebar = true
            break
          default:
            currThis.sidebar = false
            break
        }
      }
    },
  },
}
