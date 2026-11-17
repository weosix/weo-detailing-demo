# WEO Detailing Demo

Public Next.js demo landing page for a detailing studio. The project includes a public service page, lead form, and local-only owner dashboard demo.

## Run locally

```bash
cd app
npm install
npm run dev
```

Open http://localhost:3000.

## Important limitations

This is a client-side demo. Leads and dashboard edits are stored in the browser's local storage only. It has no server-side authentication, database, or real booking workflow.

Before using this as a real business site, replace the sample business settings and services in `app/app/data/site-config.ts` and add a production backend with authentication, consent handling, and secure lead storage.
