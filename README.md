# cb-projects

A portfolio website for a structural engineer.

## Editing content

Selected Works, the Sketchbook and site settings are edited through Sveltia CMS at `/admin/`. See [EDITING.md](EDITING.md) for the client guide.

Content is stored as JSON in `content/` and turned into pages at build time. To try the CMS locally, run `npm start`, open `http://localhost:8080/admin/index.html` in Chrome or Edge, and choose **Work with Local Repository**.

## Testing

`npm test` builds the site into `.test-build/` and runs the Jest tests in `tests/`: every page's head, header, nav, footer, images and links, each page's own content and form, the templating and content loading, and the mobile menu script.
