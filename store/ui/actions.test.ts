import module from './actions'

describe('Test store/ui', () => {
  it('should set messages', () => {
    const commit = jest.fn()
    const argument = ['message 1', 'message 2']

    module.setMessages({ commit }, argument)

    expect(commit).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith(argument)
  })

  it('should set isScrollOver', () => {
    const commit = jest.fn()
    const status = true

    module.setIsScrollOver({ commit }, status)

    expect(commit).toHaveBeenCalledWith(status)
  })

  it('should set activeChannel', () => {
    const commit = jest.fn()
    const channel = {
      type: '',
      id: '123',
      name: 'John Doe',
    }

    module.setActiveChannel({ commit }, channel)

    expect(commit).toHaveBeenCalledWith(channel)
  })

  it('should set isReacted', () => {
    const commit = jest.fn()
    const argument = false

    module.setIsReacted({ commit }, argument)

    expect(commit).toHaveBeenCalledWith(argument)
  })
})
