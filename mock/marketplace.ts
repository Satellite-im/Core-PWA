// @ts-ignore
import * as bg1 from '~/assets/img/glyphShopBg1.png'
// @ts-ignore
import * as bg2 from '~/assets/img/glyphShopBg2.png'
import {
    CategoryOption,
    FilterOption,
    GlyphShopFilterItem,
    GlyphShopItem,
    ProductItem
} from '~/types/marketplace/marketplace'
import { Glyphs } from './glyphs'


export const marketCategories = [
  { parentCategory: '', name: 'Personalize', icon: 'user' },
  { parentCategory: 'Personalize', name: 'Customizations', icon: '' },
  { parentCategory: 'Personalize', name: 'Upgrades', icon: '' },
  { parentCategory: 'Upgrades', name: 'Upgrade1', icon: '' },
  { parentCategory: 'Upgrades', name: 'Upgrade2', icon: '' },
  { parentCategory: '', name: 'Videogames', icon: '' },
  { parentCategory: 'Videogames', name: 'Puzzle', icon: '' },
  { parentCategory: 'Videogames', name: 'War', icon: '' },
  { parentCategory: '', name: 'Streaming', icon: '' },
  { parentCategory: 'Streaming', name: 'Streaming1', icon: '' },
  { parentCategory: 'Streaming', name: 'Streaming2', icon: '' },
  { parentCategory: '', name: 'Movies', icon: '' },
  { parentCategory: 'Movies', name: 'Film', icon: '' },
  { parentCategory: 'Movies', name: 'Series', icon: '' },
  { parentCategory: '', name: 'Bitcoin', icon: '' },
  { parentCategory: 'Bitcoin', name: 'ETH', icon: '' },
  { parentCategory: 'Bitcoin', name: 'BNB', icon: '' },
] as CategoryOption[]

export const marketFilters = [
  { field: 'created_at', ascending: false, text: 'Newest to Oldest' },
  { field: 'created_at', ascending: true, text: 'Oldest to Newest' },
  { field: 'price', ascending: true, text: 'Price Low to High' },
  { field: 'price', ascending: false, text: 'Price High to Low' },
  { field: 'popularity', ascending: false, text: 'Most Popular' },
] as FilterOption[]

export const marketProducts = [
  {
    name: 'Bolt',
    description: 'Short description can go here. Lorem ipsum.',
    price: 499.0,
    new: true,
    image: '',
    favorited: true,
  },
  {
    name: 'Spooky Pumpkin',
    description: 'Short description can go here. Lorem ipsum.',
    price: 499.0,
    new: true,
    image: '',
    favorited: false,
  },
  {
    name: 'Battery Pack',
    description: 'Short description can go here. Lorem ipsum.',
    price: 499.0,
    new: false,
    image: '',
    favorited: false,
  },
  {
    name: 'Skull Bomb',
    description: 'Short description can go here. Lorem ipsum.',
    price: 499.0,
    new: false,
    image: '',
    favorited: false,
  },
  {
    name: 'Gasoline Cannister',
    description: 'Short description can go here. Lorem ipsum.',
    price: 499.0,
    new: false,
    image: '',
    favorited: false,
  },
  {
    name: 'Sassy Seashell',
    description: 'Short description can go here. Lorem ipsum.',
    price: 499.0,
    new: false,
    image: '',
    favorited: false,
  },
] as ProductItem[]

export const marketGlyphs = [
  {
    id: 1,
    glyph: Glyphs.genshin,
    image: bg1,
    price: 7,
    isNew: true,
    isSale: true,
    like: true,
  },
  {
    id: 2,
    glyph: Glyphs.genshinTwo,
    image: bg2,
    price: 2.99,
    isNew: true,
    isSale: false,
    like: true,
  },
  {
    id: 3,
    glyph: Glyphs.astrobunny,
    image: bg1,
    price: 1,
    isNew: true,
    isSale: false,
    like: true,
  },
  {
    id: 4,
    glyph: Glyphs.birds,
    image: bg2,
    price: 2.99,
    isNew: false,
    isSale: true,
    like: false,
  },
  {
    id: 5,
    glyph: Glyphs.blackcat,
    image: bg2,
    price: 3,
    isNew: false,
    isSale: false,
    like: true,
  },
  {
    id: 6,
    glyph: Glyphs.food,
    image: bg1,
    price: 10,
    isNew: false,
    isSale: true,
    like: true,
  },
  {
    id: 7,
    glyph: Glyphs.grimreaper,
    image: bg1,
    price: 3.5,
    isNew: true,
    isSale: false,
    like: true,
  },
  {
    id: 8,
    glyph: Glyphs.lamsEmoji,
    image: bg2,
    price: 1,
    isNew: true,
    isSale: false,
    like: true,
  },
  {
    id: 9,
    glyph: Glyphs.marshmellow,
    image: bg2,
    price: 1.2,
    isNew: true,
    isSale: true,
    like: true,
  },
  {
    id: 10,
    glyph: Glyphs.starWars,
    image: bg2,
    price: 7.1,
    isNew: true,
    isSale: true,
    like: true,
  },
] as GlyphShopItem[]

export const marketGlyphShopFilter = [
  {
    id: 'emoji',
    name: 'Emoji',
  },
  {
    id: 'gaming',
    name: 'Gaming',
  },
  {
    id: 'anime',
    name: 'Anime',
  },
  {
    id: 'art',
    name: 'Art',
  },
] as GlyphShopFilterItem[]

export const marketNfts = []
