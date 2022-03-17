import 'jest-canvas-mock'
import 'jest-webgl-canvas-mock'
import { EnvInfo } from './EnvInfo'
global.console.warn = jest.fn()
HTMLCanvasElement.prototype.getContext = jest.fn()
// HTMLCanvasElement. = jest.fn()
// HTMLCanvasElement.prototype.getParameter = jest.fn()

let canvas

describe('init', () => {
  beforeEach(() => {
    canvas = document.createElement('canvas')
  })
  test('constructor success', () => {
    const envinfo = new EnvInfo()
    // const gl =
    //   canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    expect(jest.spyOn(canvas, 'getContext')).toHaveBeenCalled()
    // expect(jest.spyOn(gl, 'getExtension')).toHaveBeenCalled()

    // gl is currently commented out because of the Error: `Cannot spyOn on a primitive value; undefined given`
  })
  test('constructor fail', () => {
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error('mocked error')
    }
    const envinfo = new EnvInfo()
    expect(console.warn).toHaveBeenCalled()
  })
})
