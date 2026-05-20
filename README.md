# Cloudflare Custom Error Pages

Static HTML files for Cloudflare Custom Pages and Custom Error Rules.

## Important routing rule

The URL configured in Cloudflare must be fetchable by Cloudflare without any
security challenge, WAF block, Access policy, redirect loop, or login wall.

For the generic WAF block page, use:

```text
https://<pages-project>.pages.dev/403.html
```

Do not point Cloudflare's WAF block custom page at a hostname that is itself
covered by the same security rules unless that hostname and path are explicitly
skipped by the rules. Otherwise Cloudflare tries to load the custom page, blocks
or challenges that request, and the visitor sees Cloudflare's security
verification failure instead of this HTML.

## Files

| File | Use |
| --- | --- |
| `403.html` | Generic WAF block custom page |
| `403-ip.html` | IP address or country block page |
| `403-Under.html` | Interactive challenge page |
| `404.html` | 404 page |
| `429.html` | Rate limit block page |
| `500.html` | Cloudflare 5XX page |
| `1000.html` | Cloudflare 1XXX page |

## Validation

After deployment, the URL used in the Cloudflare dashboard must return the real
HTML directly:

```sh
curl -I https://<pages-project>.pages.dev/403.html
```

Expected result:

```text
HTTP/2 200
content-type: text/html
```

Bad result:

```text
HTTP/2 403
cf-mitigated: challenge
```

That bad result means the custom error page host is protected by a challenge or
WAF rule and cannot be used as the source URL until a bypass rule is added.
