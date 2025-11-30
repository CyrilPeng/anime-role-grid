// bangumi-anime-grid character version

// 从 POST /v0/search/characters 返回的数据类型
export interface BgmCharacterSearchResultItem {
    id: number;
    name: string;
    relation: string;
    actors: {
        name: string;
    }[];
    images: {
        small: string;
        grid: string;
        large: string;
        medium: string;
    };
}

// 角色详情数据类型
export interface GridItemCharacter {
    id: number | string;
    name: string;
    image: string;
}

// 格子数据类型
export interface GridItem {
    label: string;
    character?: GridItemCharacter;
}
