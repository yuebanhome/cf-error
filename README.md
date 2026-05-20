# Cloudflare Error Pages

Static error pages designed to be deployed on Cloudflare Pages and referenced from Cloudflare Custom Pages or Custom Error Rules.

## Pages

| File | Use |
| --- | --- |
| `403-ip.html` | IP address or country block page |
| `403-block.html` | Generic WAF or security block page |
| `403-Under.html` | Interactive challenge page with `::CAPTCHA_BOX::` |
| `403-under.html` | Lowercase alias for `403-Under.html` |
| `403-non-interactive.html` | Non-interactive challenge page with `::IM_UNDER_ATTACK_BOX::` |
| `404.html` | Cloudflare Pages project 404 and optional custom 404 asset |
| `429.html` | Rate limit block page |
| `500.html` | Cloudflare 5XX error page with `::CLOUDFLARE_ERROR_500S_BOX::` |
| `1000.html` | Cloudflare 1XXX error page with `::CLOUDFLARE_ERROR_1000S_BOX::` |

## Deployment

Deploy the repository as a Cloudflare Pages project with no build command. The output directory is the repository root.

After deployment, use the final public URLs in Cloudflare:

```text
https://<project>.pages.dev/403-ip.html
https://<project>.pages.dev/403-block.html
https://<project>.pages.dev/403-Under.html
https://<project>.pages.dev/403-non-interactive.html
https://<project>.pages.dev/404.html
https://<project>.pages.dev/429.html
https://<project>.pages.dev/500.html
https://<project>.pages.dev/1000.html
```

Cloudflare fetches the HTML and local assets when you save the custom page. Make sure every referenced URL returns `200 OK`.

## Notes

- Challenge pages keep Cloudflare token placeholders visible in the HTML. Do not remove them.
- The CSS avoids fixed viewport clipping so Cloudflare-injected boxes can expand naturally.
- All assets are local to the Pages project. No CDN, remote font, or remote image dependency is required.
- Source-origin 500 responses may require Custom Error Rules depending on the Cloudflare plan. Product-triggered Cloudflare 5XX and 1XXX errors use the dedicated token pages.
- The lowercase `403-under.html` page duplicates `403-Under.html` on purpose. Cloudflare Pages paths are case-sensitive, and custom page fetches should not depend on redirects.
