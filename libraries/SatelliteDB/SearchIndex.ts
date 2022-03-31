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
  documents: Map<string, any> = new Map()

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

  get idField() {
    return this.schema.idField || 'id'
  }

  add(record: any) {
    this.documents.set(record[this.idField], record)
    this.index.add(record)
  }

  addAll(records: any[]) {
    records.map((record) => this.add(record))
  }

  getById(id: string) {
    return this.documents.get(id)
  }

  upsert(record: any) {
    this.remove(record)
    this.add(record)
  }

  upsertAll(records: any[]) {
    return records.map((record) => this.upsert(record))
  }

  removeAll(records?: any[]) {
    return (records || Array.from(this.documents.values())).map((record) =>
      this.remove(record),
    )
  }

  remove(record: any) {
    if (this.documents.has(record[this.idField])) {
      const doc = this.documents.get(record[this.idField])
      this.index.remove(doc)
      this.documents.delete(record[this.idField])
    }
  }

  update(records: any[]) {
    this.documents = new Map()
    this.index.removeAll()
    this.addAll(records)
  }

  search(query: string, options?: SearchOptions | undefined) {
    return this.index
      .search(query, options)
      .map((doc) => ({ ...doc, ...this.getById(doc[this.idField]) }))
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
