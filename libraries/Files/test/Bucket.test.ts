import { FileSystem } from '../FileSystem'
import { Bucket } from '../remote/textile/Bucket'

const fs = new FileSystem()
const bucket = new Bucket(fs)

describe('Test FileSystem Directory', () => {
  it('Fetch fileSystem export and update Bucket index', () => {
    bucket.updateIndex(bucket.fileSystem.export)
    expect(bucket.index).toEqual(bucket.fileSystem.export)
  })
  it('Fetch index and import it into the fileSystem', () => {})
})
