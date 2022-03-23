import MiniSearch, { Options } from 'minisearch'
import type { SearchOptions } from 'minisearch'

export type SearchIndexOptions = {
  schema: Options<any>
  records?: any[]
  index?: MiniSearch
}

export default class SearchIndex {
  index: MiniSearch
  schema: Options<any>

  constructor(
    {
      records = [],
      schema = { fields: ['id'] },
      index = undefined,
    }: SearchIndexOptions = { schema: { fields: ['id'] } },
  ) {
    this.schema = schema
    if (index) {
      this.index = index
    } else {
      this.index = new MiniSearch(this.schema)
    }
    if (records) this.index.addAll(records)
  }

  add(record: any) {
    this.index.add(record)
  }

  addAll(records: any[]) {
    this.index.addAll(records)
  }

  removeAll() {
    this.index.removeAll()
  }

  remove(record: any) {
    this.index.remove(record)
  }

  update(records: any[]) {
    this.index.removeAll()
    this.index.addAll(records)
  }

  search(query: string, options?: SearchOptions | undefined) {
    return this.index.search(query, options)
  }

  autoSuggest(query: string, options?: SearchOptions | undefined) {
    return this.index.autoSuggest(query, options)
  }

  serialize(): string {
    const serialized = JSON.stringify({
      index: this.index.toJSON(),
      schema: this.schema,
    })
    return serialized
  }

  static deserialize(serialized: string) {
    const { index, schema } = JSON.parse(serialized)
    const idx = MiniSearch.loadJS(index, schema)
    return new SearchIndex({ index: idx, schema })
  }
}
