export const mobileSwipe = {
  created: () => {
    // can add functions here on start-up if needed
  },
  methods: {
    settingsSwipeHandler(currThis: any) {
      return function (direction: any) {
        if (direction === 'left') {
          currThis.sidebar = false
        }
        if (direction === 'right') {
          currThis.sidebar = true
        }
      }
    },
  },
}
