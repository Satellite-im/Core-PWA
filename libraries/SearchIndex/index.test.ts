import SearchIndex from './index'
// global.console.warn = jest.fn()
// TODO: Add coverage for the warning being logged
import * as index from '~/libraries/SearchIndex/index'

describe('index.default.serialize', () => {
  let inst2: any

  beforeEach(() => {
    inst2 = new index.default({ ref: '', fields: [] })
  })

  test('0', () => {
    const result: any = inst2.serialize()
    expect(result).toMatchSnapshot()
  })
})

describe('index.default.build', () => {
  test('0', () => {
    const result: any = index.default.build(
      {
        ref: 'Jean-Philippe',
        fields: [
          'Credit Card Account',
          'Checking Account',
          'Investment Account',
          'Checking Account',
          'Credit Card Account',
        ],
      },
      [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = index.default.build(
      {
        ref: 'Jean-Philippe',
        fields: ['Checking Account', 'Checking Account', 'Investment Account'],
      },
      [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = index.default.build(
      {
        ref: 'Edmond',
        fields: [
          'Credit Card Account',
          'Credit Card Account',
          'Credit Card Account',
          'Checking Account',
          'Credit Card Account',
        ],
      },
      [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = index.default.build(
      {
        ref: 'Pierre Edouard',
        fields: [
          'Investment Account',
          'Credit Card Account',
          'Checking Account',
          'Checking Account',
          'Investment Account',
        ],
      },
      [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = index.default.build(
      { ref: 'George', fields: ['Investment Account'] },
      [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      ],
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = index.default.build({ ref: '', fields: [] }, [])
    expect(result).toMatchSnapshot()
  })
})

describe('index.default.update', () => {
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst5 = new index.default({ ref: '', fields: [] })
    inst4 = new index.default({
      ref: 'Edmond',
      fields: ['Investment Account', 'Checking Account', 'Credit Card Account'],
    })
    inst3 = new index.default({
      ref: 'Anas',
      fields: ['Checking Account', 'Credit Card Account', 'Checking Account'],
    })
    inst = new index.default({
      ref: 'Pierre Edouard',
      fields: [
        'Credit Card Account',
        'Credit Card Account',
        'Credit Card Account',
      ],
    })
    inst2 = new index.default({
      ref: 'Michael',
      fields: [
        'Credit Card Account',
        'Credit Card Account',
        'Credit Card Account',
      ],
    })
  })

  test('0', () => {
    const result: any = inst2.update([
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    ])
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.update([
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    ])
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.update([
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    ])
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.update([
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22undefined%22%20height%3D%22undefined%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22grey%22%2F%3E%3Ctext%20x%3D%22NaN%22%20y%3D%22NaN%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3Eundefinedxundefined%3C%2Ftext%3E%3C%2Fsvg%3E',
    ])
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.update([])
    expect(result).toMatchSnapshot()
  })
})

describe('index.default.search', () => {
  let inst7: any
  let inst6: any
  let inst5: any
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst7 = new index.default({ ref: '', fields: [] })
    inst6 = new index.default({
      ref: 'George',
      fields: [
        'Credit Card Account',
        'Credit Card Account',
        'Home Loan Account',
        'Investment Account',
        'Investment Account',
      ],
    })
    inst5 = new index.default({
      ref: 'Pierre Edouard',
      fields: [
        'Credit Card Account',
        'Investment Account',
        'Investment Account',
        'Checking Account',
        'Checking Account',
      ],
    })
    inst4 = new index.default({
      ref: 'George',
      fields: [
        'Credit Card Account',
        'Home Loan Account',
        'Checking Account',
        'Checking Account',
        'Credit Card Account',
      ],
    })
    inst3 = new index.default({
      ref: 'Michael',
      fields: [
        'Credit Card Account',
        'Checking Account',
        'Credit Card Account',
        'Checking Account',
        'Credit Card Account',
      ],
    })
    inst = new index.default({
      ref: 'Jean-Philippe',
      fields: [
        'Credit Card Account',
        'Home Loan Account',
        'Credit Card Account',
        'Home Loan Account',
        'Checking Account',
      ],
    })
    inst2 = new index.default({
      ref: 'Jean-Philippe',
      fields: [
        'Credit Card Account',
        'Investment Account',
        'Checking Account',
        'Investment Account',
        'Investment Account',
      ],
    })
  })

  test('0', () => {
    const result: any = inst2.search('', true)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.search(
      'DELETE FROM Projects WHERE pid = %sUPDATE Projects SET pname = %s WHERE pid = %s',
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.search(
      'DELETE FROM Projects WHERE pid = %s',
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const result: any = inst4.search(
      'UPDATE Projects SET pname = %s WHERE pid = %s',
      true,
    )
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const result: any = inst5.search(
      'DELETE FROM Projects WHERE pid = %s',
      false,
    )
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = inst7.search('', false)
    expect(result).toMatchSnapshot()
  })
})

describe('index.default.subscribe', () => {
  let inst4: any
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst4 = new index.default({ ref: '', fields: [] })
    inst3 = new index.default({ ref: '', fields: [] })
    inst = new index.default({
      ref: 'Edmond',
      fields: [
        'Checking Account',
        'Credit Card Account',
        'Checking Account',
        'Home Loan Account',
        'Credit Card Account',
      ],
    })
    inst2 = new index.default({
      ref: 'Michael',
      fields: [
        'Checking Account',
        'Investment Account',
        'Home Loan Account',
        'Checking Account',
        'Checking Account',
      ],
    })
  })

  test('0', () => {
    const result: any = inst2.subscribe(
      { subscribe: () => false },
      () => 'return callback value',
    )
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.subscribe(
      { subscribe: () => true },
      () => 'return callback value',
    )
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.subscribe({ subscribe: () => false }, () => '')
    expect(result).toMatchSnapshot()
  })
})

describe('index.default.unsubscribe', () => {
  let inst3: any
  let inst: any
  let inst2: any

  beforeEach(() => {
    inst3 = new index.default({ ref: '', fields: [] })
    inst = new index.default({
      ref: 'Edmond',
      fields: [
        'Credit Card Account',
        'Investment Account',
        'Credit Card Account',
        'Checking Account',
      ],
    })
    inst2 = new index.default({
      ref: 'Jean-Philippe',
      fields: [
        'Credit Card Account',
        'Home Loan Account',
        'Credit Card Account',
        'Investment Account',
      ],
    })
  })

  test('0', () => {
    const result: any = inst2.unsubscribe({ unsubscribe: () => '32-01-2020' })
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const result: any = inst.unsubscribe({ unsubscribe: () => '01-01-2020' })
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const result: any = inst3.unsubscribe({ unsubscribe: () => '' })
    expect(result).toMatchSnapshot()
  })
})

describe('', () => {
  test('update', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    idx.update(data)

    expect(idx.search('hello')?.map((r) => r.ref)).toEqual(['1', '3'])
    expect(idx.search('world')?.map((r) => r.ref)).toEqual(['2', '3'])
    expect(idx.search('hello world')?.map((r) => r.ref)).toEqual([
      '3',
      '1',
      '2',
    ])
  })
  test('serialize', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    expect(JSON.parse(idx.serialize())).toMatchObject({
      schema: { fields: ['text'], ref: 'id' },
    })
  })
  test('serialize', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    const serializedData = idx.serialize()
    expect(SearchIndex.deserialize(serializedData)).toMatchObject({
      schema: { fields: ['text'], ref: 'id' },
    })
  })
  test('unsubscribe', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    const observable = jest.fn()
    observable.unsubscribe = jest.fn()
    idx.unsubscribe(observable)
    expect(observable.unsubscribe).toHaveBeenCalled()
  })
  test.skip('subscribe', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    idx.update(data)
    const observable = jest.fn()
    observable.subscribe = jest.fn()
    /* function callback(bool) {
      return bool
    }
    idx.subscribe(observable, callback) */
    const callback = jest.fn()
    idx.subscribe(observable, callback)
    expect(observable.subscribe).toHaveBeenCalled()
    expect(callback).toHaveBeenCalled()
  })
  test.skip('search but invalid search query', async () => {
    const idx = new SearchIndex({
      ref: 'id',
      fields: ['text'],
    })
    const data = [
      { id: '1', text: 'hello' },
      { id: '2', text: 'world' },
      { id: '3', text: 'hello world' },
    ]
    idx.update(data)

    expect(console.warn).toHaveBeenCalled()
    expect(idx.search('$%@*&*#&@*', true)?.map((r) => r.ref)).toEqual([
      '1',
      '3',
    ])
  })
})
