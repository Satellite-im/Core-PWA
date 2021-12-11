import {
  WebRTCEventBox,
  WebRTCEvents,
  WebRTCEvent,
  WebRTCData,
} from '~/libraries/WebRTC/types'

export default class Emitter {
  private _events: typeof WebRTCEventBox = WebRTCEventBox

  /**
   * @method on
   * @description Bind event listeners to WebRTCEvents
   * @param event WebRTCEvent to listen to
   * @param listener to call on any WebRTC Event
   * @example Emitter.on(WebRTCEvents.INIT, () => {})
   */
  on(event: WebRTCEvent, listener: Function) {
    this._events[WebRTCEvents[event]].push(listener)
  }

  /**
   * @method off
   * @description Removes an event listener from the listener box
   * @param event WebRTCEvent to unsubscribe from
   * @param listener Listener function to remove
   * @example Emitter.off(WebRTCEvents.INIT, () => {})
   */
  off(event: WebRTCEvent, listenerToRemove: Function) {
    if (!this._events[WebRTCEvents[event]]) {
      throw new Error(
        `Can't remove a listener. Event "${event}" doesn't exits.`
      )
    }

    const filterListeners = (listener: Function) =>
      listener !== listenerToRemove

    this._events[WebRTCEvents[event]] =
      this._events[WebRTCEvents[event]].filter(filterListeners)
  }

  /**
   * @method emit
   * @description Emits an event to all listeners
   * @param event WebRTCEvent to emit
   * @param data Data to provide to listeners
   * @example Emitter.emit(WebRTCEvents.INIT, 'something')
   */
  protected emit(event: WebRTCEvent, data: any) {
    if (!this._events[WebRTCEvents[event]]) {
      throw new Error(`Can't emit an event. Event "${event}" doesn't exits.`)
    }

    const fireCallbacks = (callback: Function) => {
      // eslint-disable-next-line node/no-callback-literal
      callback({
        at: Date.now(),
        event: WebRTCEvents[event],
        data,
      } as Object as WebRTCData)
    }

    this._events[WebRTCEvents[event]].forEach(fireCallbacks)
  }
}
