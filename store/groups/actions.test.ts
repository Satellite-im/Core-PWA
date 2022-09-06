import * as module from './actions'
import InitialGroupsState from '~/store/groups/state'

describe('Test store/groups/actions', () => {
  it('should initialize', () => {
    const dispatch = jest.fn()
    const state = InitialGroupsState()

    const result = module.default.initialize({ dispatch, state })
    expect(result).toMatchSnapshot()
  })

  it('should create group', () => {
    const commit = jest.fn()
    const argument = {
      name: 'example_name',
    }

    const result = module.default.createGroup(commit, argument)
    expect(result).toMatchSnapshot()
  })

  it('should add group', () => {
    const commit = jest.fn()
    const state = InitialGroupsState()
    const argument = 'group_id'

    module.default.addGroup({ commit, state }, argument)
    expect(commit).toHaveBeenCalled()
  })

  it('should add group that has already existed', () => {
    const commit = jest.fn()
    const state = InitialGroupsState()
    const argument = 'group_id'

    module.default.addGroup({ commit, state }, argument)
    expect(commit).not.toHaveBeenCalled()
  })

  it('should fetch group members', () => {
    const commit = jest.fn()
    const argument = 'group_id'

    module.default.addGroup(commit, argument)
    expect(commit).toHaveBeenCalled()
  })
})
