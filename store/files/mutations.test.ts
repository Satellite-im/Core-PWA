import * as module from './mutations'
import { FilesState } from '~/store/files/types'

const initialState = {
  downloadList: ['item1', 'item2', 'item3'],
  gridLayout: false,
  path: [
    { id: 'id1', name: 'name1' },
    { id: 'id2', name: 'name2' },
  ],
  preview: {},
  search: {
    value:
      'Nam maxime quidem libero nisi quidem facere modi ut. Sunt tenetur numquam maiores minus eos. Voluptatem nesciunt cupiditate quis necessitatibus deleniti magnam beatae. Recusandae et qui. Eius ex est libero qui voluptatem perspiciatis. Dolores id consequatur ipsam.\n \rSapiente sed perferendis animi dolor. Unde modi vero voluptatem pariatur et ad. Sunt et placeat odit aut eum saepe rerum minima. Voluptas rerum expedita aut et accusamus iure sed a architecto. Magnam et maiores corrupti voluptas ut quas.\n \rModi libero rerum qui accusamus est dolorem deserunt mollitia. Dolor est voluptatem repellat voluptas suscipit quia est rerum. Corrupti consequatur suscipit perspiciatis. Quia commodi exercitationem. In esse voluptate. Qui similique tempore.',
    searchAll: true,
  },
  sort: { category: {}, asc: false },
  status: 'tempora',
  rename: '',
}

let localizedInitialState: FilesState

describe('Test files/mutations', () => {
  beforeEach(() => {
    localizedInitialState = { ...initialState }
  })

  it('should set status', () => {
    module.default.toggleSearchAll(localizedInitialState)
    expect(localizedInitialState.search.searchAll).toBeFalsy()
  })

  it('should push new downloaded file into the addDownload array', () => {
    module.default.addDownload(localizedInitialState, 'item4')
    expect(localizedInitialState.downloadList).toEqual([
      'item1',
      'item2',
      'item3',
      'item4',
    ])
  })

  it('should rename file', () => {
    module.default.setRename(localizedInitialState, 'file2')
    expect(localizedInitialState.rename).toBe('file2')
  })

  it('should set search value', () => {
    module.default.setSearchValue(localizedInitialState, 'new search value')
    expect(localizedInitialState.search.value).toBe('new search value')
  })

  it('should negate grid layout', () => {
    module.default.toggleLayout(localizedInitialState)
    expect(localizedInitialState.gridLayout).toBeTruthy()
  })

  it('should negate grid layout from true to false', () => {
    module.default.toggleLayout({ ...localizedInitialState, gridLayout: false })
    expect(localizedInitialState.gridLayout).toBeFalsy()
  })

  it('should negate search all toggle', () => {
    module.default.toggleSearchAll(localizedInitialState)
    expect(localizedInitialState.search.searchAll).toBeTruthy()
  })

  it('should set status', () => {
    module.default.setStatus(localizedInitialState, 'status')
    expect(localizedInitialState.status).toEqual('status')
  })

  it('should set preview', () => {
    module.default.setPreview(localizedInitialState, 'example file hash')
    expect(localizedInitialState.preview).toEqual('example file hash')
  })

  it('should set path', () => {
    const argument = [
      {
        id: 'id',
        name: 'name',
      },
    ]
    module.default.setPath(localizedInitialState, argument)
    expect(localizedInitialState.path).toEqual(argument)
  })

  it('should set path with two arrays', () => {
    const argument = [
      {
        id: 'id',
        name: 'name',
      },
      {
        id: 'id2',
        name: 'name2',
      },
    ]
    module.default.setPath(localizedInitialState, argument)
    expect(localizedInitialState.path).toEqual(argument)
  })

  it('should set path with an empty array', () => {
    const argument = []
    module.default.setPath(localizedInitialState, argument)
    expect(localizedInitialState.path).toEqual(argument)
  })
})
