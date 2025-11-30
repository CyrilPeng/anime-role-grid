import { useStorage } from '@vueuse/core'
import type { GridItem } from '~/types'
import { DEFAULT_GRID_ITEMS } from './constants'

const defaultList: GridItem[] = DEFAULT_GRID_ITEMS.map(label => ({
    label,
    character: undefined,
}))

export const list = useStorage<GridItem[]>('anime-grid-character-list-v2', defaultList)
export const name = useStorage('anime-grid-character-name', '我的动画角色喜好表')
