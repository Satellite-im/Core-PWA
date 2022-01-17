import { FileSystem } from '../FileSystem'

const mockFileSystemData = {
  name: 'root',
}

describe('Test FileSystem Import/Export', () => {
  const filesystem = new FileSystem()
  const testData =
    '{"type": "FS_DEFAULT", "version": 1, "children": [{"children":[],"id":"b90f8d48-1f67-4caf-a236-3106242ae693","name":"FDir1","type":"DEFAULT"},{"children":[],"id":"48333bad-69a9-4aab-be74-8a00a30d8648","name":"FDir2","type":"DEFAULT"},{"children":[{"id":"c5397cc0-2dcd-4a5e-8b7b-040767f5d9f9","name":"SFile1.png","type":"generic"},{"id":"6a64ae93-a423-4ec4-8a8b-c95f57a1529d","name":"SDir1","type":"DEFAULT","children":[{"id":"27d6e18b-8cb6-4d9a-ba3a-6021d9254361","name":"TDir1","type":"DEFAULT","children":[{"id":"8a4aed2b-44de-47a1-9732-156225f44397","name":"4File1.png","type":"generic"}]}]}],"id":"b4cfa2d2-e442-43e8-af02-19681cce281f","name":"FDir3","type":"DEFAULT"},{"id":"cef5669b-a1a5-45a4-a5cd-775b03962fad","name":"FFile1","type":"generic"}]}'
  it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
    expect(filesystem.name).toEqual(mockFileSystemData.name))
  filesystem.importAll(filesystem, testData)
  console.log(JSON.stringify(filesystem.exportAll))
})
