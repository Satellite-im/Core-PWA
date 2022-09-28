import * as merge from '~/utilities/merge'

describe('merge.overwriteMerge', () => {
  test('0', () => {
    const result: any = merge.overwriteMerge('#FF00FF', 'green')
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = merge.overwriteMerge('green', '#FF00FF')
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = merge.overwriteMerge(
      'rgb(0,100,200)',
      'rgb(0.1,0.2,0.3)',
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = merge.overwriteMerge('green', 'rgb(0.1,0.2,0.3)')
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = merge.overwriteMerge('rgb(0.1,0.2,0.3)', '#FF00FF')
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = merge.overwriteMerge('', '')
    expect(result).toMatchSnapshot()
  })
})
