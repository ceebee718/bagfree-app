# BagFree Travel Search — Phase 1

This bundle ships the **front-end search experience**, the **Supabase/PostgreSQL schema**, and a **simple admin dashboard**. Drop these three files into your repo, run the SQL, and you have a working Phase 1 foundation.

## Files

| File | Purpose |
|---|---|
| `index.html` | New homepage. Premium search bar + autocomplete + results page + RealityRank scoring + client-side analytics. Drop-in replacement for your current `index.html`. |
| `admin.html` | Standalone admin dashboard at `/admin.html`. Add/edit/delete searchable items, review failed searches, see recent events. |
| `schema.sql` | Run once in Supabase SQL editor. Creates 4 tables, ranking function, failed-searches view, RLS policies, and seed data. |

You also need (already in your repo from earlier work):
- `legacy.html` — old SPA, for `#essentials`, `#rewards` hash routes
- `concierge.html`, `curators.html`, `departure-lounge-landing.html`

## What the user sees

1. **Search bar** appears under the location pill on the homepage. Placeholder: *"Search your trip: meals, essentials, outfits, experiences…"*
2. **Empty focus** → shows 6 suggested searches (Arrival meals in Savannah, 3-day clothing rental, etc.)
3. **As they type** → live ranked results with highlighted match terms, inline images, category + city labels
4. **Enter or "See all results"** → full results page grouped by category (Essentials, Clothing, Meals, …) with image cards, RealityRank badge, city pin, CTA button
5. **Each result** routes to the correct existing page (`departure-lounge-landing.html`, `legacy.html#essentials`, `curators.html`, `concierge.html`, etc.)

## Ranking — Phase 1 formula

Each item gets a **RealityRank score** stored on the row:

```
reality_rank_score = round( popularity_score × 0.4 + conversion_score × 0.4 + freshness_score × 0.2 )
```

When a user searches, the **ranking_score** that sorts results is:

```
keyword_match_strength × 50      ← from Postgres ts_rank (full-text)
+ (city matches user's city ? 30 : 0)
+ (query exactly matches a tag ? 20 : 0)
+ reality_rank_score × 0.6
+ (item is admin-boosted ? 25 : 0)
```

This is intentionally simple. The architecture (separate `popularity`/`freshness`/`conversion`/`reality_rank` columns) supports adding verified-outcome signals, curator trust, repeat-visit data, and regret scores as future inputs without schema migration.

## Wiring to Supabase (developer task)

The front-end currently uses a hardcoded `SEARCHABLE` array. To go live:

1. **Run the schema**
   ```bash
   psql $SUPABASE_DB_URL -f schema.sql
   ```
   Or paste into Supabase SQL editor.

2. **In `index.html`, replace the `SEARCHABLE` constant** with a Supabase fetch on app load:
   ```js
   // Replace the const SEARCHABLE = [...] block with:
   const [SEARCHABLE, setSearchable] = useState([]);
   React.useEffect(() => {
     supabase.from('searchable_content').select('*').eq('is_active', true)
       .then(({data}) => setSearchable(data || []));
   }, []);
   ```

3. **Replace `rankResults` with a call to the `bf_search` RPC** for server-side ranking:
   ```js
   const { data } = await supabase.rpc('bf_search', { q: query, city_in: city.id });
   ```

4. **Replace the `track()` function** in `index.html` so it writes to `search_queries`, `search_clicks`, `search_conversions` instead of (or in addition to) localStorage:
   ```js
   function track(event, data) {
     // existing localStorage code stays for debug
     if (event === 'search_submit') {
       supabase.from('search_queries').insert({
         query: data.q, city: data.city,
         user_id: currentUserId, session_id: sessionId,
         results_count: data.results_count
       });
     }
     if (event === 'result_click' || event === 'result_click_inline') {
       supabase.from('search_clicks').insert({
         query_id: lastQueryId, content_id: data.id,
         position: data.position, user_id: currentUserId, session_id: sessionId
       });
     }
     // conversions logged from your order-success flow
   }
   ```

5. **In `admin.html`**, swap localStorage reads for Supabase admin queries (this file uses localStorage so you can demo end-to-end without a backend). The admin should be behind auth in production — anyone who can reach `/admin.html` can write content.

## Analytics events fired today

| Event | Fields | When |
|---|---|---|
| `search_submit` | `q`, `city` | User presses Enter or clicks "See all results" |
| `search_no_results` | `q`, `city` | Submit returned 0 rows |
| `search_clear` | — | User cleared the results |
| `suggestion_click` | `q`, `city` | User clicked a suggested search |
| `result_click_inline` | `id`, `q`, `city` | User clicked a result from the autocomplete dropdown |
| `result_click` | `id`, `q` | User clicked a result on the full results page |

All events are stored in `localStorage.bf_events` (capped at 500 rows). The admin dashboard's **Recent Activity** tab reads from there.

## City switcher integration

The search is already city-aware. When a user is set to Atlanta, results biased to Atlanta get +30 boost; items tagged `city = 'all'` show in every city. Switching cities does NOT clear the current search.

## What's intentionally NOT built yet (deferred to Phase 2+)

- pgvector embeddings & semantic search
- Travel Reality Graph
- Verified traveler feedback ingestion
- Hotel-proximity ranking signal
- Social-media content ingestion
- Curator-recommendation engine
- Image upload UI (admin currently uses external URLs — recommend Unsplash or Supabase Storage when ready)
- Server-side auth gate on `/admin.html` (currently the page is open; add a Supabase auth check before publishing)
- Real-time conversion tracking from the order pipeline

The schema and ranking function are structured so these can be added without breaking changes.

## Quick QA checklist before launch

- [ ] Replace seed data with real partner content via admin panel
- [ ] Run `schema.sql` against production Supabase
- [ ] Switch `SEARCHABLE` constant to Supabase fetch
- [ ] Add auth check to `admin.html`
- [ ] Confirm each `destination_url` resolves (no 404s)
- [ ] Verify analytics writes to `search_queries` table on submit
- [ ] Spot-check ranking with realistic queries: "dinner savannah", "sunscreen", "rental", "curator atlanta"
