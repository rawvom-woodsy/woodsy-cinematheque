# Film Club reuse guide

The repository now supports two independent pages that share the same design system and curriculum import format.

## Personal cinematheque
Open `index.html`.

- Storage namespace: `woodsy-cinematheque`
- Keeps the existing personal seed curriculum and library
- Existing progress, notes, archive, and admin data remain unchanged

## Film club
Open `club.html`.

- Storage namespace: `woodsy-film-club`
- Starts as a blank workspace
- Opens on IMPORT when no program exists
- Paste a CINEMATHEQUE IMPORT PACKAGE v2 to create the first program
- Progress, notes, branches, archive, admin edits, and library records stay separate from the personal page

## Rebranding a club
A curriculum package may optionally include a `site` object:

```json
{
  "site": {
    "brandName": "Tuesday Film Club",
    "brandJoiner": "with",
    "brandOwner": "WOODSY",
    "title": "Tuesday Film Club with WOODSY",
    "footer": "Tuesday Film Club · Screening & discussion notes"
  }
}
```

Imported branding is stored with that page's admin data and included in backups.

## Visual assets
Remote image URLs work, but repository-hosted files are more reliable. See `assets/README.md`.

Recommended convention:
- `assets/stills/<work-id>.jpg`
- `assets/covers/<work-id>.jpg`

The import format supports `local`, `url`, and `fallback` fields together.
