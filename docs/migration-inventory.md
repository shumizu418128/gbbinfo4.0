# gbbinfo3.0 Inventory

## Route Inventory

### Redirect / Utility
- `/` -> latest year top redirect
- `/lang` -> language switch endpoint (deprecated in Remix migration)
- `/health` -> commit hash

### Dynamic Content Pages
- `/:lang/:year/top`
- `/:lang/:year/ticket`
- `/:lang/:year/timetable`
- `/:lang/:year/stream`
- `/:lang/:year/rule`
- `/:lang/:year/wildcards`
- `/:lang/:year/result`
- `/:lang/:year/participants`
- `/:lang/:year/cancels`
- `/:lang/:year/japan`
- `/:lang/:year/korea`
- `/:lang/:year/world_map`
- `/:lang/participant_detail/:participantId/:mode`
- `/:lang/others/:content`
- `/:lang/travel/:content`

### POST Endpoints
- `/search_suggestions`
- `/:year/search`
- `/:year/search_participants`
- `/beatboxer_tavily_search`
- `/answer_translation`
- `/notice`

### Static / SEO
- `/sitemap.xml`
- `/robots.txt`
- `/ads.txt`
- `/manifest.json`
- `/service-worker.js`

## Environment Variables Inventory

### Cloudflare Worker / Pages Secrets
- `DATABASE_URL` (Hyperdrive origin connection string)
- `HYPERDRIVE` (binding name)
- `TAVILY_API_KEY`
- `DEEPL_API_KEY`
- `GOOGLE_SHEET_CREDENTIALS`
- `RENDER_GIT_COMMIT` (optional legacy compatibility)

### Build-time Public Variables
- `VITE_DEFAULT_YEAR`
- `VITE_SITE_ORIGIN`

## External Integrations
- Supabase PostgreSQL (via Hyperdrive only)
- Tavily Search API
- DeepL Translation API
- Google Sheets API

## Migration Constraints
- Language source of truth is URL only (`/:lang/...`).
- No cookies and no session storage.
- All DB access must go through Hyperdrive helper.
