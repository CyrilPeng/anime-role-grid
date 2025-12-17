import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../services/api'

// Mock the global fetch
global.fetch = vi.fn()

describe('API Service', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('searchBangumi should call the correct proxy endpoint', async () => {
        // Mock successful response
        const mockResponse = {
            data: [
                { id: 1, name: 'Naruto', images: { large: 'url' } }
            ]
        }

            ; (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            })

        const result = await api.searchBangumi('Naruto', 'character')

        // Expect items to be returned
        expect(result).toHaveLength(1)
        expect(result[0]?.name).toBe('Naruto')

        // Verify fetch arguments (Proxy Check)
        expect(global.fetch).toHaveBeenCalledWith('/api/search', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('"keyword":"Naruto"'),
        }))
    })

    it('searchBangumi should throw error on 401', async () => {
        ; (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })

        await expect(api.searchBangumi('test')).rejects.toThrow('API 认证失败 (401)')
    })
})
