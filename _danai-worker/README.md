# DanAI worker

DanAI is the chat widget on the portfolio (`js/danai.js`, `css/danai.css`). This folder is the small server it talks to: a Cloudflare Worker that holds the Anthropic API key and sends questions to Claude with `knowledge.md` as the only source of facts.

GitHub Pages doesn't publish folders that start with `_`, so nothing in here goes on the live site.

## Files

- `worker.js`: the Worker. It only accepts requests from danpitrowiski.github.io and localhost:8000. It sends at most 10 messages of history and 600 characters per question, and returns `{ answer, sources }`.
- `faq.md`: your own answers to common questions. DanAI gives these close to word for word, and they win over the rest of the site. Instructions are at the top of the file.
- `knowledge.md`: the text of the seven live pages plus the resume, with the phone number removed. Generated; don't edit by hand.
- `build-knowledge.py`: rebuilds `knowledge.md`. Run it after changing a page or the resume, then deploy again.
- `schema.sql`: the question log table.
- `wrangler.toml`: Worker settings. The model is set in `MODEL`, and the rate limit is 20 questions a minute per visitor.

## Set it up (about 15 minutes, once)

1. Get an Anthropic API key at https://console.anthropic.com (Settings → API Keys). Add a few dollars of credit and set a monthly spend limit under Settings → Limits.
2. Make a free Cloudflare account at https://dash.cloudflare.com/sign-up.
3. In Terminal, from the repo folder:

   ```sh
   cd _danai-worker
   npx wrangler login                          # opens the browser to sign in to Cloudflare
   npx wrangler secret put ANTHROPIC_API_KEY   # paste the key when it asks
   npx wrangler deploy
   ```

   The deploy prints a URL like `https://danai.<your-name>.workers.dev`.
4. Paste that URL into `js/danai.js`: `var ENDPOINT = 'https://danai.<your-name>.workers.dev';`
5. Preview locally (`python3 -m http.server 8000` in the repo root), ask a question, then commit and push.

If `wrangler deploy` complains about `[[ratelimits]]`, delete that block from `wrangler.toml` and deploy again.

## See what people ask

Every question is saved to a free Cloudflare D1 database: the time (UTC), the page it was asked from, the question, DanAI's answer, which FAQ answered it (if any) and whether it worked. Nothing that identifies the visitor is saved.

Set it up once, from this folder:

```sh
npx wrangler d1 create danai-questions
```

Copy the `database_id` it prints into `wrangler.toml` (replace `PASTE-DATABASE-ID-HERE`), then:

```sh
npx wrangler d1 execute danai-questions --remote --file=schema.sql
npx wrangler deploy
```

To see the latest 20 questions:

```sh
npx wrangler d1 execute danai-questions --remote --command "SELECT asked_at, page, faq, question FROM questions ORDER BY id DESC LIMIT 20"
```

To see the questions people ask most:

```sh
npx wrangler d1 execute danai-questions --remote --command "SELECT question, COUNT(*) AS times FROM questions GROUP BY lower(question) ORDER BY times DESC LIMIT 20"
```

You can also browse the table in the Cloudflare dashboard: Storage & Databases → D1 → danai-questions → Tables → questions.

## After you change faq.md, a page or the resume

```sh
python3 _danai-worker/build-knowledge.py
cd _danai-worker && npx wrangler deploy
```

## Cost

Each question sends about 17,000 tokens of knowledge. Claude Haiku 5.5 costs $0.10 per million input tokens and $0.50 per million output tokens, and the knowledge is cached for 5 minutes between questions. That works out to about $0.002 for the first question in a visit and about $0.0003 for each one after it. Keep `knowledge.md` under 100,000 tokens (about 400,000 characters): above that, Haiku 5.5 charges 5 times as much. The spend limit in step 1 caps it either way.

## Preview without the Worker

While `ENDPOINT` is empty the widget stays hidden on the site. Add `?danai` to any page URL (for example `http://localhost:8000/?danai`) to see it in preview mode. "Can I email you?" always answers in the browser, without the Worker.
