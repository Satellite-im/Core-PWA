import * as Alerts from './Alerts'

describe('test alert methods', () => {
  const AlertsConstructor = new Alerts.Alerts()
  const inst = AlertsConstructor
  const state = inst.all

  test('get all active alerts', () => {
    const result: any = inst.all
    expect(result).toEqual(state)
  })
  test('make alert', () => {
    const dummyData = {
      type: Alerts.AlertType.DEV,
      content: {
        title: 'Title',
        description: 'Description',
      },
    }
    const result: any = inst.make(dummyData)

    // Because an Alert type have `Date.now()` and the `uuidv4()` function, we cannot check it
    // because it's value that's generated there will be different with the ones generated here.

    expect(result.type).toBe(dummyData.type)
    expect(result.content.title).toBe(dummyData.content.title)
    expect(result.content.description).toBe(dummyData.content.description)
  })
  test('mark alert', () => {
    const alertToBeMarked = state.find(
      (e) => e.state === Alerts.AlertState.UNREAD,
    ) // Select a message that has not been read

    const result: any = inst.mark(Alerts.AlertState.READ, alertToBeMarked!.id!)
    const updatedPublicStore = inst.all
    const markedAlert = updatedPublicStore.find((alert) => {
      return alert.id === alertToBeMarked!.id
    })

    expect(result.state).toBe(markedAlert!.state)
  })
  test('delete alert', () => {
    const alertToBeDeleted = inst.all.at(-1) // Select the last message to be deleted, though it can be any message

    const result: any = inst.delete(alertToBeDeleted!.id!)
    const updatedPublicStore = inst.all
    const deletedAlert = updatedPublicStore.find((alert) => {
      return alert.id === alertToBeDeleted!.id
    }) /* The find() method returns the value of the first element in the provided array that satisfies the provided
     testing function. If no values satisfy the testing function, undefined is returned.
     Because the selected alert has been deleted, we will expect it to return undefined */

    expect(deletedAlert).toBe(undefined)
    expect(result).toEqual(inst.all) // We expect that the result from the mutated array to equal the latest public story
  })
})
