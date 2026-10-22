# Purchase Requests

A web application for managing internal purchase requests. It lets users browse available items, select the ones they need, and create purchase requests through a simple, structured workflow.

## Project overview

This application brings the purchase-request process together in one interface. Users can sign in, search the item catalog, set quantities, and submit purchase requests.

It is designed for organizations that want to better organize internal purchasing, reduce data-entry errors, and improve request tracking.

## Key features

- Sign-in and session management with automatic expiration
- Paginated browsing of available items
- Search by item code or item name
- Select multiple items for a request
- Set item quantities before submitting
- Create a purchase request from the selected items
- View purchase requests created by the user
- Sign out

## Problems this project helps solve

- Reduces purchase requests handled manually by email, on paper, or through internal messaging
- Helps prevent errors when selecting items and entering quantities
- Improves tracking of submitted requests
- Saves time with item search and selection in one interface
- Provides better visibility into available items and ongoing requests

## Technology stack

- **React 19** — builds the user interface from reusable components.
- **TypeScript** — adds static types to JavaScript and helps catch some errors during development.
- **Vite** — provides the development server and builds the application.
- **Tailwind CSS 4** — styles the interface using utility classes.
- **React Router 7** — handles client-side navigation between pages.
- **Axios** — sends HTTP requests to the API, whose base URL is configured with `VITE_API_BASE_URL`.
- **TanStack Table** — provides table functionality for displaying data.
- **Radix UI** — provides accessible interface components, including dialogs, checkboxes, and select menus.
- **Sonner and Lucide React** — provide toast notifications and icons.
- **ESLint and Prettier** — support code linting and formatting.

### API

The application communicates with an external API for sign-in, item browsing, and creating or retrieving purchase requests. The routes and filters used are compatible with the SAP Business One Service Layer model. The API server is not included in this repository.

### Local configuration

Copy `.env.example` to `.env` and set `API_PROXY_TARGET` to the HTTPS URL of your SAP Business One Service Layer server. Keep `.env` private; it is excluded from Git. `API_PROXY_SECURE=false` allows the Vite development proxy to connect when the backend certificate is untrusted. Set it to `true` when the certificate is trusted. This setting only affects Vite's development proxy; production deployments must validate the backend's TLS certificate.

`VITE_API_BASE_URL` sets the API base path used by the frontend. The example points it at the Vite `/b1s` proxy.
