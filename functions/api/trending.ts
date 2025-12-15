interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    try {
        // Calculate timestamp for 24 hours ago (in seconds)
        // SQLite 'now' is in seconds for strftime('%s')

        // Query:
        // 1. Join saves and save_items
        // 2. Filter by saves.created_at > 24h ago
        // 3. Filter only 'character' category (optional, or show all trending)
        // 4. Group by bangumi_id (preferred) or character_name
        // 5. Count frequency
        // 6. Limit 10

        const stmt = env.DB.prepare(`
            SELECT 
                si.character_name as name, 
                si.bangumi_id as id, 
                si.img_url as image, -- Note: This might be NULL if it was a custom base64, but for Bangumi items it's a URL
                COUNT(*) as count
            FROM save_items si
            JOIN saves s ON si.save_id = s.id
            WHERE s.created_at > (strftime('%s', 'now') - 86400)
            AND si.item_category = 'character' -- Focus on characters for now
            GROUP BY si.bangumi_id
            ORDER BY count DESC
            LIMIT 12
        `);

        const { results } = await stmt.all();

        // If no results (e.g. fresh DB), return empty list or maybe distinct random items? 
        // For now just return what we have.

        return new Response(JSON.stringify({ results }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 mins
            }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
