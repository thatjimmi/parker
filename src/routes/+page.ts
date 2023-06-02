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
            title: '4B, 3.th',
            start: "2023-06-02T12:00:00",
            end: "2023-06-15T14:00:00",
        },
        {
            id: '2',
            title: '4A, 2.tv',
            start: '2023-05-31T12:00:00',
            end: '2023-06-01T12:00:00',
        },
        {
            id: '3',
            title: '4B, 1.tv',
            start: '2023-05-28T12:17:00',
            end: '2023-05-28T13:00:00',
        },
    ]
    }
}