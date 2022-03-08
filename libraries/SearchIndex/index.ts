import lunr from 'lunr'

export type SearchIndexSchema = {
  ref: string
  fields: string[]
}

export default class SearchIndex {
  schema: SearchIndexSchema
  index?: lunr.Index

  static build(schema: SearchIndexSchema, data: any[]) {
    return lunr(function () {
      this.ref(schema.ref)
      schema.fields.forEach((field) => this.field(field))
      data.forEach((record) => this.add(record))
    })
  }

  constructor(schema: SearchIndexSchema) {
    this.schema = schema
  }

  update(data: any[]) {
    this.index = SearchIndex.build(this.schema, data)
  }

  serialize() {
    return JSON.stringify({
      schema: this.schema,
      index: this.index,
    })
  }

  static deserialize(serialized: string) {
    const { schema, index } = JSON.parse(serialized)
    const searchIndex = new SearchIndex(schema)
    searchIndex.index = index
    return searchIndex
  }

  search(query: string, retry = false): lunr.Index.Result[] | undefined {
    try {
      return this.index?.search(query)
    } catch (err) {
      if (retry) {
        console.warn('invalid search query', err)
        return []
      }
      // retry without punctuation
      return this.search(query.replace(/[^\w\s]/gi, ''), true)
    }
  }

  subscribe(observable: any, callback: any) {
    return observable.subscribe((data: any[]) => {
      this.update(data)
      if (callback) callback(data)
    })
  }

  unsubscribe(observable: any) {
    return observable.unsubscribe()
  }
}
