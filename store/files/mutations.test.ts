import { expect } from '@jest/globals'
import * as mutations from '~/store/files/mutations'

describe('mutations.default.fetchFiles', () => {
  test('0', () => {
    const object: any = [
      {
        name: 'George',
        modified: 200,
        children: [null, null, null, null, null],
      },
      {
        name: 'Jean-Philippe',
        modified: 404,
        children: [null, null, null, null, null],
      },
    ]
    const object2: any = [
      {
        name: 'Michael',
        modified: 500,
        type: 'array',
        size: 256,
        location: 'http://base.com',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Michael',
        modified: 404,
        type: 'object',
        size: 32,
        location: 'http://base.com',
        meta: { liked: true, shared: true },
      },
    ]
    const object3: any = [
      {
        name: 'Anas',
        modified: 400,
        type: 'string',
        size: 32,
        location: 'google.com',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Edmond',
        modified: 500,
        type: 'number',
        size: 32,
        location: 'google.com',
        meta: { liked: true, shared: false },
      },
    ]
    const object4: any = [
      {
        name: 'Pierre Edouard',
        modified: 404,
        type: 'object',
        size: 256,
        location: 'www.google.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Anas',
        modified: 500,
        type: 'string',
        size: 64,
        location: 'http://www.croplands.org/account/confirm?t=',
        meta: { liked: false, shared: false },
      },
    ]
    const object5: any = [
      {
        name: 'Anas',
        modified: 429,
        type: 'string',
        size: 16,
        location: 'Www.GooGle.com',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Jean-Philippe',
        modified: 200,
        type: 'array',
        size: 256,
        location: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        meta: { liked: true, shared: false },
      },
    ]
    const object6: any = [
      {
        name: 'Michael',
        modified: 500,
        type: 'object',
        size: 0,
        location: 'https://croplands.org/app/a/confirm?t=',
        meta: { liked: true, shared: true },
      },
      {
        name: 'Michael',
        modified: 404,
        type: 'array',
        size: 256,
        location: 'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        meta: { liked: false, shared: false },
      },
    ]
    const param2: any = [
      { name: 'Anas', modified: 404, children: object2 },
      { name: 'George', modified: 404, children: object3 },
      { name: 'Michael', modified: 404, children: object4 },
      { name: 'Pierre Edouard', modified: 400, children: object5 },
      { name: 'Jean-Philippe', modified: 404, children: object6 },
    ]
    const result: any = mutations.default.fetchFiles({ tree: object }, param2)
    expect(result).toMatchSnapshot()
  })

  test('1', () => {
    const object: any = [
      {
        name: 'Jean-Philippe',
        modified: 400,
        type: 'array',
        size: 10,
        location: 'https://croplands.org/app/a/confirm?t=',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Pierre Edouard',
        modified: 500,
        type: 'string',
        size: 256,
        location: 'google.com',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Pierre Edouard',
        modified: 404,
        type: 'number',
        size: 64,
        location: 'http://base.com',
        meta: { liked: true, shared: true },
      },
    ]
    const object2: any = [
      {
        name: 'Anas',
        modified: 404,
        type: 'object',
        size: 64,
        location: 'Www.GooGle.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Jean-Philippe',
        modified: 404,
        type: 'string',
        size: 256,
        location: 'www.google.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Anas',
        modified: 429,
        type: 'string',
        size: 10,
        location: 'http://base.com',
        meta: { liked: false, shared: false },
      },
    ]
    const object3: any = [
      {
        name: 'Edmond',
        modified: 404,
        type: 'number',
        size: 10,
        location: 'http://example.com/showcalendar.html?token=CKF50YzIHxCTKMAg',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Michael',
        modified: 429,
        type: 'string',
        size: 0,
        location: 'www.google.com',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Edmond',
        modified: 400,
        type: 'number',
        size: 10,
        location: 'Www.GooGle.com',
        meta: { liked: false, shared: true },
      },
    ]
    const object4: any = [
      {
        name: 'George',
        modified: 500,
        type: 'number',
        size: 0,
        location: 'https://twitter.com/path?abc',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Michael',
        modified: 200,
        type: 'string',
        size: 10,
        location: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        meta: { liked: false, shared: true },
      },
      {
        name: 'George',
        modified: 400,
        type: 'number',
        size: 64,
        location: 'http://www.example.com/route/123?foo=bar',
        meta: { liked: false, shared: true },
      },
    ]
    const object5: any = [
      { name: 'Michael', modified: 200, children: object },
      { name: 'Anas', modified: 429, children: object2 },
      { name: 'George', modified: 200, children: object3 },
      { name: 'Pierre Edouard', modified: 500, children: object4 },
    ]
    const object6: any = [
      {
        name: 'George',
        modified: 500,
        type: 'object',
        size: 16,
        location: 'https://',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Pierre Edouard',
        modified: 500,
        type: 'object',
        size: 16,
        location: 'http://www.example.com/route/123?foo=bar',
        meta: { liked: true, shared: true },
      },
      {
        name: 'Anas',
        modified: 429,
        type: 'array',
        size: 16,
        location: 'http://www.croplands.org/account/confirm?t=',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Michael',
        modified: 400,
        type: 'number',
        size: 16,
        location: 'https://',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Michael',
        modified: 400,
        type: 'object',
        size: 32,
        location: 'www.google.com',
        meta: { liked: false, shared: true },
      },
    ]
    const object7: any = [
      {
        name: 'Pierre Edouard',
        modified: 500,
        type: 'number',
        size: 256,
        location: 'google.com',
        meta: { liked: true, shared: true },
      },
      {
        name: 'Pierre Edouard',
        modified: 429,
        type: 'string',
        size: 256,
        location: 'www.google.com',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Edmond',
        modified: 404,
        type: 'array',
        size: 32,
        location: 'google.com',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Michael',
        modified: 200,
        type: 'array',
        size: 32,
        location: 'google.com',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Michael',
        modified: 400,
        type: 'number',
        size: 256,
        location: 'http://www.example.com/route/123?foo=bar',
        meta: { liked: true, shared: true },
      },
    ]
    const param2: any = [
      { name: 'Jean-Philippe', modified: 400, children: object6 },
      { name: 'George', modified: 404, children: object7 },
    ]
    const result: any = mutations.default.fetchFiles({ tree: object5 }, param2)
    expect(result).toMatchSnapshot()
  })

  test('2', () => {
    const object: any = [{ name: 'George', modified: 500, children: [null] }]
    const object2: any = [
      {
        name: 'George',
        modified: 404,
        type: 'string',
        size: 16,
        location: 'https://api.telegram.org/bot',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Jean-Philippe',
        modified: 200,
        type: 'array',
        size: 16,
        location: 'Www.GooGle.com',
        meta: { liked: true, shared: true },
      },
    ]
    const object3: any = [
      {
        name: 'George',
        modified: 400,
        type: 'number',
        size: 0,
        location: 'http://www.example.com/route/123?foo=bar',
        meta: { liked: true, shared: true },
      },
      {
        name: 'Jean-Philippe',
        modified: 200,
        type: 'object',
        size: 256,
        location: 'http://www.croplands.org/account/confirm?t=',
        meta: { liked: true, shared: true },
      },
    ]
    const object4: any = [
      {
        name: 'George',
        modified: 404,
        type: 'number',
        size: 32,
        location: 'Www.GooGle.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Anas',
        modified: 400,
        type: 'array',
        size: 16,
        location: 'http://www.example.com/route/123?foo=bar',
        meta: { liked: false, shared: false },
      },
    ]
    const object5: any = [
      {
        name: 'Michael',
        modified: 500,
        type: 'string',
        size: 32,
        location: 'https://',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Jean-Philippe',
        modified: 429,
        type: 'object',
        size: 256,
        location: 'http://base.com',
        meta: { liked: false, shared: true },
      },
    ]
    const object6: any = [
      {
        name: 'Edmond',
        modified: 404,
        type: 'string',
        size: 0,
        location: 'https://api.telegram.org/bot',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Michael',
        modified: 200,
        type: 'object',
        size: 64,
        location: 'Www.GooGle.com',
        meta: { liked: true, shared: false },
      },
    ]
    const param2: any = [
      { name: 'Michael', modified: 500, children: object2 },
      { name: 'George', modified: 429, children: object3 },
      { name: 'Michael', modified: 200, children: object4 },
      { name: 'Anas', modified: 404, children: object5 },
      { name: 'Michael', modified: 429, children: object6 },
    ]
    const result: any = mutations.default.fetchFiles({ tree: object }, param2)
    expect(result).toMatchSnapshot()
  })

  test('3', () => {
    const object: any = [
      {
        name: 'Pierre Edouard',
        modified: 200,
        children: [null, null, null, null],
      },
      { name: 'Edmond', modified: 200, children: [null, null, null, null] },
      {
        name: 'Jean-Philippe',
        modified: 500,
        children: [null, null, null, null],
      },
    ]
    const param2: any = [
      {
        name: 'Edmond',
        modified: 500,
        type: 'string',
        size: 10,
        location: 'http://www.croplands.org/account/confirm?t=',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Pierre Edouard',
        modified: 429,
        type: 'string',
        size: 256,
        location: 'https://api.telegram.org/bot',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Jean-Philippe',
        modified: 400,
        type: 'number',
        size: 64,
        location: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        meta: { liked: true, shared: true },
      },
    ]
    const result: any = mutations.default.fetchFiles({ tree: object }, param2)
    expect(result).toMatchSnapshot()
  })

  test('4', () => {
    const object: any = [
      {
        name: 'Pierre Edouard',
        modified: 404,
        children: [null, null, null, null, null],
      },
      { name: 'Anas', modified: 500, children: [null, null, null, null, null] },
    ]
    const object2: any = [
      {
        name: 'Michael',
        modified: 200,
        type: 'string',
        size: 32,
        location: 'www.google.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Anas',
        modified: 404,
        type: 'object',
        size: 32,
        location: 'https://croplands.org/app/a/confirm?t=',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Michael',
        modified: 400,
        type: 'string',
        size: 0,
        location: 'https://api.telegram.org/',
        meta: { liked: false, shared: true },
      },
      {
        name: 'Anas',
        modified: 429,
        type: 'object',
        size: 256,
        location: 'http://base.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Jean-Philippe',
        modified: 400,
        type: 'string',
        size: 64,
        location: 'Www.GooGle.com',
        meta: { liked: false, shared: false },
      },
    ]
    const object3: any = [
      {
        name: 'Jean-Philippe',
        modified: 500,
        type: 'string',
        size: 16,
        location: 'http://base.com',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Anas',
        modified: 429,
        type: 'string',
        size: 0,
        location: 'http://www.croplands.org/account/confirm?t=',
        meta: { liked: false, shared: false },
      },
      {
        name: 'Edmond',
        modified: 500,
        type: 'array',
        size: 256,
        location: 'https://',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Jean-Philippe',
        modified: 500,
        type: 'number',
        size: 256,
        location: 'https://api.telegram.org/',
        meta: { liked: true, shared: false },
      },
      {
        name: 'Pierre Edouard',
        modified: 500,
        type: 'array',
        size: 64,
        location: 'google.com',
        meta: { liked: true, shared: false },
      },
    ]
    const param2: any = [
      { name: 'George', modified: 404, children: object2 },
      { name: 'George', modified: 404, children: object3 },
    ]
    const result: any = mutations.default.fetchFiles({ tree: object }, param2)
    expect(result).toMatchSnapshot()
  })

  test('5', () => {
    const result: any = mutations.default.fetchFiles({ tree: [] }, [])
    expect(result).toMatchSnapshot()
  })
})
