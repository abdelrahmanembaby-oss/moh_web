# GriidAi Website

A seven-page marketing website for GriidAi, including the platform, spatial analysis, solutions, team, and pricing pages. All site code and images are included. Running locally requires no dependency installation or build step.

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
- Other pages: `dist/about/`, `dist/platform/`, `dist/solutions/`, `dist/agentic-geoai/`, `dist/spatial-analysis/`, and `dist/pricing/`
- Styles and interactions: CSS and JavaScript files in `dist/`
- Images and fonts: `dist/assets/`

Save your changes and refresh the browser. Use the local server rather than opening `index.html` directly, because internal links use paths relative to the website root.

YouTube videos and external links require an internet connection. Site images and code are stored locally. This repository contains the GriidAi marketing website; it does not contain the geospatial analysis application's source code.

## GitHub Pages deployment

The live website is hosted at [https://abdelrahmanembaby-oss.github.io/moh_web/](https://abdelrahmanembaby-oss.github.io/moh_web/).

Pushing to `main` automatically builds and deploys `dist/` through `.github/workflows/pages.yml`. The build adjusts internal links, images, fonts, and pricing data requests for the repository path. Local files continue to work at [http://localhost:3000](http://localhost:3000).

To prepare the Pages artifact locally:

```sh
npm run build:pages
```

The generated `.deploy/` folder and local QA files are excluded from Git. Running or editing the project locally does not publish changes; deployment starts when changes are pushed to `main`.
