# Simple crawler

> 差點重工啦
> See https://github.com/kiang/landchg.tcd.gov.tw

### Setup

```bash
pnpm install
pnpm exec playwright install chromium
```

### Run Crawler


```bash
# Crawl the raw html first
# You might need to run quite few times if the crawl hangs
# But that's okay, we have progress saved so that won't run same year/city twice
pnpm exec playwright test tests/example.spec.ts --project chromium


# Then convert the raw html into JSON data
pnpm generate
```

