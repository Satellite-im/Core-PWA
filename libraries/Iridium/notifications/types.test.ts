import { NotificationsError } from './types'

describe('NotificationsError', () => {
    test('check NotificationsError export type', () => {
        expect(NotificationsError).toEqual({
            NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
        })
      })
    })
