import { error } from '@sveltejs/kit';
import Airtable from 'airtable';
import { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } from '$env/static/private';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ fetch }) => {
  let events = [];

  const response = await fetch('/api/airtable')

  if (response.ok) {
    events = await response.json();
  } else {
    return error(response.status);
  }



  return {
    data: events
  };
};

