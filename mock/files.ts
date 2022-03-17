import { Config } from '~/config'
import { FileType, Folder } from '~/types/files/file'

export const Files = {
  name: 'root',
  modified: 1620871715645,
  children: [
    {
      name: 'Uploads',
      modified: 1620871715645,
      meta: {
        liked: true,
      },
      children: [
        {
          name: 'Some File',
          modified: 1620871715645,
          type: 'image/png',
          size: 8203451,
          location:
            'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
        } as FileType,
        {
          name: 'Some Zip',
          modified: 1620871715645,
          type: 'archive/zip',
          size: 8201233451,
          location:
            'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip',
        } as FileType,
      ],
    } as Folder,
    {
      name: 'Favorites',
      modified: 1620871715645,
      meta: {
        shared: true,
      },
      children: [
        {
          name: 'Some File',
          modified: 1620871715645,
          type: 'image/png',
          size: 8203451,
          location:
            'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
        } as FileType,
        {
          name: 'Some Zip',
          modified: 1620871715645,
          type: 'archive/zip',
          size: 8201233451,
          location:
            'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip',
        } as FileType,
      ],
    } as Folder,
    {
      name: 'Assets',
      modified: 1620871715645,
      children: [
        {
          name: 'Typography',
          modified: 1620871715645,
          children: [
            {
              name: 'Satellite',
              modified: 1620871715645,
              children: [
                {
                  name: 'Some File as',
                  modified: 1620871715645,
                  type: 'image/png',
                  size: 8203451,
                  location:
                    'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
                } as FileType,
                {
                  name: 'Some Zip ff',
                  modified: 1620871715645,
                  type: 'archive/zip',
                  size: 8201233451,
                  location:
                    'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip',
                } as FileType,
              ],
            },
          ],
        } as Folder,
        {
          name: 'Satellite',
          modified: 1620871715645,
          children: [
            {
              name: 'Some File 9',
              modified: 1620871715645,
              type: 'image/png',
              size: 8203451,
              location:
                'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
            } as FileType,
            {
              name: 'Some Zip f',
              modified: 1620871715645,
              type: 'archive/zip',
              size: 8201233451,
              location:
                'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip',
            } as FileType,
          ],
        } as Folder,
        {
          name: 'Gaming',
          modified: 1620871715645,
          children: [
            {
              name: 'Some File 1',
              modified: 1620871715645,
              type: 'image/png',
              size: 8203451,
              location:
                'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
            } as FileType,
          ],
        } as Folder,
        {
          name: 'Some File 0',
          modified: 1620871715645,
          type: 'image/png',
          size: 8203451,
          location:
            'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
        } as FileType,
        {
          name: 'Some Zip 1',
          modified: 1620871715645,
          type: 'archive/zip',
          size: 8201233451,
          location:
            'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip',
        } as FileType,
        {
          name: 'Some File 1',
          modified: 1620871715645,
          type: 'file/markdown',
          size: 8203451,
          location: `${Config.ipfs.gateway}12jfa9sdf01234`,
        } as FileType,
        {
          name: 'Some File 2',
          modified: 1620871715645,
          type: 'image/png',
          size: 8203451,
          location:
            'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
        } as FileType,
        {
          name: 'Some File 3',
          modified: 1620871715645,
          type: 'image/png',
          size: 8203451,
          location:
            'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
        } as FileType,
        {
          name: 'Some File 4',
          modified: 1620871715645,
          type: 'image/png',
          size: 8203451,
          location:
            'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
        } as FileType,
      ],
    } as Folder,
    {
      name: 'Some File',
      modified: 1620871715645,
      type: 'image/png',
      size: 8203451,
      location:
        'https://file-examples-com.github.io/uploads/2017/10/file_example_PNG_2100kB.png',
    } as FileType,
    {
      name: 'Cyberpunk Image',
      modified: 1620871715645,
      type: 'image/png',
      size: 8203451,
      location:
        'https://newretrowave.com/wp-content/uploads/2016/02/ecaa7bd5f2171ae94a2d50d91fd4bfe1-cyberpunk-le-style.jpg',
    } as FileType,
    {
      name: 'Anime Image',
      modified: 1620871715645,
      type: 'image/png',
      size: 8203451,
      location:
        'https://images.hdqwalls.com/download/anime-cyberpunk-girl-4k-9c-640x960.jpg',
    } as FileType,
    {
      meta: {
        shared: true,
        liked: true,
      },
      name: 'Some Zip',
      modified: 1620871715645,
      type: 'archive/zip',
      size: 8201233451,
      location:
        'https://file-examples-com.github.io/uploads/2017/02/zip_2MB.zip',
    } as FileType,
  ],
} as Folder
