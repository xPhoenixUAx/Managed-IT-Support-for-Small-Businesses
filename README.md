# SteadyDesk IT

Framework-free multi-page website built with semantic HTML, handcrafted CSS, and vanilla JavaScript. There is no React, Next.js, vinext, Vite, Tailwind, Bootstrap, or other front-end framework.

## Edit repeated site data

Update `config/site-config.mjs` to change the site name, company name, corporate email, website, address, company ID, navigation, footer copy, form labels, request types, and success message.

Service content is maintained in `config/services.mjs`. Every service automatically receives its own detailed HTML page during the build.

## Commands

- `npm run dev` builds and serves the vanilla site locally.
- `npm run build` creates production HTML/CSS/JS and the small email-delivery Worker in `dist/`.
- `npm test` verifies all routes, config rendering, lack of framework output, and form validation.

## Email delivery

The form posts to `/api/contact`. Configure `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in the hosted environment. `RESEND_FROM_EMAIL` must use a verified sender domain.
