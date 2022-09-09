import * as animation from '~/utilities/animation'

describe('animation.easeOutBack', () => {
  test('easeOutBack 2', () => {
    const result: any = animation.easeOutBack(2)
    expect(result).toMatchSnapshot()
  })

  test('easeOutBack 1', () => {
    const result: any = animation.easeOutBack(1)
    expect(result).toMatchSnapshot()
  })

  test('easeOutBack 1.0', () => {
    const result: any = animation.easeOutBack(1.0)
    expect(result).toMatchSnapshot()
  })

  test('easeOutBack 0', () => {
    const result: any = animation.easeOutBack(0)
    expect(result).toMatchSnapshot()
  })

  test('easeOutBack 70', () => {
    const result: any = animation.easeOutBack(70)
    expect(result).toMatchSnapshot()
  })

  test('easeOutBack NaN', () => {
    const result: any = animation.easeOutBack(NaN)
    expect(result).toMatchSnapshot()
  })
})

describe('animation.lerp', () => {
  test('90, 90, 0', () => {
    const result: any = animation.lerp(90, 90, 0)
    expect(result).toMatchSnapshot()
  })

  test('100, 550, 0', () => {
    const result: any = animation.lerp(100, 550, 0)
    expect(result).toMatchSnapshot()
  })

  test('410, 550, 1', () => {
    const result: any = animation.lerp(410, 550, 1)
    expect(result).toMatchSnapshot()
  })

  test('1, 320, 1', () => {
    const result: any = animation.lerp(1, 320, 1)
    expect(result).toMatchSnapshot()
  })

  test('350, 380, 1', () => {
    const result: any = animation.lerp(350, 380, 1)
    expect(result).toMatchSnapshot()
  })

  test('Infinity, Infinity, Infinity', () => {
    const result: any = animation.lerp(Infinity, Infinity, Infinity)
    expect(result).toMatchSnapshot()
  })
})

describe('animation.animate', () => {
  test('timing 4, duration 60', () => {
    const result: any = animation.animate({
      timing: () => 4,
      draw: (v) => {
        this.x = animation.lerp(10, 100, 2)
        this.y = animation.lerp(100, 10, 2)
      },
      duration: 60,
    })
    expect(result).toMatchSnapshot()
  })

  test('timing 200, duration 15', () => {
    const result: any = animation.animate({
      timing: () => 200,
      draw: (v) => {
        this.x = animation.lerp(10, 100, 2)
        this.y = animation.lerp(100, 10, 2)
      },
      duration: 15,
    })
    expect(result).toMatchSnapshot()
  })

  test('timing 1000, duration 0.0001', () => {
    const result: any = animation.animate({
      timing: () => 1000,
      draw: (v) => {
        this.x = animation.lerp(10, 100, 2)
        this.y = animation.lerp(100, 10, 2)
      },
      duration: 0.0001,
    })
    expect(result).toMatchSnapshot()
  })

  test('timing 4, duration 2500', () => {
    const result: any = animation.animate({
      timing: () => 4,
      draw: (v) => {
        this.x = animation.lerp(10, 100, 2)
        this.y = animation.lerp(100, 10, 2)
      },
      duration: 2500,
    })
    expect(result).toMatchSnapshot()
  })

  test('timing 1000, duration 2500', () => {
    const result: any = animation.animate({
      timing: () => 1000,
      draw: (v) => {
        this.x = animation.lerp(10, 100, 2)
        this.y = animation.lerp(100, 10, 2)
      },
      duration: 2500,
    })
    expect(result).toMatchSnapshot()
  })

  test('timing Infinity, duration Infinity', () => {
    const result: any = animation.animate({
      timing: () => Infinity,
      draw: (v) => {
        this.x = animation.lerp(10, 100, 2)
        this.y = animation.lerp(100, 10, 2)
      },
      duration: Infinity,
    })
    expect(result).toMatchSnapshot()
  })
})
