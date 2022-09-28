import 'jest-canvas-mock'
import 'jest-webgl-canvas-mock'
import { EnvInfo } from './EnvInfo'
global.console.warn = jest.fn()
HTMLCanvasElement.prototype.getContext = jest.fn()

let canvas: HTMLCanvasElement

describe('init', () => {
  beforeEach(() => {
    canvas = document.createElement('canvas')
  })

  test('constructor success', () => {
    const envinfo = new EnvInfo()
    expect(jest.spyOn(canvas, 'getContext')).toHaveBeenCalled()
  })

  test('constructor fail', () => {
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error('mocked error')
    }
    const envinfo = new EnvInfo()
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalled()
  })
})
