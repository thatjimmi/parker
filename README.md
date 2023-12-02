# Parker - Parking Reservation System

This application was developed to address the need for a streamlined reservation process for two parking spots within my housing association, ensuring efficient and fair access for all residents.

## Tech Stack:

- SvelteKit / JavaScript / TypeScript
- Airtable

## Features

- Make a Reservation: Allows users to easily book a parking spot.
- View Next Reservation: Enables users to see upcoming reservations for each parking spot.
- Delete Reservations: Provides an option to cancel reservations when plans change.
- Toggle Calendar Views: Switch between different calendar layouts for better date visibility.
- Reservation Logic: Ensures only two people can reserve a spot at any given time, preventing double bookings.

### Screenshots

<img width="689" alt="image" src="https://github.com/thatjimmi/parker/assets/52856973/9ddfa813-7ecc-4ebc-8026-cebd8cb2d2f6">

<img width="687" alt="image" src="https://github.com/thatjimmi/parker/assets/52856973/2a4675f6-6ffe-453d-9cfe-496c8674091c">

## How to run the project

Create a .env file with `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`.

Once you've installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

You can preview the production build with `npm run preview`.
