import { FileSystem } from '../FileSystem'

const mockFileSystemData = {
  name: 'root',
}

describe('Test FileSystem Import/Export', () => {
  const filesystem = new FileSystem()
  const testData =
    '{"type": "FS_DEFAULT", "version": 1, "_children": [{"_children":[],"_id":"b90f8d48-1f67-4caf-a236-3106242ae693","_name":"FDir1","_type":"DEFAULT"},{"_children":[],"_id":"48333bad-69a9-4aab-be74-8a00a30d8648","_name":"FDir2","_type":"DEFAULT"},{"_children":[{"_id":"c5397cc0-2dcd-4a5e-8b7b-040767f5d9f9","_name":"SFile1.png","_type":"generic"},{"_id":"6a64ae93-a423-4ec4-8a8b-c95f57a1529d","_name":"SDir1","_type":"DEFAULT","_children":[{"_id":"27d6e18b-8cb6-4d9a-ba3a-6021d9254361","_name":"TDir1","_type":"DEFAULT","_children":[{"_id":"8a4aed2b-44de-47a1-9732-156225f44397","_name":"4File1.png","_type":"generic"}]}]}],"_id":"b4cfa2d2-e442-43e8-af02-19681cce281f","_name":"FDir3","_type":"DEFAULT"},{"_id":"cef5669b-a1a5-45a4-a5cd-775b03962fad","_name":"FFile1","_type":"generic"}]}'
  it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
    expect(filesystem.name).toEqual(mockFileSystemData.name))
})
