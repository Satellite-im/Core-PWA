import * as index from '~/components/mixins/Touch/index'

describe('index.Touch.created', () => {
  test('0', () => {
    const localSpy = jest.spyOn(index.Touch, 'created')
    const result: any = index.Touch.created()

    expect(localSpy).toHaveBeenCalled()
    expect(result).toBe(undefined)
  })
})

describe('index.Touch.methods.sidebarSwipeHandler human created', () => {
  test('showSettings false and left direction', () => {
    const local = {
      $store: {
        state: {
          ui: {
            showSettings: false,
          },
        },
      },
      $device: {
        isMobile: true,
      },
      sidebar: false,
    }
    const givenFunction: any = index.Touch.methods.sidebarSwipeHandler(local)
    givenFunction('left')
    expect(local.sidebar).toBeFalsy()
  })

  test('showSettings false and right direction', () => {
    const local = {
      $store: {
        state: {
          ui: {
            showSettings: false,
          },
        },
      },
      $device: {
        isMobile: true,
      },
      sidebar: false,
    }
    const givenFunction: any = index.Touch.methods.sidebarSwipeHandler(local)
    givenFunction('right')
    expect(local.sidebar).toBeTruthy()
  })

  test('showSettings true and left direction', () => {
    const local = {
      $store: {
        state: {
          ui: {
            showSettings: true,
          },
        },
      },
      $device: {
        isMobile: true,
      },
      sidebar: false,
    }
    const givenFunction: any = index.Touch.methods.sidebarSwipeHandler(local)
    givenFunction('left')
    expect(local.sidebar).toBeFalsy()
  })

  test('showSettings true and right direction', () => {
    const local = {
      $store: {
        state: {
          ui: {
            showSettings: true,
          },
        },
      },
      $device: {
        isMobile: true,
      },
      sidebar: false,
    }
    const givenFunction: any = index.Touch.methods.sidebarSwipeHandler(local)
    givenFunction('right')
    expect(local.sidebar).toBeFalsy() // Will be false because no mutation is done to the local, because showSettings is not false.
  })
})
