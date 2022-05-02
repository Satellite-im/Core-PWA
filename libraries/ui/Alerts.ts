import { v4 as uuidv4 } from 'uuid'

export enum AlertType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  MISSED_CALL = 'MISSED_CALL',
  FILES_FULL = 'FILES_FULL',
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_NSFW = 'FILE_NSFW',
  DEV = 'DEV',
  DIRECT_MESSAGE = 'Direct Message',
  GROUP_MESSAGE = 'Group Message',
  MENTIONS_NOTIFICATION = 'mentionNotification',
  ACCOUNT_NOTIFICATION = 'accountNotification',
  APPLICATION_NOTIFICATION = 'applicationNotification',
  MISCELLANEOUS = 'miscellaneous',
}

export enum AlertState {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export type Alert = {
  at?: number
  id?: string
  state?: AlertState
  type: AlertType
  from: string
  content: {
    title: string
    description: string
    image?: string
  }
}

export type AlertTemplate = {
  type: AlertType
  content: {
    title: string
    description: string
    image?: string
  }
}

export class Alerts {
  private _alerts: Alert[] = []

  /**
   * @getter all
   * @description Get a list of all active alerts
   * TODO: add pagination - AP-399
   */
  get all(): Alert[] {
    return this._alerts
  }

  /**
   * @method _push
   * @description Push a new allert to the beginning of the alerts store
   * @param alert Alert to prepend to the internal store
   */
  private _push(alert: Alert): Alert[] {
    this._alerts = [alert, ...this.all]
    return this.all
  }

  /**
   * @method make
   * @description Prepend a new alert to the public store
   * @param alert AlertTemplate to create
   */
  make(alert: AlertTemplate): Alert {
    const newAlert = {
      at: Date.now(),
      id: uuidv4(),
      state: AlertState.UNREAD,
      type: alert.type,
      content: alert.content,
    } as Alert

    this._push(newAlert)

    return newAlert
  }

  /**
   * @method mark
   * @description Update an alerts state
   * @param state AlertState to set
   * @param id Alert id to mutate
   */
  mark(state: AlertState, id: string): Alert | undefined {
    const idx = this.all.findIndex((a) => a.id === id)
    this._alerts[idx] = {
      ...this._alerts[idx],
      state,
    }
    return this.all.find((a) => a.id === id)
  }

  /**
   * @method delete
   * @description Delete an alert from the internal list
   * @param id Alert id to delete
   */
  delete(id: string): Alert[] {
    this._alerts = this._alerts.filter((a) => a.id !== id)
    return this.all
  }
}
