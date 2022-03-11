import lunr from 'lunr'

export type SearchIndexSchema = {
  ref: string
  fields: string[]
}

/**
 * Class representing a SearchIndex
 * @class SearchIndex
 */
export default class SearchIndex {
  schema: SearchIndexSchema
  index?: lunr.Index

  /**
   * @constructs SearchIndex
   * @param schema the schema to use for the index
   */
  constructor(schema: SearchIndexSchema) {
    this.schema = schema
  }

  /**
   * Builds a search index from a list of documents.
   * @param schema the schema of the index
   * @param data the data to index
   * @returns lunr.Index
   */
  static build(schema: SearchIndexSchema, data: any[]) {
    return lunr(function () {
      this.ref(schema.ref)
      schema.fields.forEach((field) => this.field(field))
      data.forEach((record) => this.add(record))
    })
  }

  /**
   * Updates the index with new data.
   * @param data the data to index
   */
  update(data: any[]) {
    this.index = SearchIndex.build(this.schema, data)
  }

  /**
   * Serializes the index to JSON.
   * @returns JSON
   */
  serialize() {
    return JSON.stringify({
      schema: this.schema,
      index: this.index,
    })
  }

  /**
   * Deserialize an index from JSON.
   * @param serialized the serialized index
   * @returns SearchIndex
   */
  static deserialize(serialized: string) {
    const { schema, index } = JSON.parse(serialized)
    const searchIndex = new SearchIndex(schema)
    searchIndex.index = index
    return searchIndex
  }

  /**
   * Searches the index for a query string.
   * @param query the query to search for
   * @param retry is this a retry?
   * @returns an array of results
   */
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

  /**
   * Subscribe to an observable that emits data to be indexed
   * @param observable the observable to subscribe to
   * @param callback the callback to call when data is emitted
   */
  subscribe(observable: any, callback: any) {
    return observable.subscribe((data: any[]) => {
      this.update(data)
      if (callback) callback(data)
    })
  }

  /**
   * Unsubscribe from an observable that emits data to be indexed
   * @param observable the observable to unsubscribe from
   */
  unsubscribe(observable: any) {
    return observable.unsubscribe()
  }
}
