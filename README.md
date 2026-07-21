# SteadyDesk IT

Static website built with plain HTML, CSS, and JavaScript. Form delivery is handled by PHP. The project has no Node.js, npm, framework, or build dependency.

## Updating shared site data

1. Edit `config/config.js`.
2. Regenerate the SEO-ready HTML:

   ```sh
   php tools/sync-config.php
   ```

3. Confirm that every page matches the config:

   ```sh
   php tools/sync-config.php --check
   ```

The generated values are intentionally written into all HTML pages so search engines and visitors without JavaScript receive complete content. Do not manually edit shared company, contact, navigation, footer, or form values in the HTML files; change `config/config.js` and run the sync command instead.

## Local preview

`index.html` can be opened directly from the folder. To test PHP form delivery locally, run:

```sh
php -S 127.0.0.1:8000
```

Then open `http://127.0.0.1:8000/`.

## Deployment

Upload the repository contents to a PHP-enabled web root. The recipient mailbox and sender address are configured in `config/config.js`; the hosting environment must allow PHP `mail()` delivery.
