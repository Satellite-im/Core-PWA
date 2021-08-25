import { CategoryOption, FilterOption, ProductItem } from '~/types/marketplace/marketplace'

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
