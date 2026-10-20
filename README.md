# GriidAi Website

A static marketing website for GriidAi, including platform, spatial analysis, solutions, team, pricing and six connected content hubs: Data, Industries, Use Cases, Workflows, Ecosystem and Enterprise. All site code and images are included. Running locally requires no dependency installation or build step.

[View the live website](https://abdelrahmanembaby-oss.github.io/moh_web/)

## Run on Windows

1. Install Node.js 18 or newer if it is not already installed.
2. Clone this repository or download and extract the complete project.
3. Open `START-WINDOWS.bat` inside the project folder.
4. Open [http://localhost:3000](http://localhost:3000) in your browser and keep the server window open.

## Run with Node.js

Open a terminal in the project folder and run:

```sh
npm start
```

Visit [http://localhost:3000](http://localhost:3000). Press `Ctrl+C` in the terminal to stop the server.

## Alternative: Python

If Python 3 is installed, run:

```sh
python -m http.server 3000 --bind 127.0.0.1 --directory dist
```

Then visit [http://localhost:3000](http://localhost:3000).

## Edit the website

- Homepage: `dist/index.html`
- Other pages: `dist/about/`, `dist/platform/`, `dist/solutions/`, `dist/agentic-geoai/`, `dist/spatial-analysis/`, `dist/pricing/`, and `dist/contact-sales.html`
- Styles and interactions: CSS and JavaScript files in `dist/`
- Images and fonts: `dist/assets/`

### Content hubs and shared navigation

The six content hubs use the existing site's colors, typography, header and footer. They are generated as complete HTML, with optional JavaScript for filters, inline details and inquiry handling. Their content remains readable without JavaScript. Detailed industry, use-case and example methods live under stable anchors; no unpublished detail routes are linked.

- Editorial records: `scripts/hub-content.cjs`
- Shared templates, navigation and page copy: `scripts/build-hubs.cjs`
- Source-based FAQ copy: `scripts/hub-faqs.json`
- Hub styling and interactions: `dist/hubs.css`, `dist/hubs.js`
- Shared navigation: `dist/site-shell.css`, `dist/site-navigation.js`

After changing hub content or shared templates, run:

```sh
npm run build:content
```

The generator also updates navigation and footer links on retained pages. Edit records/templates rather than generated hub HTML. It preserves existing content anchors and the legacy Contact Sales route.

Provider records were not supplied with the six October 2026 specifications. The Data directory therefore uses the specified empty state rather than fabricated integrations. Format notes are a handling reference; direction-specific compatibility and verification dates remain unclaimed until verified. Workflow records are labeled **Example**, with inputs, methods, validation and limitations, rather than asserted as production-ready one-click workflows.

The ecosystem inquiry at `/ecosystem/express-interest/` uses the existing Contact Sales Google Apps Script endpoint and its field contract. Paths, interests, participant type, message and permission context are included in `gisUsage`. No backend changes or separate CRM are introduced. Because the endpoint uses `no-cors`, the browser cannot confirm durable storage or email delivery; the UI states this and retains the answers. Validate the receiving Sheet/email handler with the service owner before claiming confirmed receipt. QA uses intercepted requests and does not submit live test inquiries.

Save your changes and refresh the browser. Use the local server rather than opening `index.html` directly, because internal links use paths relative to the website root.

YouTube videos and external links require an internet connection. Site images and code are stored locally. This repository contains the GriidAi marketing website; it does not contain the geospatial analysis application's source code.

## GitHub Pages deployment

The live website is hosted at [https://abdelrahmanembaby-oss.github.io/moh_web/](https://abdelrahmanembaby-oss.github.io/moh_web/).

Pushing to `main` automatically builds and deploys `dist/` through `.github/workflows/pages.yml`. The build adjusts internal links, images, fonts, sitemap URLs, and data requests for the repository path. Local files continue to work at [http://localhost:3000](http://localhost:3000).

To prepare the Pages artifact locally:

```sh
npm run build:pages
```

The generated `.deploy/` folder and local QA files are excluded from Git. Running or editing the project locally does not publish changes; deployment starts when changes are pushed to `main`.

The Contact Sales page uses the legacy `/contact-sales.html` path. The previous `/contact-sales/` path redirects to it and preserves query parameters and anchors. To restore `https://www.griidai.com/contact-sales.html`, deploy these static files to the existing hosting service for that domain; publishing to this GitHub Pages repository does not update that separate host.
