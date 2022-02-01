export const Touch = {
  created: () => {
    // can add functions here on start-up if needed
  },
  methods: {
    /**
     * @method sidebarSwipeHandler DocsTODO
     * @description
     * @param currThis
     * @returns
     * @example
     */
    sidebarSwipeHandler(currThis: any) {
      return function (direction: string) {
        const showSettings = currThis.$store.state.ui.showSettings
        if (
          direction === 'left' &&
          currThis.$device.isMobile &&
          !showSettings
        ) {
          currThis.sidebar = false
        }
        if (
          direction === 'right' &&
          currThis.$device.isMobile &&
          !showSettings
        ) {
          currThis.sidebar = true
        }
      }
    },
  },
}

export default Touch
