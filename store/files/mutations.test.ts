import * as module from './mutations'

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

describe('Test files/mutations', () => {
  it('should push new downloaded file into the addDownload array', () => {
    const localizedInitialState = { ...initialState }
    module.default.addDownload(localizedInitialState, 'item4')
    expect(localizedInitialState.downloadList).toEqual([
      'item1',
      'item2',
      'item3',
      'item4',
    ])
  })

  it('should rename file', () => {
    const localizedInitialState = { ...initialState }
    module.default.setRename(localizedInitialState, 'file2')
    expect(localizedInitialState.rename).toBe('file2')
  })

  it('should set search value', () => {
    const localizedInitialState = { ...initialState }
    module.default.setSearchValue(localizedInitialState, 'new search value')
    expect(localizedInitialState.search.value).toBe('new search value')
  })

  it('should negate grid layout', () => {
    const localizedInitialState = { ...initialState }
    module.default.toggleLayout(localizedInitialState)
    expect(localizedInitialState.gridLayout).toBeTruthy()
  })

  it('should negate search all toggle', () => {
    const localizedInitialState = { ...initialState }
    module.default.toggleSearchAll(localizedInitialState)
    expect(localizedInitialState.search.searchAll).toBeFalsy()
  })
})
