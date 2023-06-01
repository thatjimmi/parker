import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params}) => {
    // fetch localhost:3000/records
    // const res = await fetch('http://localhost:3000/records');
    // if (res.ok) {
    //     const data = await res.json();
    //     return {
    //         props: {
    //             records: data
    //         }        
    //     };
    // } else {
    //     return error(res.status, 'Could not load records');
    // }

}