import { expect } from '@jest/globals'
import { filesize } from './Filesize'

describe('init', () => {
  let inst: any

  beforeEach(() => {
    inst = filesize
  })

  it('should return the initial return value', () => {
    expect(inst(8)).toMatchSnapshot()
  })
})
