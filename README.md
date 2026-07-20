# SteadyDesk IT website

Multi-page lead-generation website for a managed IT support company serving small businesses.

## Content and company settings

Edit `app/config/site-config.ts` to update the brand name, company name, corporate email, website, address, company ID, navigation links, footer copy, and form messages.

Service copy and service-page content live in `app/content/services.ts`.

## Email delivery

The contact forms submit to `app/api/contact/route.ts`, which delivers each request to the corporate email configured in `site-config.ts`.

Set the two values documented in `.env.example` before accepting live requests:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

The sending address must use a domain verified with the email provider.

## Local development

```bash
npm install
npm run dev
npm run build
```
