# Cutover Checklist

## Pre-cutover
- [ ] Hyperdrive binding is configured in production Worker.
- [ ] All DB queries pass through repository/service layer.
- [ ] URL regression set for `/:lang/:year/*` routes is green.
- [ ] `robots.txt`, `sitemap.xml`, `manifest.json`, `service-worker.js` served on Pages.

## Cutover
- [ ] Route traffic switched to gbbinfo4.0 Pages project.
- [ ] Legacy Flask service removed from DNS upstream.
- [ ] Health endpoint monitored for 5xx and latency spikes.

## Post-cutover
- [ ] Search, participant list, result, world map flows verified.
- [ ] External adapters (Tavily/DeepL/Sheets) verified.
- [ ] Legacy Flask runtime and Render resources decommissioned.
