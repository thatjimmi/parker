import { error } from '@sveltejs/kit';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '$env/static/private';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch, params }) => {
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
              start: new Date(record.get('start')),
              end: new Date(record.get('end'))
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

  return {
    data: events
  };
};

