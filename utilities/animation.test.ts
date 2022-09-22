import { easeOutBack, lerp } from '~/utilities/animation'

describe('Test utilities/animation', () => {
  it('should return expected value for easeOutBack', () => {
    const argument = 42
    const result = easeOutBack(argument)

    const expectedValue =
      1 +
      (1.2 + 1) * Math.pow(argument - 1, 5) +
      1.2 * Math.pow(argument - 1, 4)

    expect(result).toEqual(expectedValue)
  })

  it('should return expected value for lerp', () => {
    const argumentX = 22
    const argumentY = 32
    const argumentA = 42
    const result = lerp(argumentX, argumentY, argumentA)

    const expectedValue = argumentX * (1 - argumentA) + argumentY * argumentA

    expect(result).toEqual(expectedValue)
  })
})
