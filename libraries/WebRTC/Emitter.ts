/**
 * @class Emitter
 * @description The emitter class provides an interface for
 * listening and emitting custom events in a strongly typed way
 */
export default class Emitter<
  Listeners extends { [key in keyof Listeners]: (...args: any[]) => any },
> {
  private _events: { [key in keyof Listeners]?: Array<Listeners[key]> } = {}

  /**
   * @method on
   * @description Bind event listeners
   * @param event Name of the event to listen to
   * @param listener to call on any Event
   * @example Emitter.on('EVENT_NAME', (parameter: ParameterType) => {})
   */
  on<T extends keyof Listeners>(event: T, listener: Listeners[T]) {
    if (!this._events[event]) {
      this._events[event] = []
    }
    this._events[event]!.push(listener)
  }

  /**
   * @method off
   * @description Removes an event listener from the listener box
   * @param event Name of the event to unsubscribe from
   * @param listener Listener function to remove
   * @example Emitter.off("EVENT_NAME", (parameter: ParameterType) => {})
   */
  off<T extends keyof Listeners>(event: T, listenerToRemove: Listeners[T]) {
    if (!this._events[event]) {
      throw new Error(
        `Can't remove a listener. Event "${event}" doesn't exits.`,
      )
    }

    const filteredListeners = this._events[event]!.filter(
      (listener: Listeners[T]) => listener !== listenerToRemove,
    )

    this._events[event] = filteredListeners
  }

  /**
   * @method emit
   * @description Emits an event to all listeners
   * @param event Name of the event to emit
   * @param data Data to provide to listeners
   * @example Emitter.emit('EVENT_NAME', {eventParam, otherParam})
   */
  protected emit<T extends keyof Listeners>(
    event: T,
    ...[data]: Parameters<Listeners[T]>
  ) {
    if (!this._events[event]) {
      return
    }
    this._events[event]!.forEach((cb) => cb(data))
  }
}
