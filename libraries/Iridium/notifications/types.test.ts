import { EmptyNotification } from '~/libraries/Iridium/notifications/types'

describe('test constants of Iridium/notifications/types', () => {
  it('should return correct value for EmptyNotification', () => {
    expect(EmptyNotification).toMatchSnapshot()
  })
})
