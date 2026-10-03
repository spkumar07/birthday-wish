# Little Moments

A small, dependency-free website builder for birthday, anniversary, and just-because keepsakes.

## Run locally

Install Node.js 18 or newer, then run:

```sh
npm start
```

Open <http://localhost:8000>. Run `npm run check` to check the server and browser script syntax.

## Publish with GitHub Pages

Create an empty GitHub repository, then run these commands from this project folder. Replace the URL with your repository's HTTPS URL:

```sh
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git add .gitignore .nojekyll README.md index.html package.json server.js assets .github/workflows/pages.yml
git commit -m "Prepare Little Moments for GitHub Pages"
git push -u origin main
```

In the repository, open **Settings → Pages** and set the source to **GitHub Actions**. The workflow deploys the builder after each push to `main` or `master`; its public artifact contains `index.html`, `assets/`, and only generated pages you deliberately committed under `webs/`.

GitHub Pages is static hosting and cannot run the local Node save API. Generated pages are not automatically published; to publish one deliberately, put its HTML file under `webs/` and force-add that single page, for example `git add -f webs/my-celebration.html`. The workflow copies only committed `webs/*.html` pages into the public site. `.gitignore` excludes generated root pages and `webs/*.html` by default so personal cards are not pushed accidentally.

## Project layout

```text
index.html          Builder interface
assets/styles.css   Builder and generated-page styles
assets/app.js       Form, preview, and page generation
server.js           Local static server and generated-page API
webs/               Saved standalone celebration pages
```

Generated pages are written to `webs/` and can be opened from the result screen. The download button saves a copy. Existing generated pages are kept when names are reused; a number is added to make each filename unique.

Choose one separate profile photo, up to 8 slideshow photos, and one audio track; all selected media together must stay under 8 MB. Memory photos are shown as a smooth auto-advancing slideshow with previous/next controls. The optional looping song is embedded in the generated page and starts only when its audio play button is pressed. Google Fonts and QR images use online services, so those assets need an internet connection.

## Payments

Elite checkout is not connected or charged in this local demo. Connect a payment provider and verify its server-side payment result before enabling paid-page delivery. The support QR uses the support URL entered in the builder; without one, it is only a sample QR.