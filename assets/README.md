# Visual assets

For long-term reliability, prefer repository-hosted images over hotlinked images.

Recommended paths:
- `assets/stills/<work-id>.jpg` for film/series stills
- `assets/covers/<work-id>.jpg` for book covers

In an import package, a `visual` object may contain:
- `local`: repository-relative path (preferred when the asset exists)
- `url`: primary remote image
- `fallback`: secondary remote image
- `source`: credit text
- `position`: focal point such as `50% 45%`

The app now preserves `local` and `fallback` fields from imports. Remote URLs remain useful as backup sources, while repository-hosted files are the most stable option.
