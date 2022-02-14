import * as Cursor from '~/libraries/ui/Cursor'
describe('Cursor.default.getCurrentCursorPosition', () => {
  test('0', () => {
    const result: any = Cursor.default.getCurrentCursorPosition(
      document.querySelector(
        'canvas:first-of-type',
        'span:first-of-type',
        'div:first-of-type',
      ),
    )
    expect(result).toMatchSnapshot()
  })
})
