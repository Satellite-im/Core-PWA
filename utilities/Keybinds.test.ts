import * as Keybinds from '~/utilities/Keybinds'

describe('Keybinds.getCorrectKeybind', () => {
  test('0', () => {
    let result: any = Keybinds.getCorrectKeybind('controlcontrol')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    let result: any = Keybinds.getCorrectKeybind('controlJean-Philippe')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    let result: any = Keybinds.getCorrectKeybind(
      'Jean-PhilippecontrolcontrolGeorge',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    let result: any = Keybinds.getCorrectKeybind('Georgecontrol')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    let result: any = Keybinds.getCorrectKeybind('control')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    let result: any = Keybinds.getCorrectKeybind('')
    expect(result).toMatchSnapshot()
  })
})
