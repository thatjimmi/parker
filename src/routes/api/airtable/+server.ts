import { error, json } from '@sveltejs/kit';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '$env/static/private';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/** @type {import('./$types').RequestHandler}*/
export const POST = async ({ request }) => {
    const body = await request.json()

     try {
        const records = await base('Table 1').create(body);
    } catch (err) {
        return new Response(err.message || err.toString(), {
            status: err.status || 500,
            headers: {
                'content-type': 'application/json'
            }
        });

    }
    
    return new Response(JSON.stringify(body), {
        headers: {
            'content-type': 'application/json'
        }
    })
};

export const GET = async ({ request }) => {
    let events = [];

    await new Promise<void>((resolve, reject) => {
        base('Table 1')
            .select({
                view: 'Grid view'
            })
            .eachPage(
                function page(records, fetchNextPage) {
                    records.forEach(function (record) {
                        events.push({
                            id: record.id,
                            title: record.get('apartment'),
                            start: record.get('start'),
                            end: record.get('end')
                        });
                    });

                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }
                    resolve();
                }
            );
    });

    return new Response(JSON.stringify(events), {
        headers: {
            'content-type': 'application/json'
        }
    })
}