import {
  Buckets,
  PrivateKey,
  Identity,
  KeyInfo,
  PushPathResult,
  Root,
  UserAuth,
  createUserAuth,
  Client, Users, ThreadID
} from '@textile/hub';
// @ts-ignore
import { Config } from '~/config'
import {TextileInitializationData} from "~/types/textile/manager";

// TODO: Buckets are not yet secure
// encrypt storage and allow the recipent to decrypt with
// their priv key.
export class BucketManager {
  buckets: Buckets | null;
  bucketKey: Root["key"] | null;
  textile: TextileInitializationData
  identity: Identity;
  bucketName: string;
  prefix: string;

  constructor(textile: TextileInitializationData, identity: Identity, prefix: string) {
    this.identity = identity;
    this.textile = textile;
    this.buckets = null;
    this.bucketKey = null;
    this.bucketName = 'v74files';
    this.prefix = prefix;
  }

  private progressParse(uploaded: number, total: number) {
    return uploaded / total * 100;
  }

  async init() {
    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }
    const buckets = await Buckets.withKeyInfo({key: Config.textile.key});
    await buckets.getToken(this.identity)
    const result = await buckets.getOrCreate(`com.github.vault74.${this.identity}.uploads`);
    if (!result.root) throw new Error('failed to open buckets');
    this.buckets = buckets;
    this.bucketKey = result.root.key;
    await this.ensureIndex();
  }

  async removeFromIndex(file: File) {
    const path = `${this.prefix}/index.json`;
    if (!this.buckets || !this.bucketKey) return;
    const bytesStream = await this.buckets?.pullPath(this.bucketKey, path);
    let array: any[] = [];
    if (bytesStream) {
      const next = await bytesStream.next();
      const value = next.value;
      const oldIndex = JSON.parse(Buffer.from(value).toString());
      array = [...oldIndex.paths];
    }

    const filtered = array.filter(item => {
      // @ts-ignore
      return item.file.name !== file.file.name;
    });

    const index = {
      date: (new Date()).getTime(),
      meta: {},
      paths: filtered,
    };
    // Store the index in the Bucket (or in the Thread later)
    const buf = Buffer.from(JSON.stringify(index, null, 2));
    await this.buckets.pushPath(this.bucketKey, path, buf);
  }

  async addToIndex(file: File, root: string, remotePath: string) {
    const path = `${this.prefix}/index.json`;
    if (!this.buckets || !this.bucketKey) return;
    const bytesStream = await this.buckets?.pullPath(this.bucketKey, path);
    let array: any[] = [];
    if (bytesStream) {
      const next = await bytesStream.next();
      const value = next.value;
      const oldIndex = JSON.parse(Buffer.from(value).toString());
      array = [...oldIndex.paths];
    }
    const index = {
      date: (new Date()).getTime(),
      meta: {},
      paths: [
        ...array,
        {
          at: Date.now(),
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            author: this.prefix,
          },
          path: remotePath,
          remote: encodeURI(`${Config.textile.browser}${root}${remotePath}`),
        },
      ],
    };
    // Store the index in the Bucket (or in the Thread later)
    const buf = Buffer.from(JSON.stringify(index, null, 2));
    await this.buckets.pushPath(this.bucketKey, path, buf);
  }

  async ensureIndex() : Promise<boolean> {
    const path = `${this.prefix}/index.json`;
    return new Promise(async resolve => {
      if (!this.buckets || !this.bucketKey) return null;
      this.buckets.listPath(this.bucketKey, path)
        .then(() => {
          resolve(true);
        })
        .catch(async e => {
          const index = {
            date: (new Date()).getTime(),
            meta: {},
            paths: [],
          };
          // Store the index in the Bucket (or in the Thread later)
          const buf = Buffer.from(JSON.stringify(index, null, 2));
          if (!this.buckets || !this.bucketKey) return null;
          await this.buckets.pushPath(this.bucketKey, path, buf);
          resolve(false);
        });
    });
  }

  async fetchIndex() : Promise<object> {
    const path = `${this.prefix}/index.json`;
    if (!this.buckets || !this.bucketKey) return {};
    const bytesStream = await this.buckets?.pullPath(this.bucketKey, path);
    const next = await bytesStream.next();
    const value = next.value;
    const index = JSON.parse(Buffer.from(value).toString());
    return index;
  }

  async removeFile(file: File, path: string) {
    if (!this.buckets || !this.bucketKey) return;
    this.buckets.removePath(this.bucketKey, `${this.prefix}${path}`);
    this.removeFromIndex(file);
  }

  async pushFile(file: File, path: string, progress: CallableFunction) : Promise<PushPathResult | Error> {
    return new Promise((resolve, reject) => {
      console.log(this.buckets, "buckets")
      const reader = new FileReader();
      reader.onabort = () => reject('file reading was aborted');
      reader.onerror = () => reject('file reading has failed');
      reader.onload = () => {
        if (!this.buckets || !this.bucketKey) {
          resolve(new Error('Please init first'));
          return;
        }
        const binaryStr = reader.result;
        // Finally, push the full file to the bucket
        this.buckets.pushPath(this.bucketKey, '/index.html', binaryStr).then((raw) => {
          resolve(raw);
          console.log(resolve(raw), "RESOLVE")
        }).catch(error => console.log(error));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async getBucket() : Promise<Root | undefined>{
    if (!this.buckets) return undefined;
    const roots = await this.buckets.list();
    return roots.find((bucket) => bucket.name === this.bucketName);
  }

  async getLinks() : Promise<any> {
    if (!this.buckets || !this.bucketKey) return undefined;
    const links = await this.buckets.links(this.bucketKey);
    return links;
  }
}
