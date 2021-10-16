export const mobileSwipe = {
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
        if (direction === 'left' && currThis.$device.isMobile) {
          currThis.sidebar = false
        }
        if (direction === 'right' && currThis.$device.isMobile) {
          currThis.sidebar = true
        }
      }
    },
  },
}

export default mobileSwipe