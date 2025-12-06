interface Env {
    DB: D1Database;
}

interface SaveRequest {
    templateId: string;
    items: Array<{
        label: string,
        imgUrl?: string,
        character?: {
            name: string
        }
    }>;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body = await request.json() as SaveRequest;
        const { templateId, items } = body;

        if (!templateId || !Array.isArray(items)) {
            return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 });
        }

        // Generate strict UUID
        const saveId = crypto.randomUUID();

        // Prepare Batch Statements
        const statements = [];

        // 1. Insert Main Record (Anonymous, No IP)
        statements.push(
            env.DB.prepare(
                'INSERT INTO saves (id, template_id) VALUES (?, ?)'
            ).bind(saveId, templateId)
        );

        // 2. Insert Items (Only those with characters)
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.character && item.character.name) {
                statements.push(
                    env.DB.prepare(
                        'INSERT INTO save_items (save_id, slot_index, character_name) VALUES (?, ?, ?)'
                    ).bind(saveId, i, item.character.name)
                );
            }
        }

        // Execute Transaction
        if (statements.length > 0) {
            await env.DB.batch(statements);
        }

        return new Response(JSON.stringify({ success: true, id: saveId }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
