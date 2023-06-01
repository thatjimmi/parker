import { error } from '@sveltejs/kit';

type event = {
    id: string,
    title: string,
    start: string,
    end: string,
}

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params}) => {
    return {
        data: [{
            id: '1',
            title: 'Event 1',
            start: new Date("2023-05-30T12:00:00"),
            end: new Date("2023-05-30T14:00:00"),
        },
        {
            id: '2',
            title: 'Event 2',
            start: '2023-05-31T12:00:00',
            end: '2023-06-01T12:00:00',
        },
        {
            id: '3',
            title: 'Event 3',
            start: '2023-05-28T12:17:00',
            end: '2023-05-28T13:00:00',
        },
    ]
    }
}