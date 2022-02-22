import { EnvInfo } from './EnvInfo'
import 'jest-canvas-mock'
global.console.warn = jest.fn()
HTMLCanvasElement.prototype.getContext = jest.fn()
// HTMLCanvasElement. = jest.fn()
// HTMLCanvasElement.prototype.getParameter = jest.fn()

describe('init', () => {
  test('constructor success', () => {
    const envinfo = new EnvInfo()
    expect(envinfo.debugInfo).toBe(undefined)
  })
  test('constructor fail', () => {
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error('mocked error')
    }
    const envinfo = new EnvInfo()
    expect(console.warn).toHaveBeenCalled()
  })
})
