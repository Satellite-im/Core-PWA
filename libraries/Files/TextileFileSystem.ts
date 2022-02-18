import { PushPathResult } from '@textile/hub'
import Vue from 'vue'
import { FilSystem } from './FilSystem'
import { Bucket } from './remote/textile/Bucket'

export class TextileFileSystem extends FilSystem {
  /**
   * @getter bucket
   * @returns {Bucket} bucket global to upload files to textile
   */
  get bucket() {
    return Vue.prototype.$Bucket
  }

  async uploadFile(file: File) {
    const result: PushPathResult = await this.bucket.pushFile(file)
    this.createFile(file, result.path.path)
  }
}
