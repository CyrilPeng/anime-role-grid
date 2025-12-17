import { fetch } from 'undici'

const BASE_URL = 'http://localhost:8788'

async function runTests() {
    console.log('🚀 Starting API Tests against ' + BASE_URL)

    try {
        // 1. Test: Create Custom Template
        console.log('\nTesting /api/template/create...')
        const templatePayload = {
            title: "Test Template " + Date.now(),
            config: {
                cols: 3,
                items: ['A', 'B', 'C'],
                creator: 'Tester',
                templateName: 'Test Gen'
            }
        }

        // We expect this to fail if not run in Wrangler execution context, 
        // OR succeed if Wrangler correctly proxies.
        // However, create API might need specific setup.
        // Let's create a template.
        const createRes = await fetch(`${BASE_URL}/api/template/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templatePayload)
        })

        if (createRes.ok) {
            const data = await createRes.json() as any
            console.log('✅ Template Created:', data.id)

            // 2. Test: Fetch Template
            console.log(`\nTesting /api/template/${data.id}...`)
            const getRes = await fetch(`${BASE_URL}/api/template/${data.id}`)
            if (getRes.ok) {
                const tpl = await getRes.json() as any
                console.log('✅ Template Fetched:', tpl.title)
                if (tpl.title === templatePayload.title) {
                    console.log('✅ Integrity Check Passed')
                } else {
                    console.error('❌ Integrity Check Failed')
                }
            } else {
                console.error('❌ Failed to fetch template', getRes.status)
            }
        } else {
            console.error('❌ Create Failed', createRes.status, await createRes.text())
        }

        // 3. Test: Save Grid
        console.log('\nTesting /api/save...')
        const savePayload = {
            templateId: 'test_save_id',
            customTitle: 'My Test Save',
            items: [{ label: 'Slot 1', character: { id: 100, name: 'Test Char', image: 'test.jpg' } }]
        }
        const saveRes = await fetch(`${BASE_URL}/api/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(savePayload)
        })
        if (saveRes.ok) {
            const saveData = await saveRes.json() as any
            console.log('✅ Save Success:', saveData)
        } else {
            console.error('❌ Save Failed', saveRes.status, await saveRes.text())
        }

    } catch (e) {
        console.error('🚨 Test Error:', e)
        console.log('HINT: Make sure you are running "npm run dev:full" in another terminal!')
    }
}

runTests()
