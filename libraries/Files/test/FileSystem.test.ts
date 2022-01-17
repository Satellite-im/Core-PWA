import { Directory } from '../Directory'
import { Fil } from '../Fil'
import { FileSystem } from '../FileSystem'
import { DIRECTORY_TYPE } from '../types/directory'

const mockFileData = {
  name: 'TestFile.png',
  descrption: 'Test file description',
  hash: '0x0aef',
}

const mockDirectoryData = {
  name: 'Test Directory',
  type: DIRECTORY_TYPE.DEFAULT,
}

const mockFileSystemData = {
  name: 'root',
}

// describe('Test FileSystem', () => {
//   const filesystem = new FileSystem()
//   const file = new Fil(...Object.values(mockFileData))
//   const file2 = new Fil(
//     ...Object.values({ ...mockFileData, name: 'testPng2.png' }),
//   )
//   const directory = new Directory(...Object.values(mockDirectoryData))
//   directory.addChild(file)
//   directory.addChild(file)
//   filesystem.addChild(file)
//   filesystem.addChild(directory)

//   it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
//     expect(filesystem.name).toEqual(mockFileSystemData.name))
//   const newDirectory = filesystem.copyChild('Test Directory')
//   const newDirectory2 = filesystem.createDirectory('Test Directory 2')
//   if (newDirectory && newDirectory2) {
//     newDirectory2.addChild(file)
//     newDirectory2.addChild(file2)
//     console.log(newDirectory2.content)
//     filesystem.openDirectory('Test Directory 2')
//     filesystem.addChild(file)
//     filesystem.addChild(file2)
//     filesystem.goBack()
//     it(`Correctly rejects duplicate entries`, () =>
//       expect(filesystem.addChild(newDirectory)).toBe(false))
//   }
//   it(`Correctly creates a new directory`, () =>
//     expect(filesystem.createDirectory('test_dir_3')).not.toBe(null))
//   it(`Correctly creates a new file`, () =>
//     expect(filesystem.createFile('test_fil')).not.toBe(null))
//   it(`Correctly deletes a directory`, () =>
//     expect(filesystem.removeChild('test_dir_3')).toBe(true))
//   it(`Correctly deletes a file`, () =>
//     expect(filesystem.removeChild('test_fil')).toBe(true))

//   it(`Correctly renames a child`, () => {
//     filesystem.createFile('test_fil', 'Blah blah blah', '0xef123')
//     filesystem.renameChild('test_fil', 'test_fil_rename')
//     expect(filesystem.hasChild('test_fil')).toBe(false)
//     expect(filesystem.hasChild('test_fil_rename')).toBe(true)
//     console.log(newDirectory2?.content)
//     console.log(JSON.stringify(filesystem.exportAll))
//   })
// })

describe('Test FileSystem', () => {
  const filesystem = new FileSystem()
  const testData =
    '{"type": "FS_DEFAULT", "version": 1, "children": [{"children":[],"id":"b90f8d48-1f67-4caf-a236-3106242ae693","name":"FDir1","type":"DEFAULT"},{"children":[],"id":"48333bad-69a9-4aab-be74-8a00a30d8648","name":"FDir2","type":"DEFAULT"},{"children":[{"id":"c5397cc0-2dcd-4a5e-8b7b-040767f5d9f9","name":"SFile1.png","type":"generic"},{"id":"6a64ae93-a423-4ec4-8a8b-c95f57a1529d","name":"SDir1","type":"DEFAULT","children":[{"id":"27d6e18b-8cb6-4d9a-ba3a-6021d9254361","name":"TDir1","type":"DEFAULT","children":[{"id":"8a4aed2b-44de-47a1-9732-156225f44397","name":"4File1.png","type":"generic"}]}]}],"id":"b4cfa2d2-e442-43e8-af02-19681cce281f","name":"FDir3","type":"DEFAULT"},{"id":"cef5669b-a1a5-45a4-a5cd-775b03962fad","name":"FFile1","type":"generic"}]}'
  it(`Correctly returns a filesystem name (${mockFileSystemData.name})`, () =>
    expect(filesystem.name).toEqual(mockFileSystemData.name))
  filesystem.importAll(filesystem, testData)
  console.log(JSON.stringify(filesystem.exportAll))
})
