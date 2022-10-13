import * as Keybinds from '~/utilities/Keybinds'

describe('Keybinds.getCorrectKeybind', () => {
  test('0', () => {
    const result: any = Keybinds.getCorrectKeybind('controlcontrol')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = Keybinds.getCorrectKeybind('controlJean-Philippe')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = Keybinds.getCorrectKeybind(
      'Jean-PhilippecontrolcontrolGeorge',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = Keybinds.getCorrectKeybind('Georgecontrol')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = Keybinds.getCorrectKeybind('control')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = Keybinds.getCorrectKeybind('')
    expect(result).toMatchSnapshot()
  })
})
