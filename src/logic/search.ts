import type { BgmCharacterSearchResultItem } from '~/types'

// 从环境变量中获取敏感信息
const accessToken = import.meta.env.VITE_BANGUMI_ACCESS_TOKEN
const userAgent = import.meta.env.VITE_BANGUMI_USER_AGENT

export class SearchError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'SearchError'
    }
}

// 搜索函数
export async function useBgmSearch(keyword: string, offset = 0) {
    if (!keyword)
        return []

    // 检查凭证是否存在
    if (!accessToken || !userAgent || accessToken === 'YOUR_REAL_BANGUMI_ACCESS_TOKEN') {
        throw new SearchError('请在 .env 文件中配置正确的 Bangumi Access Token 和 User Agent。')
    }

    try {
        const res = await fetch('https://api.bgm.tv/v0/search/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': userAgent,
            },
            body: JSON.stringify({
                keyword,
                filter: {
                    type: [1], // Character
                },
                offset,
                limit: 20,
            }),
        })

        if (!res.ok) {
            if (res.status === 401) {
                throw new SearchError('API 认证失败 (401)。请检查 Access Token 是否过期或无效。')
            }
            throw new SearchError(`API 请求失败: ${res.status} ${res.statusText}`)
        }

        // API v0/search/characters 返回的是一个包含 data 字段的对象
        const result = await res.json()
        return (result.data || []) as BgmCharacterSearchResultItem[]
    } catch (error: any) {
        if (error instanceof SearchError) {
            throw error
        }
        throw new SearchError(`网络或未知错误: ${error.message}`)
    }
}
