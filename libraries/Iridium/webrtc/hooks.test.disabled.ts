import { useCallElapsedTime, useUserStreams, useWebRTC } from './hooks'

describe('useCallElapsedTime', () => {
  it('should expose a function', () => {
		expect(useCallElapsedTime).toBeDefined()
	})
})

describe('useUserStreams', () => {
  it('should expose a function', () => {
		expect(useUserStreams).toBeDefined()
	})
})

describe('useWebRTC', () => {
  it('should expose a function', () => {
		expect(useWebRTC).toBeDefined()
	})
})